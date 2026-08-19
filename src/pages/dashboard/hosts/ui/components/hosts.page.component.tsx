import { MultiSelectHostsFeature } from '@features/dashboard/hosts/multi-select-hosts/multi-select-hosts.feature'
import { HeaderActionButtonsFeature } from '@features/ui/dashboard/hosts/header-action-buttons'
import { useListState } from '@mantine/hooks'
import { HostsDataTableWidget } from '@widgets/dashboard/hosts/hosts-datatable/hosts-datatable.widget'
import { HostsSpotlightWidget } from '@widgets/dashboard/hosts/hosts-spotlight'
import { HostsTableWidget } from '@widgets/dashboard/hosts/hosts-table'
import { motion } from 'motion/react'
/* eslint-disable no-nested-ternary */
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TbListCheck } from 'react-icons/tb'

import { queryClient } from '@shared/api'
import { hostsQueryKeys, useReorderHosts } from '@shared/api/hooks'
import { LoadingScreen, Page, PageHeaderShared } from '@shared/ui'

import {
    HOSTS_VIEW_MODE,
    useHostsViewMode,
    useViewPreferencesStoreActions
} from '@entities/dashboard/view-preferences-store'

import { IProps } from './interfaces'

export default function HostsPageComponent(props: IProps) {
    const { t } = useTranslation()
    const { configProfiles, hosts, hostTags, isLoading } = props
    const [selectedHosts, setSelectedHosts] = useState<string[]>([])
    const [state, handlers] = useListState(hosts || [])
    const isDraggingRef = useRef(false)

    const viewMode = useHostsViewMode()
    const { mutate: reorderHosts } = useReorderHosts({
        mutationFns: {
            onError: () => {
                queryClient.invalidateQueries({ queryKey: hostsQueryKeys.getAllHosts.queryKey })
            }
        }
    })

    const { setHostsViewMode } = useViewPreferencesStoreActions()

    useEffect(() => {
        ;(async () => {
            if (!hosts || !state) {
                return
            }

            if (isDraggingRef.current) {
                return
            }

            const hostsToReorder = hosts

            const updatedHosts = hostsToReorder.map((host) => ({
                uuid: host.uuid,
                viewPosition: state.findIndex((stateItem) => stateItem.uuid === host.uuid)
            }))

            const hasOrderChanged = hostsToReorder?.some(
                (host, index) => host.uuid !== state[index].uuid
            )

            if (hasOrderChanged) {
                reorderHosts({ variables: { hosts: updatedHosts } })
                queryClient.setQueryData(hostsQueryKeys.getAllHosts.queryKey, state)
            }
        })()
    }, [state])

    useEffect(() => {
        handlers.setState(hosts || [])
    }, [hosts])

    const moveSelected = useCallback(
        (mode: 'bottom' | 'down' | 'top' | 'up') => {
            if (selectedHosts.length === 0) return
            const selected = new Set(selectedHosts)

            handlers.setState((current) => {
                if (mode === 'top' || mode === 'bottom') {
                    const sel = current.filter((host) => selected.has(host.uuid))
                    const rest = current.filter((host) => !selected.has(host.uuid))
                    return mode === 'top' ? [...sel, ...rest] : [...rest, ...sel]
                }

                const next = [...current]
                const offset = mode === 'up' ? -1 : 1
                const start = mode === 'up' ? 1 : next.length - 2
                const end = mode === 'up' ? next.length : -1
                const step = mode === 'up' ? 1 : -1

                for (let i = start; i !== end; i += step) {
                    const j = i + offset
                    if (selected.has(next[i].uuid) && !selected.has(next[j].uuid)) {
                        ;[next[i], next[j]] = [next[j], next[i]]
                    }
                }
                return next
            })
        },
        [selectedHosts, handlers]
    )

    return (
        <Page title={t('constants.hosts')}>
            <PageHeaderShared
                actions={
                    <HeaderActionButtonsFeature
                        setViewMode={setHostsViewMode}
                        viewMode={viewMode}
                    />
                }
                icon={<TbListCheck size={24} />}
                title={t('constants.hosts')}
            />
            {isLoading ? (
                <LoadingScreen />
            ) : viewMode === HOSTS_VIEW_MODE.CARDS ? (
                <motion.div
                    animate={{ opacity: 1 }}
                    initial={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <HostsTableWidget
                        configProfiles={configProfiles}
                        handlers={handlers}
                        hosts={hosts}
                        isDraggingRef={isDraggingRef}
                        selectedHosts={selectedHosts}
                        setSelectedHosts={setSelectedHosts}
                        state={state}
                    />
                </motion.div>
            ) : (
                <HostsDataTableWidget
                    configProfiles={configProfiles}
                    hosts={hosts}
                    hostTags={hostTags}
                    selectedHosts={selectedHosts}
                    setSelectedHosts={setSelectedHosts}
                    state={state}
                />
            )}

            <HostsSpotlightWidget configProfiles={configProfiles ?? []} hosts={hosts ?? []} />

            <MultiSelectHostsFeature
                configProfiles={configProfiles}
                hosts={hosts}
                moveSelected={moveSelected}
                selectedHosts={selectedHosts}
                setSelectedHosts={setSelectedHosts}
            />
        </Page>
    )
}
