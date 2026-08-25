import NiceModal, { useModal } from '@ebay/nice-modal-react'
import {
    ActionIcon,
    Box,
    Center,
    FloatingWindow,
    Group,
    Loader,
    Text,
    Tooltip
} from '@mantine/core'
import { GetNodeCommand } from '@remnawave/backend-contract'
import { Terminal } from '@xterm/xterm'
import { AnimatePresence } from 'motion/react'
import { useCallback, useEffect, useEffectEvent, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
    TbArrowsMaximize,
    TbArrowsMinimize,
    TbSettings,
    TbShieldLock,
    TbTerminal2,
    TbX
} from 'react-icons/tb'

import { getAuthorizationToken, getBackendDomain } from '@shared/api'
import { useCreateSshTicket } from '@shared/api/hooks'
import { registerScrollLockShard } from '@shared/utils/scroll-lock-shards'

import type { INodeKeyInfo, ISshSnippet } from '@entities/ssh-vault'
import {
    useSshVaultActions,
    useSshVaultHasPasscode,
    useSshVaultPasscodeAttempts,
    useSshVaultPasscodeLength,
    useSshVaultStatus
} from '@entities/ssh-vault'

import { ConnectionLogScreen } from './connection-log.screen'
import { ConnectionSetupScreen, ISshTarget } from './connection-setup.screen'
import { HostKeyOverlay } from './host-key.overlay'
import { KeyImportOverlay } from './key-import.overlay'
import classes from './NodeSshTerminal.module.css'
import { PasscodeRequiredScreen } from './passcode-required.screen'
import { SnippetsBar } from './snippets-bar'
import { SnippetsOverlay } from './snippets.overlay'
import { ISshHostKeyPrompt, SshConnection, TSshStage } from './ssh-connection'
import { TerminalView } from './terminal.view'
import { VaultManageScreen } from './vault-manage.screen'
import { VaultSetupScreen } from './vault-setup.screen'
import { VaultUnlockScreen } from './vault-unlock.screen'

type TStage = 'connecting' | 'failed' | 'session' | 'setup'

interface IProps {
    node: GetNodeCommand.Response['response']
}

interface IWindowProps {
    modal: ReturnType<typeof useModal>
    node: GetNodeCommand.Response['response']
}

const SshTerminalWindow = (props: IWindowProps) => {
    const { modal, node } = props
    const { t } = useTranslation()

    const vaultStatus = useSshVaultStatus()
    const vaultActions = useSshVaultActions()
    const hasPasscode = useSshVaultHasPasscode()
    const passcodeAttemptsLeft = useSshVaultPasscodeAttempts()
    const passcodeLength = useSshVaultPasscodeLength()

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
    const [isMaximized, setIsMaximized] = useState(false)
    const [isManagingVault, setIsManagingVault] = useState(false)
    const [snippets, setSnippets] = useState<ISshSnippet[]>([])
    const [isEditingSnippets, setIsEditingSnippets] = useState(false)
    const [isImportingKey, setIsImportingKey] = useState(false)
    const [size, setSize] = useState('80×24')
    const [statusText, setStatusText] = useState<null | string>(null)

    const connectionRef = useRef<null | SshConnection>(null)
    const terminalRef = useRef<null | Terminal>(null)
    const hostKeyResolverRef = useRef<((accepted: boolean) => void) | null>(null)
    const autoConnectedRef = useRef(false)

    const registerShard = useCallback(
        (node: HTMLDivElement | null) => (node ? registerScrollLockShard(node) : undefined),
        []
    )

    const teardown = useCallback(() => {
        hostKeyResolverRef.current?.(false)
        hostKeyResolverRef.current = null
        connectionRef.current?.close()
        connectionRef.current = null
        setHostKeyPrompt(null)
    }, [])

    const close = useCallback(() => {
        teardown()
        modal.hide()
        modal.remove()
    }, [teardown, modal])

    useEffect(() => {
        void vaultActions.refresh()
    }, [])

    useEffect(() => () => teardown(), [teardown])

    const refreshSnippets = useEffectEvent(async () => {
        setSnippets(await vaultActions.listSnippets())
    })

    useEffect(() => {
        if (vaultStatus !== 'unlocked') return

        let cancelled = false

        vaultActions.listSnippets().then((list) => {
            if (!cancelled) setSnippets(list)
        })

        return () => {
            cancelled = true
        }
    }, [vaultStatus])

    const connect = useCallback(
        async (nextTarget: ISshTarget) => {
            teardown()

            const [privateKey, key] = await Promise.all([
                vaultActions.getPrivateKey(node.uuid),
                vaultActions.ensureNodeKey(node.uuid)
            ])

            if (!privateKey || !key) return

            setTarget(nextTarget)
            setConnectStage('ticket')
            setStatusText(null)
            setError(null)
            setStage('connecting')

            let ticket
            try {
                ticket = await createTicket({ route: { uuid: node.uuid } })
            } catch (requestError) {
                setError(
                    requestError instanceof Error
                        ? requestError.message
                        : t('node-ssh.ticket-failed')
                )
                setStage('failed')
                return
            }

            if (!ticket) {
                setError(t('node-ssh.ticket-failed'))
                setStage('failed')
                return
            }

            await vaultActions.saveProfile({ nodeUuid: node.uuid, ...nextTarget })

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
                    onData: (chunk) => terminalRef.current?.write(chunk),
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

        void (async () => {
            setNodeKey(await vaultActions.ensureNodeKey(node.uuid))

            const profile = await vaultActions.getProfile(node.uuid)
            if (!profile) return

            autoConnectedRef.current = true
            setTarget(profile)
            await connect({
                host: profile.host,
                port: profile.port,
                username: profile.username
            })
        })()
    }, [vaultStatus, node.uuid])

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

        if (!accepted) {
            teardown()
            setStage('setup')
        }
    }

    const renderBody = () => {
        if (vaultStatus === 'unknown') {
            return (
                <Center flex={1}>
                    <Loader size="sm" />
                </Center>
            )
        }

        if (isManagingVault) {
            return (
                <Box className={classes.screen}>
                    <VaultManageScreen
                        canExport={vaultStatus === 'unlocked'}
                        hasVault={vaultStatus !== 'absent'}
                        onCreateNew={() => setIsManagingVault(false)}
                        onExport={vaultActions.exportVault}
                        onImport={async (backup, seedPhrase) => {
                            const restored = await vaultActions.importVault(backup, seedPhrase)
                            if (restored) setIsManagingVault(false)
                            return restored
                        }}
                        onReset={() => void vaultActions.reset()}
                    />
                </Box>
            )
        }

        if (vaultStatus === 'absent') {
            return (
                <Box className={classes.screen}>
                    <VaultSetupScreen onComplete={vaultActions.create} />
                </Box>
            )
        }

        if (vaultStatus === 'locked') {
            return (
                <Box className={classes.screen}>
                    <VaultUnlockScreen
                        attemptsLeft={passcodeAttemptsLeft}
                        hasPasscode={hasPasscode}
                        onReset={() => setIsManagingVault(true)}
                        passcodeLength={passcodeLength}
                        onUnlockWithPhrase={vaultActions.unlock}
                        onUnlockWithPasscode={vaultActions.unlockWithPasscode}
                    />
                </Box>
            )
        }

        if (!hasPasscode) {
            return (
                <Box className={classes.screen}>
                    <PasscodeRequiredScreen onSubmit={vaultActions.setPasscode} />
                </Box>
            )
        }

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

        if ((stage === 'connecting' && !hostKeyPrompt) || stage === 'failed') {
            return (
                <Box className={classes.screen}>
                    <ConnectionLogScreen
                        error={error}
                        onOpenSettings={() => {
                            teardown()
                            setStage('setup')
                        }}
                        onRetry={() => void connect(target)}
                        stage={connectStage}
                        target={`${target.username}@${target.host}:${target.port}`}
                    />
                </Box>
            )
        }

        return (
            <TerminalView
                onInput={(data) => connectionRef.current?.write(data)}
                onReady={(terminal) => {
                    terminalRef.current = terminal
                }}
                onResize={(cols, rows) => {
                    setSize(`${cols}×${rows}`)
                    connectionRef.current?.resize(cols, rows)
                }}
            />
        )
    }

    const isConnected = stage === 'session' && !statusText

    return (
        <FloatingWindow
            className={classes.window}
            ref={registerShard}
            constrainOffset={12}
            data-maximized={isMaximized || undefined}
            dimensions={{
                initialWidth: 880,
                initialHeight: 560,
                minWidth: 420,
                minHeight: 320
            }}
            dragHandleSelector={`.${classes.header}`}
            excludeDragHandleSelector="button"
            initialPosition={{ top: 80, left: 120 }}
            radius="md"
            shadow="xl"
            zIndex={500}
            withBorder
            withinPortal
        >
            <Group className={classes.header} gap="xs" wrap="nowrap">
                <TbTerminal2 color="var(--mantine-color-cyan-4)" size={16} />

                <Text fw={600} size="sm" truncate>
                    {node.name}
                </Text>
                <Text c="dimmed" size="xs" truncate>
                    {t('node-ssh.title')}
                </Text>

                <Group gap={4} ml="auto" wrap="nowrap">
                    <Tooltip label={t('node-ssh.vault-manage')} withArrow>
                        <ActionIcon
                            color={isManagingVault ? 'cyan' : 'gray'}
                            onClick={() => {
                                teardown()
                                setStage('setup')
                                setIsManagingVault((value) => !value)
                            }}
                            size="sm"
                            variant="subtle"
                        >
                            <TbShieldLock size={15} />
                        </ActionIcon>
                    </Tooltip>
                    {stage === 'session' && (
                        <Tooltip label={t('node-ssh.connection-settings')} withArrow>
                            <ActionIcon
                                color="gray"
                                onClick={() => {
                                    teardown()
                                    setStage('setup')
                                }}
                                size="sm"
                                variant="subtle"
                            >
                                <TbSettings size={15} />
                            </ActionIcon>
                        </Tooltip>
                    )}

                    <ActionIcon
                        color="gray"
                        onClick={() => setIsMaximized((value) => !value)}
                        size="sm"
                        variant="subtle"
                    >
                        {isMaximized ? (
                            <TbArrowsMinimize size={15} />
                        ) : (
                            <TbArrowsMaximize size={15} />
                        )}
                    </ActionIcon>

                    <Tooltip label={t('common.close')} withArrow>
                        <ActionIcon color="gray" onClick={close} size="sm" variant="subtle">
                            <TbX size={15} />
                        </ActionIcon>
                    </Tooltip>
                </Group>
            </Group>

            <Box className={classes.body}>
                {renderBody()}

                <AnimatePresence>
                    {isEditingSnippets && (
                        <SnippetsOverlay
                            onClose={() => setIsEditingSnippets(false)}
                            onDelete={async (id) => {
                                await vaultActions.deleteSnippet(id)
                                await refreshSnippets()
                            }}
                            onSave={async (snippet) => {
                                await vaultActions.saveSnippet(snippet)
                                await refreshSnippets()
                            }}
                            snippets={snippets}
                        />
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

            {stage === 'session' && (
                <SnippetsBar
                    onManage={() => setIsEditingSnippets(true)}
                    onRun={(snippet) => connectionRef.current?.write(`${snippet.command}\n`)}
                    snippets={snippets}
                />
            )}

            {stage !== 'setup' && (
                <Group className={classes.statusBar} gap="sm" wrap="nowrap">
                    <Box
                        className={classes.dot}
                        style={{
                            backgroundColor: isConnected
                                ? 'var(--mantine-color-teal-5)'
                                : 'var(--mantine-color-gray-6)'
                        }}
                    />
                    <Text inherit truncate>
                        {target.username}@{target.host}:{target.port}
                    </Text>
                    <Text inherit ml="auto">
                        {size}
                    </Text>
                </Group>
            )}

            <FloatingWindow.ResizeHandle
                aria-label={t('node-ssh.resize')}
                className={classes.resizeHandle}
            />
        </FloatingWindow>
    )
}

export const NodeSshTerminalWindow = NiceModal.create((props: IProps) => {
    const modal = useModal()

    return <SshTerminalWindow key={props.node.uuid} modal={modal} node={props.node} />
})
