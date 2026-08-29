import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { ActionIcon, Box, FloatingWindow, Group, Text, Tooltip } from '@mantine/core'
import { useHotkeys } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { GetNodeCommand } from '@remnawave/backend-contract'
import { AnimatePresence } from 'motion/react'
import { useCallback, useEffect, useEffectEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TbServer, TbSettings, TbShieldLock, TbTerminal2 } from 'react-icons/tb'

import { useGetNodes } from '@shared/api/hooks'
import { useSingleInstanceLock } from '@shared/hooks/use-single-instance-lock'
import { registerScrollLockShard } from '@shared/utils/scroll-lock-shards'
import { sToMs } from '@shared/utils/time-utils'

import type { ISshSnippet } from '@entities/ssh-vault'
import { useSshVaultActions, useSshVaultStatus } from '@entities/ssh-vault'

import {
    SavedConnectionsList,
    SavedConnectionsOverlay
} from './connections/saved-connections.overlay'
import { useSavedConnections } from './connections/use-saved-connections'
import { useSshProfiles } from './connections/use-ssh-profiles'
import {
    CLOSE_TAB_HOTKEY,
    HOTKEY_OPTIONS,
    ZOOM_IN_HOTKEY,
    ZOOM_IN_SHIFT_HOTKEY,
    ZOOM_OUT_HOTKEY,
    ZOOM_RESET_HOTKEY
} from './hotkeys'
import classes from './NodeSshTerminal.module.css'
import { SshSessionTab } from './session/ssh-session.tab'
import { SnippetsBar } from './snippets/snippets-bar'
import { SnippetsOverlay } from './snippets/snippets.overlay'
import { SshTabStrip } from './tabs/ssh-tab-strip'
import {
    createSshTabsStore,
    MAX_TABS,
    SshTabsProvider,
    useSshActiveStatus,
    useSshActiveTabId,
    useSshTabs,
    useSshTabsActions
} from './tabs/ssh-tabs.store'
import { useTerminalFontActions } from './terminal-font.store'
import { useIsVaultGateOpen, VaultGate } from './vault/vault-gate'
import { TrafficLights } from './window/traffic-lights'
import { defaultGeometry, IWindowGeometry, useWindowGeometry } from './window/use-window-geometry'

const SSH_TERMINAL_LOCK = 'rw-ssh-terminal'

interface IProps {
    node?: GetNodeCommand.Response['response']
}

interface IWindowProps {
    geometry: IWindowGeometry
    modal: ReturnType<typeof useModal>
    node?: GetNodeCommand.Response['response']
    onGeometryChange: (geometry: IWindowGeometry) => void
}

const SshTerminalWindow = (props: IWindowProps) => {
    const { geometry, modal, node, onGeometryChange } = props
    const { t } = useTranslation()

    const vaultStatus = useSshVaultStatus()
    const instanceLock = useSingleInstanceLock(SSH_TERMINAL_LOCK)
    const hasInstance = instanceLock === 'acquired'
    const vaultActions = useSshVaultActions()

    const {
        isMaximized,
        isMinimized,
        onHeaderDoubleClick,
        restore,
        toggleMaximized,
        toggleMinimized,
        windowProps
    } = useWindowGeometry(geometry, onGeometryChange)
    const [isManagingVault, setIsManagingVault] = useState(false)
    const [snippets, setSnippets] = useState<ISshSnippet[]>([])
    const [isEditingSnippets, setIsEditingSnippets] = useState(false)
    const [isPickingConnection, setIsPickingConnection] = useState(false)

    const tabs = useSshTabs()
    const activeId = useSshActiveTabId()
    const status = useSshActiveStatus()
    const tabActions = useSshTabsActions()
    const fontActions = useTerminalFontActions()
    const isVaultGateOpen = useIsVaultGateOpen(instanceLock, isManagingVault)

    const visibleSnippets = vaultStatus === 'unlocked' ? snippets : []

    const openTab = (next: GetNodeCommand.Response['response']) => {
        if (tabActions.openTab(next) !== 'rejected') return

        notifications.show({
            color: 'red',
            message: `Up to ${MAX_TABS} sessions can be open in one window. Close a tab to open another.`,
            title: t('node-ssh.title')
        })
    }

    const addTabForNode = useEffectEvent(() => {
        if (!node) return

        restore()
        openTab(node)
    })

    useEffect(() => {
        addTabForNode()
    }, [modal.args])

    const stopSessions = useEffectEvent(() => {
        for (const tab of tabs) tabActions.getHandle(tab.id)?.showSettings()
    })

    useEffect(() => {
        if (vaultStatus !== 'unlocked') stopSessions()
    }, [vaultStatus])

    const restoreVault = async (backup: Uint8Array, seedPhrase: string) => {
        const restored = await vaultActions.importVault(backup, seedPhrase)

        if (!restored) return false

        tabActions.dropSessions()
        setIsManagingVault(false)
        await openSavedConnections([])

        return true
    }

    const destroyVault = () => {
        tabActions.dropSessions()
        clearProfiles()

        void vaultActions.reset()
    }

    const closeTab = (id: string) => {
        tabActions.closeTab(id)

        if (tabs.length === 1) void openSavedConnections([])
    }

    const isWindowFocused = () => Boolean(document.activeElement?.closest('[data-ssh-window]'))

    const zoom = (step: number) => {
        if (isMinimized || !isWindowFocused()) return

        if (step === 0) fontActions.resetZoom()
        else fontActions.zoom(step)
    }

    useHotkeys(
        [
            [
                CLOSE_TAB_HOTKEY,
                () => {
                    if (isMinimized || isVaultGateOpen || !activeId) return

                    closeTab(activeId)
                },
                HOTKEY_OPTIONS
            ],
            [ZOOM_IN_HOTKEY, () => zoom(1), HOTKEY_OPTIONS],
            [ZOOM_IN_SHIFT_HOTKEY, () => zoom(1), HOTKEY_OPTIONS],
            [ZOOM_OUT_HOTKEY, () => zoom(-1), HOTKEY_OPTIONS],
            [ZOOM_RESET_HOTKEY, () => zoom(0), HOTKEY_OPTIONS]
        ],
        []
    )

    const registerShard = useCallback(
        (node: HTMLDivElement | null) => (node ? registerScrollLockShard(node) : undefined),
        []
    )

    const close = useCallback(() => {
        modal.hide()
        modal.remove()
    }, [modal])

    const { data: nodes } = useGetNodes({
        rQueryParams: {
            refetchInterval: sToMs(20)
        }
    })

    const {
        clear: clearProfiles,
        profiles,
        refresh: refreshProfiles
    } = useSshProfiles(vaultStatus === 'unlocked')
    const savedConnections = useSavedConnections(nodes, profiles)

    const closeOverlays = () => {
        setIsPickingConnection(false)
        setIsEditingSnippets(false)
    }

    const openSavedConnections = async (openTabs = tabs) => {
        closeOverlays()
        setIsManagingVault(false)
        setIsPickingConnection(openTabs.length > 0)

        await refreshProfiles()
    }

    const selectSavedConnection = (nodeUuid: string) => {
        setIsPickingConnection(false)

        const next = nodes?.find((item) => item.uuid === nodeUuid)
        if (next) openTab(next)
    }

    useEffect(() => {
        void vaultActions.refresh()
    }, [])

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

    return (
        <FloatingWindow
            className={classes.window}
            data-ssh-window
            ref={registerShard}
            {...windowProps}
            dragHandleSelector={`.${classes.header}`}
            excludeDragHandleSelector="button"
            radius="md"
            shadow="xl"
            zIndex={500}
            withBorder
            withinPortal
        >
            <Group
                className={classes.header}
                gap="xs"
                onDoubleClick={onHeaderDoubleClick}
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
                    {tabs.find((tab) => tab.id === activeId)?.node.name ?? ''}
                </Text>
                <Text c="dimmed" size="xs" truncate>
                    {t('node-ssh.title')}
                </Text>

                {hasInstance ? (
                    <Group gap={4} ml="auto" wrap="nowrap">
                        {vaultStatus === 'unlocked' && (
                            <Tooltip label={t('node-ssh.connections-title')} withArrow>
                                <ActionIcon
                                    color={isPickingConnection ? 'cyan' : 'gray'}
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
                                    closeOverlays()
                                    setIsManagingVault((value) => !value)
                                }}
                                size="sm"
                                variant="subtle"
                            >
                                <TbShieldLock size={15} />
                            </ActionIcon>
                        </Tooltip>
                        {status?.stage === 'session' && (
                            <Tooltip label={t('node-ssh.connection-settings')} withArrow>
                                <ActionIcon
                                    color="gray"
                                    onClick={() => {
                                        tabActions.getHandle(activeId)?.showSettings()
                                        closeOverlays()
                                    }}
                                    size="sm"
                                    variant="subtle"
                                >
                                    <TbSettings size={15} />
                                </ActionIcon>
                            </Tooltip>
                        )}
                    </Group>
                ) : null}
            </Group>

            {!isVaultGateOpen && !isMinimized ? (
                <SshTabStrip onAdd={() => void openSavedConnections()} onClose={closeTab} />
            ) : null}

            <Box className={classes.body} display={isMinimized ? 'none' : undefined}>
                <VaultGate
                    instanceLock={instanceLock}
                    isManaging={isManagingVault}
                    onDestroy={destroyVault}
                    onLeaveManage={() => setIsManagingVault(false)}
                    onManage={() => setIsManagingVault(true)}
                    onRestore={restoreVault}
                />

                {!isVaultGateOpen && tabs.length === 0 ? (
                    <Box className={classes.startScreen}>
                        <SavedConnectionsList
                            connections={savedConnections ?? []}
                            onSelect={selectSavedConnection}
                        />
                    </Box>
                ) : null}

                {hasInstance
                    ? tabs.map((tab) => (
                          <SshSessionTab
                              isHidden={isVaultGateOpen || isMinimized || tab.id !== activeId}
                              key={tab.id}
                              node={tab.node}
                              onRegister={(handle) => tabActions.registerHandle(tab.id, handle)}
                              onStatusChange={(next) => tabActions.setStatus(tab.id, next)}
                          />
                      ))
                    : null}

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
                            snippets={visibleSnippets}
                        />
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {isPickingConnection && savedConnections && tabs.length > 0 && (
                        <SavedConnectionsOverlay
                            connections={savedConnections}
                            onClose={() => setIsPickingConnection(false)}
                            onSelect={selectSavedConnection}
                        />
                    )}
                </AnimatePresence>
            </Box>

            {status?.stage === 'session' && !isMinimized && (
                <SnippetsBar
                    onManage={() => {
                        closeOverlays()
                        setIsEditingSnippets(true)
                    }}
                    onRun={(snippet) =>
                        tabActions.getHandle(activeId)?.write(`${snippet.command}\n`)
                    }
                    snippets={visibleSnippets}
                />
            )}

            {status && status.stage !== 'setup' && !isMinimized && (
                <Group className={classes.statusBar} gap="sm" wrap="nowrap">
                    <Box
                        className={classes.dot}
                        style={{
                            backgroundColor: status.isConnected
                                ? 'var(--mantine-color-teal-5)'
                                : 'var(--mantine-color-gray-6)'
                        }}
                    />
                    <Text inherit truncate>
                        {status.target.username}@{status.target.host}:{status.target.port}
                    </Text>
                    <Text inherit ml="auto">
                        {status.size}
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
    const [geometry, setGeometry] = useState<IWindowGeometry>(defaultGeometry)

    const [tabsStore] = useState(() => createSshTabsStore(props.node))

    return (
        <SshTabsProvider value={tabsStore}>
            <SshTerminalWindow
                geometry={geometry}
                modal={modal}
                node={props.node}
                onGeometryChange={setGeometry}
            />
        </SshTabsProvider>
    )
})
