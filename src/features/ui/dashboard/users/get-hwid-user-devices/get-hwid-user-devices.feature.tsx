import {
    Accordion,
    ActionIcon,
    Anchor,
    Badge,
    Button,
    Card,
    Center,
    Code,
    CopyButton,
    Drawer,
    Group,
    Menu,
    Stack,
    Text,
    TextInput
} from '@mantine/core'
import { PiCheck, PiCopy, PiEmptyDuotone, PiTrash } from 'react-icons/pi'
import { TbDevices, TbInfoCircle } from 'react-icons/tb'
import { useDisclosure } from '@mantine/hooks'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'

import {
    hwidUserDevicesQueryKeys,
    useDeleteUserHwidDevice,
    useGetUserHwidDevices
} from '@shared/api/hooks'
import { LoaderModalShared } from '@shared/ui/loader-modal'
import { queryClient } from '@shared/api'

import { IProps } from './interfaces'

export function GetHwidUserDevicesFeature(props: IProps) {
    const { userUuid } = props
    const { t } = useTranslation()
    const [searchQuery, setSearchQuery] = useState('')

    const [opened, handlers] = useDisclosure(false)

    const {
        data: devices,
        isLoading,
        refetch
    } = useGetUserHwidDevices({
        route: {
            userUuid
        }
    })

    const { mutate: deleteDevice } = useDeleteUserHwidDevice({
        mutationFns: {
            onSuccess: (data) => {
                queryClient.setQueryData(
                    hwidUserDevicesQueryKeys.getUserHwidDevices({ userUuid }).queryKey,
                    data
                )
            }
        }
    })

    useEffect(() => {
        refetch()
    }, [opened])

    const handleDeleteDevice = (hwid: string) => {
        deleteDevice({
            variables: {
                hwid,
                userUuid
            }
        })
    }

    const filteredDevices = devices?.devices.filter((device) =>
        device.hwid.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const renderDevices = () => {
        if (!devices?.total) {
            return (
                <Center py="xl">
                    <Stack align="center" gap="xs">
                        <PiEmptyDuotone color="var(--mantine-color-gray-5)" size="3rem" />
                        <Text c="dimmed" size="sm">
                            {t('get-hwid-user-devices.feature.no-devices-found')}
                        </Text>
                    </Stack>
                </Center>
            )
        }

        if (filteredDevices?.length === 0) {
            return (
                <Center py="xl">
                    <Stack align="center" gap="xs">
                        <PiEmptyDuotone color="var(--mantine-color-gray-5)" size="3rem" />
                        <Text c="dimmed" size="sm">
                            {t('get-hwid-user-devices.feature.no-devices-match-your-search')}
                        </Text>
                    </Stack>
                </Center>
            )
        }

        return (
            <Stack gap="md">
                {filteredDevices?.map((device) => (
                    <Card key={device.hwid} padding="md" radius="md" withBorder>
                        <Card.Section bg="gray.9" p="xs">
                            <Group justify="space-between">
                                <Text fw={600} size="sm">
                                    HWID
                                </Text>
                                <CopyButton timeout={2000} value={device.hwid}>
                                    {({ copied, copy }) => (
                                        <Badge
                                            color={copied ? 'teal' : 'blue'}
                                            onClick={copy}
                                            radius="sm"
                                            style={{ cursor: 'pointer' }}
                                        >
                                            {device.hwid}
                                        </Badge>
                                    )}
                                </CopyButton>
                            </Group>
                        </Card.Section>

                        <Stack gap="xs" mt="md">
                            <Group gap="xs" grow>
                                <TextInput
                                    label={t('get-hwid-user-devices.feature.platform')}
                                    readOnly
                                    rightSection={
                                        <CopyButton
                                            timeout={2000}
                                            value={
                                                device.platform ||
                                                t('get-hwid-user-devices.feature.unknown')
                                            }
                                        >
                                            {({ copied, copy }) => (
                                                <ActionIcon
                                                    color={copied ? 'teal' : 'gray'}
                                                    onClick={copy}
                                                    variant="subtle"
                                                >
                                                    {copied ? (
                                                        <PiCheck size="16px" />
                                                    ) : (
                                                        <PiCopy size="16px" />
                                                    )}
                                                </ActionIcon>
                                            )}
                                        </CopyButton>
                                    }
                                    value={
                                        device.platform ||
                                        t('get-hwid-user-devices.feature.unknown')
                                    }
                                />
                                <TextInput
                                    label={t('get-hwid-user-devices.feature.os-version')}
                                    readOnly
                                    rightSection={
                                        <CopyButton
                                            timeout={2000}
                                            value={
                                                device.osVersion ||
                                                t('get-hwid-user-devices.feature.unknown')
                                            }
                                        >
                                            {({ copied, copy }) => (
                                                <ActionIcon
                                                    color={copied ? 'teal' : 'gray'}
                                                    onClick={copy}
                                                    variant="subtle"
                                                >
                                                    {copied ? (
                                                        <PiCheck size="16px" />
                                                    ) : (
                                                        <PiCopy size="16px" />
                                                    )}
                                                </ActionIcon>
                                            )}
                                        </CopyButton>
                                    }
                                    value={
                                        device.osVersion ||
                                        t('get-hwid-user-devices.feature.unknown')
                                    }
                                />
                            </Group>

                            <Group gap="xs">
                                <TextInput
                                    label={t('get-hwid-user-devices.feature.model')}
                                    readOnly
                                    rightSection={
                                        <CopyButton
                                            timeout={2000}
                                            value={
                                                device.deviceModel ||
                                                t('get-hwid-user-devices.feature.unknown')
                                            }
                                        >
                                            {({ copied, copy }) => (
                                                <ActionIcon
                                                    color={copied ? 'teal' : 'gray'}
                                                    onClick={copy}
                                                    variant="subtle"
                                                >
                                                    {copied ? (
                                                        <PiCheck size="16px" />
                                                    ) : (
                                                        <PiCopy size="16px" />
                                                    )}
                                                </ActionIcon>
                                            )}
                                        </CopyButton>
                                    }
                                    value={
                                        device.deviceModel ||
                                        t('get-hwid-user-devices.feature.unknown')
                                    }
                                    w={'100%'}
                                />
                            </Group>

                            <Group gap="xs">
                                <TextInput
                                    label={t('get-hwid-user-devices.feature.user-agent')}
                                    readOnly
                                    rightSection={
                                        <CopyButton
                                            timeout={2000}
                                            value={
                                                device.userAgent ||
                                                t('get-hwid-user-devices.feature.unknown')
                                            }
                                        >
                                            {({ copied, copy }) => (
                                                <ActionIcon
                                                    color={copied ? 'teal' : 'gray'}
                                                    onClick={copy}
                                                    variant="subtle"
                                                >
                                                    {copied ? (
                                                        <PiCheck size="16px" />
                                                    ) : (
                                                        <PiCopy size="16px" />
                                                    )}
                                                </ActionIcon>
                                            )}
                                        </CopyButton>
                                    }
                                    size="sm"
                                    value={
                                        device.userAgent ||
                                        t('get-hwid-user-devices.feature.unknown')
                                    }
                                    w={'100%'}
                                />
                            </Group>

                            <Group gap="xs">
                                <TextInput
                                    label={t('get-hwid-user-devices.feature.added')}
                                    readOnly
                                    value={dayjs(device.createdAt).format('YYYY-MM-DD HH:mm')}
                                    w={'100%'}
                                />
                            </Group>
                        </Stack>

                        <Card.Section p="xs" pt="md">
                            <Button
                                color="red"
                                fullWidth
                                leftSection={<PiTrash size="16px" />}
                                onClick={() => handleDeleteDevice(device.hwid)}
                                variant="light"
                            >
                                {t('get-hwid-user-devices.feature.delete-device')}
                            </Button>
                        </Card.Section>
                    </Card>
                ))}
            </Stack>
        )
    }

    return (
        <>
            <Drawer
                keepMounted={false}
                onClose={handlers.close}
                opened={opened}
                overlayProps={{ backgroundOpacity: 0.6, blur: 0 }}
                padding="lg"
                position="right"
                size="md"
                title={
                    <Group>
                        <Text fw={500}>{t('get-hwid-user-devices.feature.hwid-devices')}</Text>
                        <Badge color="blue" size="sm">
                            {devices?.total || 0}{' '}
                            {devices?.total === 1
                                ? t('get-hwid-user-devices.feature.device')
                                : t('get-hwid-user-devices.feature.devices')}
                        </Badge>
                    </Group>
                }
            >
                <Accordion mb="md" variant="separated">
                    <Accordion.Item value="devices">
                        <Accordion.Control
                            icon={<TbInfoCircle color="var(--mantine-color-red-5)" size="24px" />}
                        >
                            <Text fw={500}>
                                {t('get-hwid-user-devices.feature.important-note')}
                            </Text>
                        </Accordion.Control>
                        <Accordion.Panel>
                            <Text c="dimmed" size="sm">
                                {t('get-hwid-user-devices.feature.important-note-line-1')}{' '}
                                <Code fw={500}>HWID_DEVICE_LIMIT_ENABLED=true</Code>{' '}
                                {t('get-hwid-user-devices.feature.important-note-line-2')}
                                <br />
                                {t('get-hwid-user-devices.feature.important-note-line-3')}
                                <br />
                                <br />
                                {t('get-hwid-user-devices.feature.important-note-line-4')}{' '}
                                <Code>HWID_FALLBACK_DEVICE_LIMIT</Code>{' '}
                                {t('get-hwid-user-devices.feature.important-note-line-5')}
                                <br />
                                <br />
                                {t('get-hwid-user-devices.feature.important-note-line-6')}
                                <br />
                                <br />
                                <Anchor
                                    href="https://remna.st/docs/features/hwid-device-limit"
                                    target="_blank"
                                >
                                    {t('get-hwid-user-devices.feature.important-note-line-7')}
                                </Anchor>
                            </Text>
                        </Accordion.Panel>
                    </Accordion.Item>
                </Accordion>
                {isLoading ? (
                    <LoaderModalShared
                        text={t('get-hwid-user-devices.feature.loading-hwid-devices')}
                    />
                ) : (
                    <Stack>
                        <TextInput
                            label={t('get-hwid-user-devices.feature.search-by-hwid')}
                            onChange={(event) => setSearchQuery(event.currentTarget.value)}
                            placeholder={t(
                                'get-hwid-user-devices.feature.enter-hwid-to-filter-devices'
                            )}
                            value={searchQuery}
                        />
                        {renderDevices()}
                    </Stack>
                )}
            </Drawer>

            <Menu.Item
                leftSection={<TbDevices color="var(--mantine-color-indigo-5)" size="16px" />}
                onClick={handlers.open}
            >
                {t('get-hwid-user-devices.feature.hwid-devices')}
            </Menu.Item>
        </>
    )
}
