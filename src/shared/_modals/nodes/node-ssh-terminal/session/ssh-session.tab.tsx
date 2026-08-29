import type {
    ISshSessionHandle,
    ISshSessionStatus,
    ISshTarget,
    TStage
} from '../ssh-terminal.types'

import { Box, Button, Center, Loader } from '@mantine/core'
import { GetNodeCommand } from '@remnawave/backend-contract'
import { Terminal } from '@xterm/xterm'
import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useEffectEvent, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TbPlugConnected } from 'react-icons/tb'

import { getAuthorizationToken, getBackendDomain } from '@shared/api'
import { useCreateSshTicket } from '@shared/api/hooks'

import type { INodeKeyInfo } from '@entities/ssh-vault'
import { useSshVaultActions, useSshVaultStatus } from '@entities/ssh-vault'

import classes from '../NodeSshTerminal.module.css'
import { ConnectionLogScreen } from './connection-log.screen'
import { ConnectionSetupScreen } from './connection-setup.screen'
import { HostKeyOverlay } from './host-key.overlay'
import { KeyImportOverlay } from './key-import.overlay'
import { ISshHostKeyPrompt, SshConnection, TSshStage } from './ssh-connection'
import { TerminalView } from './terminal.view'

interface IProps {
    isHidden: boolean
    node: GetNodeCommand.Response['response']
    onRegister: (handle: ISshSessionHandle | null) => void
    onStatusChange: (status: ISshSessionStatus) => void
}

export const SshSessionTab = (props: IProps) => {
    const { isHidden, node, onRegister, onStatusChange } = props
    const { t } = useTranslation()

    const vaultStatus = useSshVaultStatus()
    const vaultActions = useSshVaultActions()

    const { mutateAsync: createTicket } = useCreateSshTicket()

    const [stage, setStage] = useState<TStage>('setup')
    const [connectStage, setConnectStage] = useState<TSshStage>('ticket')
    const [nodeKey, setNodeKey] = useState<INodeKeyInfo | null>(null)
    const [target, setTarget] = useState<ISshTarget>({
        host: node.address,
        port: 22,
        username: 'root'
    })
    const [hostKeyPrompt, setHostKeyPrompt] = useState<ISshHostKeyPrompt | null>(null)
    const [error, setError] = useState<null | string>(null)
    const [isImportingKey, setIsImportingKey] = useState(false)
    const [size, setSize] = useState('80×24')
    const [statusText, setStatusText] = useState<null | string>(null)

    const connectionRef = useRef<null | SshConnection>(null)
    const terminalRef = useRef<null | Terminal>(null)
    const pendingOutputRef = useRef<Uint8Array[]>([])
    const hostKeyResolverRef = useRef<((accepted: boolean) => void) | null>(null)
    const autoConnectedRef = useRef(false)
    const attemptRef = useRef(0)

    const teardown = useCallback(() => {
        attemptRef.current += 1
        hostKeyResolverRef.current?.(false)
        hostKeyResolverRef.current = null
        connectionRef.current?.close()
        connectionRef.current = null
        pendingOutputRef.current = []
        terminalRef.current = null
        setHostKeyPrompt(null)
    }, [])

    useEffect(() => () => teardown(), [teardown])

    const emitStatus = useEffectEvent((status: ISshSessionStatus) => onStatusChange(status))

    useEffect(() => {
        emitStatus({
            isConnected: stage === 'session' && !statusText,
            size,
            stage,
            statusText,
            target
        })
    }, [size, stage, statusText, target])

    const connect = useCallback(
        async (nextTarget: ISshTarget) => {
            teardown()

            const attempt = attemptRef.current
            const isStale = () => attempt !== attemptRef.current

            const [privateKey, key] = await Promise.all([
                vaultActions.getPrivateKey(node.uuid),
                vaultActions.ensureNodeKey(node.uuid)
            ])

            if (!privateKey || !key) return

            const discardKey = () => privateKey.material.fill(0)
            const isAbandoned = () => {
                if (!isStale()) return false

                discardKey()
                return true
            }

            if (isAbandoned()) return

            setTarget(nextTarget)
            setConnectStage('ticket')
            setStatusText(null)
            setError(null)
            setStage('connecting')

            let ticket
            try {
                ticket = await createTicket({ route: { uuid: node.uuid } })
            } catch (requestError) {
                if (isAbandoned()) return

                discardKey()
                setError(
                    requestError instanceof Error
                        ? requestError.message
                        : t('node-ssh.ticket-failed')
                )
                setStage('failed')
                return
            }

            if (isAbandoned()) return

            if (!ticket) {
                discardKey()
                setError(t('node-ssh.ticket-failed'))
                setStage('failed')
                return
            }

            await vaultActions.saveProfile({ nodeUuid: node.uuid, ...nextTarget })

            if (isAbandoned()) return

            const connection = new SshConnection(
                {
                    cols: 80,
                    rows: 24,
                    host: nextTarget.host,
                    port: nextTarget.port,
                    username: nextTarget.username,
                    privateKey,
                    publicKeyLine: key.publicKey,
                    ticket: ticket.ticket,
                    token: getAuthorizationToken(),
                    url: `${getBackendDomain().replace(/^http/, 'ws')}${ticket.path}`
                },
                {
                    onStage: setConnectStage,
                    onHostKey: async (prompt) => {
                        const knownFingerprint = await vaultActions.trustedFingerprint(
                            prompt.target
                        )
                        if (knownFingerprint === prompt.fingerprint) return true

                        setHostKeyPrompt({ ...prompt, knownFingerprint })

                        return new Promise<boolean>((resolve) => {
                            hostKeyResolverRef.current = resolve
                        })
                    },
                    onReady: () => setStage('session'),
                    onData: (chunk) => {
                        if (terminalRef.current) terminalRef.current.write(chunk)
                        else pendingOutputRef.current.push(chunk)
                    },
                    onError: (message) => {
                        setStatusText(message)

                        setStage((current) => {
                            if (current === 'session') {
                                terminalRef.current?.writeln(`\r\n\x1b[31m${message}\x1b[0m`)
                                return current
                            }

                            setError(message)
                            return 'failed'
                        })
                    },
                    onClosed: (reason) => {
                        setStatusText(`${t('node-ssh.disconnected')}: ${reason}`)
                        terminalRef.current?.writeln(
                            `\r\n\x1b[90m${t('node-ssh.disconnected')}: ${reason}\x1b[0m`
                        )
                    }
                }
            )

            connectionRef.current = connection
            connection.open()
        },
        [node.uuid, createTicket, vaultActions, teardown, t]
    )

    useEffect(() => {
        if (vaultStatus !== 'unlocked' || autoConnectedRef.current) return

        autoConnectedRef.current = true

        void (async () => {
            setNodeKey(await vaultActions.ensureNodeKey(node.uuid))

            const profile = await vaultActions.getProfile(node.uuid)
            if (!profile) return

            setTarget(profile)
            await connect({
                host: profile.host,
                port: profile.port,
                username: profile.username
            })
        })()
    }, [vaultStatus, node.uuid])

    const showSettings = useCallback(() => {
        teardown()
        setStage('setup')
    }, [teardown])

    const emitRegister = useEffectEvent((handle: ISshSessionHandle | null) => onRegister(handle))

    useEffect(() => {
        emitRegister({
            showSettings,
            write: (data) => connectionRef.current?.write(data)
        })

        return () => emitRegister(null)
    }, [showSettings])

    const resolveHostKey = async (accepted: boolean) => {
        if (!hostKeyResolverRef.current) return

        if (accepted && hostKeyPrompt) {
            await vaultActions.rememberHost(
                hostKeyPrompt.target,
                hostKeyPrompt.algo,
                hostKeyPrompt.fingerprint
            )
        }

        setHostKeyPrompt(null)
        hostKeyResolverRef.current?.(accepted)
        hostKeyResolverRef.current = null

        if (!accepted) showSettings()
    }

    const renderScreen = () => {
        if (stage === 'setup') {
            if (!nodeKey) {
                return (
                    <Center flex={1}>
                        <Loader size="sm" />
                    </Center>
                )
            }

            return (
                <Box className={classes.screen}>
                    <ConnectionSetupScreen
                        initial={target}
                        nodeAddress={node.address}
                        nodeIps={node.ips}
                        nodeKey={nodeKey}
                        onConnect={(next) => void connect(next)}
                        onOpenKeyImport={() => setIsImportingKey(true)}
                        onRegenerateKey={async () => {
                            setNodeKey(await vaultActions.regenerateNodeKey(node.uuid))
                        }}
                    />
                </Box>
            )
        }

        if (stage === 'connecting' || stage === 'failed') {
            return (
                <Box className={classes.screen}>
                    <ConnectionLogScreen
                        error={error}
                        onOpenSettings={showSettings}
                        onRetry={() => void connect(target)}
                        stage={connectStage}
                        target={`${target.username}@${target.host}:${target.port}`}
                    />
                </Box>
            )
        }

        return (
            <TerminalView
                isPaused={isHidden}
                onInput={(data) => connectionRef.current?.write(data)}
                onResize={(cols, rows) => {
                    setSize(`${cols}×${rows}`)
                    connectionRef.current?.resize(cols, rows)
                }}
                onTerminal={(terminal) => {
                    terminalRef.current = terminal
                    if (!terminal) return

                    for (const chunk of pendingOutputRef.current) terminal.write(chunk)
                    pendingOutputRef.current = []
                }}
            />
        )
    }

    return (
        <Box className={classes.sessionHost} display={isHidden ? 'none' : undefined}>
            {renderScreen()}

            <AnimatePresence>
                {stage === 'session' && statusText && (
                    <motion.div
                        animate={{ opacity: 1, y: 0 }}
                        className={classes.reconnectBar}
                        exit={{ opacity: 0, y: 8 }}
                        initial={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <Button
                            leftSection={<TbPlugConnected size={16} />}
                            onClick={() => void connect(target)}
                            size="xs"
                            variant="soft"
                        >
                            {t('node-ssh.retry')}
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isImportingKey && (
                    <KeyImportOverlay
                        onClose={() => setIsImportingKey(false)}
                        onImport={async (privateKey) => {
                            setNodeKey(await vaultActions.importNodeKey(node.uuid, privateKey))
                        }}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {hostKeyPrompt && (
                    <HostKeyOverlay
                        onAbort={() => void resolveHostKey(false)}
                        onTrust={() => void resolveHostKey(true)}
                        prompt={hostKeyPrompt}
                    />
                )}
            </AnimatePresence>
        </Box>
    )
}
