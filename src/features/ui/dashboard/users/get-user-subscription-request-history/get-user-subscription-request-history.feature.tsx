import {
    TbCalendar,
    TbDevices,
    TbExternalLink,
    TbInfoCircle,
    TbRewindBackward50
} from 'react-icons/tb'
import { Card, Center, Code, Drawer, Group, Menu, Stack, Text } from '@mantine/core'
import { PiEmptyDuotone } from 'react-icons/pi'
import { useDisclosure } from '@mantine/hooks'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'

import { useGetUserSubscriptionRequestHistory } from '@shared/api/hooks'
import { LoaderModalShared } from '@shared/ui/loader-modal'
import { formatDate } from '@shared/utils/misc'

import { IProps } from './interfaces'

export function GetUserSubscriptionRequestHistoryFeature(props: IProps) {
    const { userUuid } = props
    const { t } = useTranslation()

    const [opened, handlers] = useDisclosure(false)

    const {
        data: subscriptionRequestHistory,
        isLoading,
        refetch
    } = useGetUserSubscriptionRequestHistory({
        route: {
            uuid: userUuid
        }
    })

    useEffect(() => {
        refetch()
    }, [opened])

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
                title={t(
                    'get-user-subscription-request-history.feature.subscription-request-history'
                )}
            >
                {isLoading ? (
                    <LoaderModalShared text="Loading..." />
                ) : (
                    <Stack gap="md">
                        {subscriptionRequestHistory?.records.length === 0 && (
                            <Center py="xl">
                                <Stack align="center" gap="xs">
                                    <PiEmptyDuotone
                                        color="var(--mantine-color-gray-5)"
                                        size="3rem"
                                    />
                                    <Text c="dimmed" size="sm">
                                        {t(
                                            'get-user-subscription-request-history.feature.nothing-to-show'
                                        )}
                                    </Text>
                                </Stack>
                            </Center>
                        )}

                        {subscriptionRequestHistory?.records.map((request) => (
                            <Card key={request.id} padding="lg" radius="md" withBorder>
                                <Stack gap="sm">
                                    <Stack gap="xs">
                                        <Group align="center" gap="xs">
                                            <TbCalendar
                                                size={16}
                                                style={{ color: 'var(--mantine-color-cyan-5)' }}
                                            />
                                            <Text fw={500} size="sm">
                                                {t(
                                                    'get-user-subscription-request-history.feature.request-at'
                                                )}
                                            </Text>
                                        </Group>

                                        <Code>
                                            {formatDate(request.requestAt, 'DD.MM.YYYY HH:mm:ss')}
                                        </Code>
                                    </Stack>
                                    <Stack gap="xs">
                                        <Group align="center" gap="xs">
                                            <TbInfoCircle
                                                size={16}
                                                style={{ color: 'var(--mantine-color-cyan-5)' }}
                                            />
                                            <Text fw={500} size="sm">
                                                {t(
                                                    'get-user-subscription-request-history.feature.ip-address'
                                                )}
                                            </Text>

                                            <TbExternalLink
                                                onClick={() => {
                                                    window.open(
                                                        `https://ipinfo.io/${request.requestIp}`,
                                                        '_blank'
                                                    )
                                                }}
                                                size={16}
                                                style={{
                                                    color: 'var(--mantine-color-indigo-5)',
                                                    cursor: 'pointer'
                                                }}
                                            />
                                        </Group>

                                        <Code>{request.requestIp}</Code>
                                    </Stack>

                                    <Stack gap="xs">
                                        <Group align="center" gap="xs">
                                            <TbDevices
                                                size={16}
                                                style={{ color: 'var(--mantine-color-cyan-5)' }}
                                            />
                                            <Text fw={500} size="sm">
                                                {t(
                                                    'get-user-subscription-request-history.feature.user-agent'
                                                )}
                                            </Text>
                                        </Group>

                                        <Code>{request.userAgent}</Code>
                                    </Stack>
                                </Stack>
                            </Card>
                        ))}
                    </Stack>
                )}
            </Drawer>

            <Menu.Item leftSection={<TbRewindBackward50 size="16px" />} onClick={handlers.open}>
                {t('get-user-subscription-request-history.feature.subscription-request-history')}
            </Menu.Item>
        </>
    )
}
