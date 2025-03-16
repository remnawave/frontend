import {
    Affix,
    Button,
    ComboboxItem,
    Group,
    NumberInput,
    Paper,
    Select,
    Stack,
    Text,
    Transition
} from '@mantine/core'
import {
    PiArrowBendDownLeftDuotone,
    PiProhibitDuotone,
    PiPulseDuotone,
    PiTagDuotone,
    PiTrash
} from 'react-icons/pi'
import { notifications } from '@mantine/notifications'
import { useTranslation } from 'react-i18next'
import { modals } from '@mantine/modals'
import { useField } from '@mantine/form'
import { useEffect } from 'react'

import {
    useBulkDeleteHosts,
    useBulkDisableHosts,
    useSetInboundHosts,
    useSetPortToManyHosts
} from '@shared/api/hooks/hosts/hosts.mutation.hooks'
import { useBulkEnableHosts, useGetHosts } from '@shared/api/hooks'

import { IProps } from './interfaces/props.interface'

export const MultiSelectHostsFeature = (props: IProps) => {
    const { inbounds, hosts, selectedHosts, setSelectedHosts } = props

    const { t } = useTranslation()

    const hasSelection = selectedHosts.length > 0

    const portField = useField<number | undefined>({
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
            title: t('multi-select-hosts.feature.delete-hosts'),
            centered: true,
            children: (
                <Text>
                    {t('multi-select-hosts.feature.are-you-sure-you-want-to-delete-these-hosts')}
                </Text>
            ),
            labels: {
                confirm: t('multi-select-hosts.feature.delete'),
                cancel: t('multi-select-hosts.feature.cancel')
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

    if (!inbounds || !hosts) {
        return null
    }

    const setInboundSelectedHosts = () => {
        let localSelectedInbound: ComboboxItem | null = null

        modals.open({
            title: t('multi-select-hosts.feature.set-inbound'),
            centered: true,
            children: (
                <Stack>
                    <Select
                        data={inbounds.map((inbound) => ({
                            label: inbound.tag,
                            value: inbound.uuid
                        }))}
                        label={t('multi-select-hosts.feature.inbound')}
                        onChange={(_value, option) => {
                            localSelectedInbound = option
                        }}
                    />
                    <Group justify="flex-end">
                        <Button onClick={() => modals.closeAll()} variant="subtle">
                            {t('multi-select-hosts.feature.cancel')}
                        </Button>
                        <Button
                            onClick={() => {
                                if (localSelectedInbound) {
                                    setInboundHosts({
                                        variables: {
                                            uuids: selectedHosts,
                                            inboundUuid: localSelectedInbound.value
                                        }
                                    })
                                    modals.closeAll()
                                }
                                if (!localSelectedInbound) {
                                    notifications.show({
                                        title: 'Error',
                                        message: 'Please select an inbound',
                                        color: 'red'
                                    })
                                }
                            }}
                        >
                            {t('multi-select-hosts.feature.set-inbound')}
                        </Button>
                    </Group>
                </Stack>
            )
        })
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
                            {t('multi-select-hosts.feature.cancel')}
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
                        radius="md"
                        shadow="md"
                        style={{
                            ...styles,
                            maxWidth: '1200px',
                            margin: '0 auto'
                        }}
                        withBorder
                    >
                        <Group justify="apart">
                            <Group>
                                <Text size="sm">Selected: {selectedHosts.length}</Text>
                                <Button onClick={clearSelection} variant="subtle">
                                    {t('multi-select-hosts.feature.clear-selection')}
                                </Button>
                                <Button onClick={selectAllHosts} variant="subtle">
                                    {t('multi-select-hosts.feature.select-all')}
                                </Button>
                            </Group>

                            <Group>
                                <Button
                                    color="green"
                                    leftSection={<PiPulseDuotone />}
                                    onClick={enableSelectedHosts}
                                >
                                    {t('multi-select-hosts.feature.enable')}
                                </Button>
                                <Button
                                    color="gray"
                                    leftSection={<PiProhibitDuotone />}
                                    onClick={disableSelectedHosts}
                                >
                                    {t('multi-select-hosts.feature.disable')}
                                </Button>
                                <Button
                                    color="cyan"
                                    leftSection={<PiTagDuotone />}
                                    onClick={setInboundSelectedHosts}
                                >
                                    {t('multi-select-hosts.feature.set-inbound')}
                                </Button>
                                <Button
                                    color="grape"
                                    leftSection={<PiArrowBendDownLeftDuotone />}
                                    onClick={setPortSelectedHosts}
                                >
                                    {t('multi-select-hosts.feature.set-port-0')}
                                </Button>
                                <Button
                                    color="red"
                                    leftSection={<PiTrash />}
                                    onClick={deleteSelectedHosts}
                                >
                                    {t('multi-select-hosts.feature.delete')}
                                </Button>
                            </Group>
                        </Group>
                    </Paper>
                )}
            </Transition>
        </Affix>
    )
}
