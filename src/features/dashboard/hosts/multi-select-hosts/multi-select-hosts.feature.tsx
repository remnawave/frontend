import {
    ActionIcon,
    Affix,
    Badge,
    Button,
    CloseButton,
    Group,
    Paper,
    Stack,
    Tooltip,
    Transition
} from '@mantine/core'
import { modals } from '@mantine/modals'
import { notifications } from '@mantine/notifications'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { PiProhibitDuotone, PiPulseDuotone } from 'react-icons/pi'
import {
    TbArrowBarToDown,
    TbArrowBarToUp,
    TbArrowBigDown,
    TbArrowBigUp,
    TbCategoryPlus,
    TbCopy,
    TbSelectAll,
    TbTrash
} from 'react-icons/tb'

import { showModal } from '@shared/_modals/show-modal'
import { useBulkEnableHosts, useCreateHost, useGetHosts, useReorderHosts } from '@shared/api/hooks'
import {
    useBulkDeleteHosts,
    useBulkDisableHosts
} from '@shared/api/hooks/hosts/hosts.mutation.hooks'
import { cloneString } from '@shared/utils/misc/clone-string'

import { useHostsActiveTag } from '@entities/dashboard/view-preferences-store'

import { IProps } from './interfaces/props.interface'

export const MultiSelectHostsFeature = (props: IProps) => {
    const { configProfiles, hosts, moveSelected, selectedHosts, setSelectedHosts } = props

    const { t } = useTranslation()

    const hasSelection = selectedHosts.length > 0

    const { refetch: refetchHosts } = useGetHosts()
    const activeTag = useHostsActiveTag()

    useEffect(() => {
        if (!hosts) return

        const existingUuids = new Set(hosts.map((host) => host.uuid))

        setSelectedHosts((current) => {
            const alive = current.filter((uuid) => existingUuids.has(uuid))

            return alive.length === current.length ? current : alive
        })
    }, [hosts])

    const { mutate: bulkDeleteHosts } = useBulkDeleteHosts({
        mutationFns: {
            onSuccess: () => {
                refetchHosts()
            }
        }
    })
    const { mutate: bulkEnableHosts } = useBulkEnableHosts({
        mutationFns: {
            onSuccess: () => {
                refetchHosts()
            }
        }
    })
    const { mutate: bulkDisableHosts } = useBulkDisableHosts({
        mutationFns: {
            onSuccess: () => {
                refetchHosts()
            }
        }
    })
    const { mutateAsync: createHost } = useCreateHost()
    const { mutateAsync: reorderHosts } = useReorderHosts()

    const selectAllHosts = () => {
        setSelectedHosts(hosts?.map((host) => host.uuid) || [])
    }

    const clearSelection = () => {
        setSelectedHosts([])
    }

    const deleteSelectedHosts = () => {
        modals.openConfirmModal({
            title: t('common.confirm-action'),
            centered: true,
            children: t('common.confirm-action-description'),
            labels: {
                confirm: t('common.delete'),
                cancel: t('common.cancel')
            },
            confirmProps: {
                color: 'red',
                variant: 'soft'
            },
            cancelProps: {
                variant: 'subtle'
            },
            onConfirm: () => {
                bulkDeleteHosts({ variables: { uuids: selectedHosts } })
                clearSelection()
            }
        })
    }

    const enableSelectedHosts = () => {
        bulkEnableHosts({ variables: { uuids: selectedHosts } })
        clearSelection()
    }

    const disableSelectedHosts = () => {
        bulkDisableHosts({ variables: { uuids: selectedHosts } })
        clearSelection()
    }

    const cloneSelectedHosts = () => {
        const selected = (hosts ?? []).filter((host) => selectedHosts.includes(host.uuid))
        const cloneableHosts = selected.filter(
            (host) => host.inbound.configProfileInboundUuid && host.inbound.configProfileUuid
        )
        const danglingCount = selected.length - cloneableHosts.length

        if (cloneableHosts.length === 0) {
            notifications.show({
                title: t('edit-host-modal.widget.error'),
                message: t('edit-host-modal.widget.dangling-host-cannot-be-cloned'),
                color: 'red'
            })

            return
        }

        modals.openConfirmModal({
            title: t('common.confirm-action'),
            centered: true,
            children: t('common.confirm-action-description'),
            labels: {
                confirm: t('common.clone'),
                cancel: t('common.cancel')
            },
            confirmProps: {
                color: 'cyan',
                variant: 'soft'
            },
            onConfirm: async () => {
                if (danglingCount > 0) {
                    notifications.show({
                        title: t('edit-host-modal.widget.error'),
                        message: t('multi-select-hosts.feature.dangling-hosts-skipped', {
                            count: danglingCount
                        }),
                        color: 'yellow'
                    })
                }

                const cloneResults = await Promise.allSettled(
                    cloneableHosts.map(async (host) => ({
                        parentUuid: host.uuid,
                        clone: await createHost({
                            variables: {
                                ...host,
                                remark: cloneString(host.remark),
                                isDisabled: true,
                                inbound: {
                                    configProfileUuid: host.inbound.configProfileUuid!,
                                    configProfileInboundUuid: host.inbound.configProfileInboundUuid!
                                }
                            }
                        })
                    }))
                )

                const cloneUuidByParent = new Map<string, string>()
                for (const result of cloneResults) {
                    if (result.status === 'fulfilled' && result.value.clone) {
                        cloneUuidByParent.set(result.value.parentUuid, result.value.clone.uuid)
                    }
                }

                if (cloneUuidByParent.size > 0) {
                    const orderedUuids = (hosts ?? []).flatMap((host) => {
                        const cloneUuid = cloneUuidByParent.get(host.uuid)
                        return cloneUuid ? [host.uuid, cloneUuid] : [host.uuid]
                    })

                    await reorderHosts({
                        variables: {
                            hosts: orderedUuids.map((uuid, index) => ({
                                uuid,
                                viewPosition: index
                            }))
                        }
                    })
                }

                refetchHosts()
                clearSelection()
            }
        })
    }

    if (!configProfiles || !hosts) {
        return null
    }

    return (
        <Affix position={{ bottom: 20, right: 20 }} zIndex={100}>
            <Transition mounted={hasSelection} transition="slide-up">
                {(styles) => (
                    <Paper
                        p={4}
                        shadow="md"
                        style={{
                            ...styles,
                            width: '300px',
                            maxWidth: '1200px',
                            margin: '0 auto'
                        }}
                        withBorder
                    >
                        <Paper
                            p="md"
                            style={{
                                borderRadius: 'calc(var(--mantine-radius-default) - 4px)',
                                border: '1px solid var(--mantine-color-dark-5)'
                            }}
                        >
                            <Stack>
                                <Group justify="space-between">
                                    <Badge color="shaded-gray" size="lg" variant="soft">
                                        {t('common.selected', { count: selectedHosts.length })}
                                    </Badge>
                                    <Group gap={0} justify="flex-end">
                                        <Tooltip label={t('common.select-all')} withArrow>
                                            <ActionIcon
                                                color="gray"
                                                onClick={selectAllHosts}
                                                size="lg"
                                                variant="subtle"
                                            >
                                                <TbSelectAll size={20} />
                                            </ActionIcon>
                                        </Tooltip>
                                        <Tooltip label={t('common.clear-selection')} withArrow>
                                            <CloseButton onClick={clearSelection} />
                                        </Tooltip>
                                    </Group>
                                </Group>

                                {activeTag === null && (
                                    <ActionIcon.Group style={{ width: '100%' }}>
                                        <Tooltip label="Move to top" withArrow>
                                            <ActionIcon
                                                color="gray"
                                                onClick={() => moveSelected('top')}
                                                size="lg"
                                                style={{ flex: 1 }}
                                                variant="soft"
                                            >
                                                <TbArrowBarToUp size={20} />
                                            </ActionIcon>
                                        </Tooltip>

                                        <Tooltip label="Move up" withArrow>
                                            <ActionIcon
                                                color="gray"
                                                onClick={() => moveSelected('up')}
                                                size="lg"
                                                style={{ flex: 1 }}
                                                variant="soft"
                                            >
                                                <TbArrowBigUp size={20} />
                                            </ActionIcon>
                                        </Tooltip>

                                        <Tooltip label="Move down" withArrow>
                                            <ActionIcon
                                                color="gray"
                                                onClick={() => moveSelected('down')}
                                                size="lg"
                                                style={{ flex: 1 }}
                                                variant="soft"
                                            >
                                                <TbArrowBigDown size={20} />
                                            </ActionIcon>
                                        </Tooltip>

                                        <Tooltip label="Move to bottom" withArrow>
                                            <ActionIcon
                                                color="gray"
                                                onClick={() => moveSelected('bottom')}
                                                size="lg"
                                                style={{ flex: 1 }}
                                                variant="soft"
                                            >
                                                <TbArrowBarToDown size={20} />
                                            </ActionIcon>
                                        </Tooltip>
                                    </ActionIcon.Group>
                                )}

                                <Group grow justify="apart" preventGrowOverflow={false} wrap="wrap">
                                    <Button
                                        color="green"
                                        leftSection={<PiPulseDuotone />}
                                        onClick={enableSelectedHosts}
                                        variant="soft"
                                    >
                                        {t('common.enable')}
                                    </Button>
                                    <Button
                                        color="gray"
                                        leftSection={<PiProhibitDuotone />}
                                        onClick={disableSelectedHosts}
                                        variant="soft"
                                    >
                                        {t('common.disable')}
                                    </Button>
                                </Group>
                                <Stack>
                                    <Button
                                        color="cyan"
                                        fullWidth
                                        leftSection={<TbCategoryPlus size={18} />}
                                        onClick={() =>
                                            showModal('hosts_editManyHostsDrawer', {
                                                uuids: selectedHosts
                                            })
                                        }
                                        variant="soft"
                                    >
                                        {t('common.update')}
                                    </Button>

                                    <Button
                                        color="indigo"
                                        fullWidth
                                        leftSection={<TbCopy size={18} />}
                                        onClick={cloneSelectedHosts}
                                        variant="soft"
                                    >
                                        {t('common.clone')}
                                    </Button>

                                    <Button
                                        color="red"
                                        fullWidth
                                        leftSection={<TbTrash size={18} />}
                                        onClick={deleteSelectedHosts}
                                        variant="soft"
                                    >
                                        {t('common.delete')}
                                    </Button>
                                </Stack>
                            </Stack>
                        </Paper>
                    </Paper>
                )}
            </Transition>
        </Affix>
    )
}
