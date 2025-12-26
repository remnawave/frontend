import { ActionIcon, Box, Divider, Group, Stack, Text, ThemeIcon } from '@mantine/core'
import { GetUserSubscriptionRequestHistoryCommand } from '@remnawave/backend-contract'
import { TbExternalLink, TbViewfinder } from 'react-icons/tb'
import { useTranslation } from 'react-i18next'

import { CopyableFieldShared } from '@shared/ui/copyable-field/copyable-field'
import { SettingsCardShared } from '@shared/ui/settings-card'
import { formatDate } from '@shared/utils/misc'

interface IProps {
    request: GetUserSubscriptionRequestHistoryCommand.Response['response']['records'][number]
}

export const UserSubscriptionRequestItem = (props: IProps) => {
    const { request } = props

    const { t } = useTranslation()

    return (
        <SettingsCardShared.Container>
            <Group align="center" gap="xs" justify="space-between" wrap="nowrap">
                <Group align="center" gap="xs" wrap="nowrap">
                    <ThemeIcon color="cyan" size="lg" variant="light">
                        <TbViewfinder size="20" />
                    </ThemeIcon>
                    <Text fw={600} size="md">
                        #{request.id}
                    </Text>
                </Group>
            </Group>
            <Divider />
            <SettingsCardShared.Content>
                <Stack gap="xs">
                    <Group align="flex-end" gap="xs" wrap="nowrap">
                        <Box style={{ flex: 1 }}>
                            <CopyableFieldShared
                                label={t(
                                    'get-user-subscription-request-history.feature.ip-address'
                                )}
                                size="sm"
                                value={request.requestIp || '-'}
                            />
                        </Box>

                        {request.requestIp && (
                            <ActionIcon
                                color="indigo"
                                component="a"
                                href={`https://ipinfo.io/${request.requestIp}`}
                                rel="noopener noreferrer"
                                size="lg"
                                target="_blank"
                                variant="light"
                            >
                                <TbExternalLink size={18} />
                            </ActionIcon>
                        )}
                    </Group>

                    <CopyableFieldShared
                        label={t('get-user-subscription-request-history.feature.user-agent')}
                        size="sm"
                        value={request.userAgent || '-'}
                    />

                    <CopyableFieldShared
                        label={t('get-user-subscription-request-history.feature.request-at')}
                        size="sm"
                        value={formatDate(request.requestAt, 'DD.MM.YYYY HH:mm:ss')}
                    />
                </Stack>
            </SettingsCardShared.Content>
        </SettingsCardShared.Container>
    )
}
