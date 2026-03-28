import { GetTorrentBlockerReportsCommand } from '@remnawave/backend-contract'
import { ActionIcon, Box, Divider, Group, Stack } from '@mantine/core'
import { TbExternalLink, TbFlame, TbJson } from 'react-icons/tb'
import { githubDarkTheme, JsonEditor } from 'json-edit-react'
import { useTranslation } from 'react-i18next'
import { modals } from '@mantine/modals'

import { CopyableFieldShared } from '@shared/ui/copyable-field/copyable-field'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { formatTimeUtil } from '@shared/utils/time-utils/format-time.util'
import { SettingsCardShared } from '@shared/ui/settings-card'

interface IProps {
    report: GetTorrentBlockerReportsCommand.Response['response']['records'][number]
}

export const UserTorrentBlockerReportItem = (props: IProps) => {
    const { report } = props

    const { t, i18n } = useTranslation()

    return (
        <SettingsCardShared.Container key={report.id}>
            <Group align="center" gap="xs" justify="space-between" wrap="nowrap">
                <BaseOverlayHeader
                    countryCode={report.node.countryCode}
                    iconColor="red"
                    IconComponent={TbFlame}
                    iconVariant="soft"
                    title={report.node.name}
                />

                <ActionIcon
                    color="gray"
                    onClick={async () => {
                        modals.open({
                            children: (
                                <Box>
                                    <JsonEditor
                                        collapse={3}
                                        data={JSON.parse(JSON.stringify(report.report))}
                                        indent={2}
                                        maxWidth="100%"
                                        rootName=""
                                        theme={githubDarkTheme}
                                        viewOnly
                                    />
                                </Box>
                            ),
                            title: (
                                <BaseOverlayHeader
                                    iconColor="shaded-gray"
                                    IconComponent={TbJson}
                                    iconVariant="soft"
                                    title="Raw Report"
                                />
                            ),
                            size: 'xl'
                        })
                    }}
                    size="input-sm"
                    variant="soft"
                >
                    <TbJson size="1.5rem" />
                </ActionIcon>
            </Group>

            <Divider />
            <SettingsCardShared.Content>
                <Stack gap="xs">
                    <CopyableFieldShared
                        label="Inbound Tag"
                        size="sm"
                        value={report.report.xrayReport.inboundTag || '–'}
                    />

                    <Group align="flex-end" gap="xs" wrap="nowrap">
                        <Box style={{ flex: 1 }}>
                            <CopyableFieldShared
                                label={t(
                                    'get-user-subscription-request-history.feature.ip-address'
                                )}
                                size="sm"
                                value={report.report.actionReport.ip}
                            />
                        </Box>

                        <ActionIcon
                            color="cyan"
                            component="a"
                            href={`https://ipinfo.io/${report.report.actionReport.ip}`}
                            rel="noopener noreferrer"
                            size="input-sm"
                            target="_blank"
                            variant="soft"
                        >
                            <TbExternalLink size={18} />
                        </ActionIcon>
                    </Group>

                    <CopyableFieldShared
                        label={t('user-torrent-blocker-report-item.processed-at')}
                        size="sm"
                        value={formatTimeUtil({
                            time: report.report.actionReport.processedAt,
                            template: 'TIME_FIRST_DATETIME',
                            language: i18n.language
                        })}
                    />

                    <CopyableFieldShared
                        label={t('user-torrent-blocker-report-item.unblocked-at')}
                        size="sm"
                        value={formatTimeUtil({
                            time: report.report.actionReport.willUnblockAt,
                            template: 'TIME_FIRST_DATETIME',
                            language: i18n.language
                        })}
                    />
                </Stack>
            </SettingsCardShared.Content>
        </SettingsCardShared.Container>
    )
}
