import type { SetFloatingWindowPosition } from '@mantine/hooks'

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
import { TbServer, TbSettings, TbShieldLock, TbTerminal2 } from 'react-icons/tb'

import { getAuthorizationToken, getBackendDomain } from '@shared/api'
import { useCreateSshTicket, useGetNodes } from '@shared/api/hooks'
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
import {
    buildSavedConnections,
    ISavedConnection,
    SavedConnectionsOverlay
} from './saved-connections.overlay'
import { SnippetsBar } from './snippets-bar'
import { SnippetsOverlay } from './snippets.overlay'
import { ISshHostKeyPrompt, SshConnection, TSshStage } from './ssh-connection'
import { TerminalView } from './terminal.view'
import { TrafficLights } from './traffic-lights'
import { VaultManageScreen } from './vault-manage.screen'
import { VaultSetupScreen } from './vault-setup.screen'
import { VaultUnlockScreen } from './vault-unlock.screen'

type TStage = 'connecting' | 'failed' | 'session' | 'setup'

interface IProps {
    node: GetNodeCommand.Response['response']
}

interface IWindowGeometry {
    height: number
    isMaximized: boolean
    left: number
    top: number
    width: number
}

const CONSTRAIN_OFFSET = 1

const DEFAULT_GEOMETRY: IWindowGeometry = {
    height: 560,
    isMaximized: false,
    left: 120,
    top: 80,
    width: 880
}

interface IWindowProps {
    geometry: IWindowGeometry
    modal: ReturnType<typeof useModal>
    node: GetNodeCommand.Response['response']
    onGeometryChange: (geometry: IWindowGeometry) => void
}

const SshTerminalWindow = (props: IWindowProps) => {
    const { geometry, modal, node, onGeometryChange } = props
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
    const [isMaximized, setIsMaximized] = useState(geometry.isMaximized)
    const [isMinimized, setIsMinimized] = useState(false)
    const [isManagingVault, setIsManagingVault] = useState(false)
    const [snippets, setSnippets] = useState<ISshSnippet[]>([])
    const [isEditingSnippets, setIsEditingSnippets] = useState(false)
    const [isImportingKey, setIsImportingKey] = useState(false)
    const [savedConnections, setSavedConnections] = useState<ISavedConnection[] | null>(null)
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

    const pendingGeometryRef = useRef(geometry)

    const commitGeometry = (patch: Partial<IWindowGeometry>) => {
        pendingGeometryRef.current = { ...pendingGeometryRef.current, ...patch }
        onGeometryChange(pendingGeometryRef.current)
    }

    const setWindowPositionRef = useRef<null | SetFloatingWindowPosition>(null)

    const toggleMinimized = () => {
        const next = !isMinimized

        setIsMinimized(next)

        if (next) {
            setIsMaximized(false)
            commitGeometry({ isMaximized: false })

            return
        }

        const { height, left, top, width } = pendingGeometryRef.current
        const nextLeft = Math.max(0, Math.min(left, window.innerWidth - width - CONSTRAIN_OFFSET))
        const nextTop = Math.max(0, Math.min(top, window.innerHeight - height - CONSTRAIN_OFFSET))

        if (nextLeft === left && nextTop === top) return

        setWindowPositionRef.current?.({ left: nextLeft, top: nextTop })
        commitGeometry({ left: nextLeft, top: nextTop })
    }

    const handleHeaderDoubleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if ((event.target as Element).closest('button')) return

        toggleMinimized()
    }

    const toggleMaximized = () => {
        const next = !isMaximized

        commitGeometry({ isMaximized: next })
        setIsMaximized(next)
        setIsMinimized(false)
    }

    const close = useCallback(() => {
        teardown()
        modal.hide()
        modal.remove()
    }, [teardown, modal])

    const { data: nodes } = useGetNodes()

    const closeOverlays = () => {
        setSavedConnections(null)
        setIsEditingSnippets(false)
        setIsImportingKey(false)
    }

    const openSavedConnections = async () => {
        const profiles = await vaultActions.listProfiles()

        closeOverlays()
        setSavedConnections(buildSavedConnections(nodes ?? [], profiles, node.uuid))
    }

    const selectSavedConnection = (nodeUuid: string) => {
        setSavedConnections(null)

        const next = nodes?.find((item) => item.uuid === nodeUuid)
        if (!next || nodeUuid === node.uuid) return

        void modal.show({ node: next })
    }

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
            constrainOffset={CONSTRAIN_OFFSET}
            data-maximized={isMaximized || undefined}
            data-minimized={isMinimized || undefined}
            dimensions={{
                initialWidth: geometry.width,
                initialHeight: geometry.height,
                minWidth: 420,
                minHeight: 320
            }}
            dragHandleSelector={`.${classes.header}`}
            excludeDragHandleSelector="button"
            initialPosition={{ top: geometry.top, left: geometry.left }}
            setPositionRef={setWindowPositionRef}
            onDragEnd={() => onGeometryChange(pendingGeometryRef.current)}
            onPositionChange={(position) => {
                pendingGeometryRef.current = {
                    ...pendingGeometryRef.current,
                    left: position.x,
                    top: position.y
                }
            }}
            onResizeEnd={() => onGeometryChange(pendingGeometryRef.current)}
            onSizeChange={(size) => {
                pendingGeometryRef.current = {
                    ...pendingGeometryRef.current,
                    height: size.height,
                    width: size.width
                }
            }}
            radius="md"
            shadow="xl"
            zIndex={500}
            withBorder
            withinPortal
        >
            <Group
                className={classes.header}
                gap="xs"
                onDoubleClick={handleHeaderDoubleClick}
                wrap="nowrap"
            >
                <TrafficLights
                    isMaximized={isMaximized}
                    isMinimized={isMinimized}
                    onClose={close}
                    onToggleMaximized={toggleMaximized}
                    onToggleMinimized={toggleMinimized}
                />

                <TbTerminal2 color="var(--mantine-color-cyan-4)" size={16} />

                <Text fw={600} size="sm" truncate>
                    {node.name}
                </Text>
                <Text c="dimmed" size="xs" truncate>
                    {t('node-ssh.title')}
                </Text>

                <Group gap={4} ml="auto" wrap="nowrap">
                    {vaultStatus === 'unlocked' && (
                        <Tooltip label={t('node-ssh.connections-title')} withArrow>
                            <ActionIcon
                                color={savedConnections ? 'cyan' : 'gray'}
                                onClick={() => void openSavedConnections()}
                                size="sm"
                                variant="subtle"
                            >
                                <TbServer size={15} />
                            </ActionIcon>
                        </Tooltip>
                    )}
                    <Tooltip label={t('node-ssh.vault-manage')} withArrow>
                        <ActionIcon
                            color={isManagingVault ? 'cyan' : 'gray'}
                            onClick={() => {
                                teardown()
                                closeOverlays()
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
                                    closeOverlays()
                                    setStage('setup')
                                }}
                                size="sm"
                                variant="subtle"
                            >
                                <TbSettings size={15} />
                            </ActionIcon>
                        </Tooltip>
                    )}
                </Group>
            </Group>

            <Box className={classes.body} display={isMinimized ? 'none' : undefined}>
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
                    {savedConnections && (
                        <SavedConnectionsOverlay
                            connections={savedConnections}
                            onClose={() => setSavedConnections(null)}
                            onSelect={selectSavedConnection}
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

            {stage === 'session' && !isMinimized && (
                <SnippetsBar
                    onManage={() => {
                        closeOverlays()
                        setIsEditingSnippets(true)
                    }}
                    onRun={(snippet) => connectionRef.current?.write(`${snippet.command}\n`)}
                    snippets={snippets}
                />
            )}

            {stage !== 'setup' && !isMinimized && (
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
    const [geometry, setGeometry] = useState<IWindowGeometry>(DEFAULT_GEOMETRY)

    return (
        <SshTerminalWindow
            geometry={geometry}
            key={props.node.uuid}
            modal={modal}
            node={props.node}
            onGeometryChange={setGeometry}
        />
    )
})
