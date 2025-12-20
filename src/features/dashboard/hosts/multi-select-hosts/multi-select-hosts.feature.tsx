import {
    PiArrowBendDownLeftDuotone,
    PiListChecks,
    PiProhibitDuotone,
    PiPulseDuotone,
    PiTagDuotone,
    PiTrash
} from 'react-icons/pi'
import {
    Affix,
    Badge,
    Button,
    Drawer,
    Group,
    NumberInput,
    Paper,
    Stack,
    Transition
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useTranslation } from 'react-i18next'
import { useDisclosure } from '@mantine/hooks'
import { modals } from '@mantine/modals'
import { useField } from '@mantine/form'
import { useEffect } from 'react'

import {
    useBulkDeleteHosts,
    useBulkDisableHosts,
    useSetInboundHosts,
    useSetPortToManyHosts
} from '@shared/api/hooks/hosts/hosts.mutation.hooks'
import { HostSelectInboundFeature } from '@features/ui/dashboard/hosts/host-select-inbound/host-select-inbound.feature'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { useBulkEnableHosts, useGetHosts } from '@shared/api/hooks'

import { IProps } from './interfaces/props.interface'

export const MultiSelectHostsFeature = (props: IProps) => {
    const { configProfiles, hosts, selectedHosts, setSelectedHosts } = props

    const [opened, handlers] = useDisclosure(false)

    const { t } = useTranslation()

    const hasSelection = selectedHosts.length > 0

    const portField = useField<number | undefined>({
        initialValue: undefined
    })

    const inboundField = useField<string | undefined>({
        initialValue: undefined
    })

    const configProfileField = useField<string | undefined>({
        initialValue: undefined
    })

    const { refetch: refetchHosts } = useGetHosts()
    useEffect(() => {
        setSelectedHosts([])
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

    const { mutate: setInboundHosts } = useSetInboundHosts({
        mutationFns: {
            onSuccess: () => {
                refetchHosts()
                modals.closeAll()
            }
        }
    })
    const { mutate: setPortToManyHosts } = useSetPortToManyHosts({
        mutationFns: {
            onSuccess: () => {
                refetchHosts()
                portField.reset()
                modals.closeAll()
            }
        }
    })

    const selectAllHosts = () => {
        setSelectedHosts(hosts?.map((host) => host.uuid) || [])
    }

    const clearSelection = () => {
        setSelectedHosts([])
    }

    const deleteSelectedHosts = () => {
        modals.openConfirmModal({
            title: t('common.delete'),
            centered: true,
            children: t('common.confirm-action-description'),
            labels: {
                confirm: t('common.delete'),
                cancel: t('common.cancel')
            },
            confirmProps: {
                color: 'red'
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

    if (!configProfiles || !hosts) {
        return null
    }

    const setPortSelectedHosts = () => {
        modals.open({
            title: t('multi-select-hosts.feature.set-port'),
            centered: true,
            children: (
                <Stack>
                    <NumberInput
                        label={t('multi-select-hosts.feature.port')}
                        {...portField.getInputProps()}
                        error={portField.error}
                        max={65535}
                        min={1}
                        required
                    />

                    <Group justify="flex-end">
                        <Button onClick={() => modals.closeAll()} variant="subtle">
                            {t('common.cancel')}
                        </Button>
                        <Button
                            onClick={async () => {
                                const port = portField.getValue()

                                if (port === undefined) {
                                    notifications.show({
                                        title: 'Error',
                                        message: 'Port is required',
                                        color: 'red'
                                    })
                                    return
                                }

                                setPortToManyHosts({
                                    variables: {
                                        uuids: selectedHosts,
                                        port
                                    }
                                })
                            }}
                        >
                            {t('multi-select-hosts.feature.set-port')}
                        </Button>
                    </Group>
                </Stack>
            )
        })
    }

    return (
        <Affix position={{ bottom: 20, right: 20 }} zIndex={100}>
            <Transition mounted={hasSelection} transition="slide-up">
                {(styles) => (
                    <Paper
                        p="md"
                        shadow="md"
                        style={{
                            ...styles,
                            width: '300px',
                            maxWidth: '1200px',
                            margin: '0 auto'
                        }}
                        withBorder
                    >
                        <Stack>
                            <Group justify="flex-start">
                                <Group justify="center" w="100%">
                                    <Badge color="blue" size="lg">
                                        Selected: {selectedHosts.length}
                                    </Badge>
                                </Group>
                                <Group grow justify="apart" preventGrowOverflow={false} wrap="wrap">
                                    <Button onClick={clearSelection} variant="subtle">
                                        {t('multi-select-hosts.feature.clear-selection')}
                                    </Button>
                                    <Button onClick={selectAllHosts} variant="subtle">
                                        {t('multi-select-hosts.feature.select-all')}
                                    </Button>
                                </Group>
                            </Group>

                            <Group grow justify="apart" preventGrowOverflow={false} wrap="wrap">
                                <Button
                                    color="green"
                                    leftSection={<PiPulseDuotone />}
                                    onClick={enableSelectedHosts}
                                >
                                    {t('common.enable')}
                                </Button>
                                <Button
                                    color="gray"
                                    leftSection={<PiProhibitDuotone />}
                                    onClick={disableSelectedHosts}
                                >
                                    {t('common.disable')}
                                </Button>
                                <Button
                                    color="cyan"
                                    leftSection={<PiTagDuotone />}
                                    onClick={handlers.open}
                                >
                                    {t('multi-select-hosts.feature.set-inbound')}
                                </Button>
                                <Button
                                    color="grape"
                                    leftSection={<PiArrowBendDownLeftDuotone />}
                                    onClick={setPortSelectedHosts}
                                >
                                    {t('multi-select-hosts.feature.set-port')}
                                </Button>
                                <Button
                                    color="red"
                                    leftSection={<PiTrash />}
                                    onClick={deleteSelectedHosts}
                                >
                                    {t('common.delete')}
                                </Button>
                            </Group>
                        </Stack>
                    </Paper>
                )}
            </Transition>

            <Drawer
                keepMounted={false}
                onClose={handlers.close}
                opened={opened}
                overlayProps={{ backgroundOpacity: 0.6, blur: 0 }}
                padding="md"
                position="right"
                size="450px"
                title={
                    <BaseOverlayHeader
                        IconComponent={PiListChecks}
                        iconVariant="gradient-teal"
                        title="Config Profiles"
                    />
                }
            >
                <Stack gap="md" h="100%">
                    <Group justify="center">
                        <HostSelectInboundFeature
                            activeConfigProfileInbound={inboundField.getValue() ?? undefined}
                            activeConfigProfileUuid={configProfileField.getValue() ?? undefined}
                            configProfiles={configProfiles}
                            onSaveInbound={(inboundUuid, configProfileUuid) => {
                                inboundField.setValue(inboundUuid)
                                configProfileField.setValue(configProfileUuid)
                            }}
                        />
                        <Button onClick={handlers.close} variant="light">
                            {t('common.cancel')}
                        </Button>
                        <Button
                            onClick={() => {
                                if (!configProfileField.getValue() || !inboundField.getValue()) {
                                    notifications.show({
                                        title: 'Error',
                                        message:
                                            'Please select both a config profile and an inbound',
                                        color: 'red'
                                    })

                                    return
                                }

                                const configProfileUuid = configProfileField.getValue()!
                                const configProfileInboundUuid = inboundField.getValue()!

                                setInboundHosts({
                                    variables: {
                                        uuids: selectedHosts,
                                        configProfileUuid,
                                        configProfileInboundUuid
                                    }
                                })
                                handlers.close()
                            }}
                            variant="outline"
                        >
                            {t('multi-select-hosts.feature.set-inbound')}
                        </Button>
                    </Group>
                </Stack>
            </Drawer>
        </Affix>
    )
}
