import { TbInfoCircle, TbNetworkOff, TbNote, TbWorldWww } from 'react-icons/tb'
import { Accordion, List, Stack, Text, ThemeIcon } from '@mantine/core'
import { useTranslation } from 'react-i18next'

import { HeaderActionButtonsFeature } from '@features/ui/dashboard/hosts/header-action-buttons'
import { DataTableShared } from '@shared/ui/table'

export function HostsPageHeaderWidget() {
    const { t } = useTranslation()

    return (
        <DataTableShared.Container mb="xl">
            <DataTableShared.Title
                actions={<HeaderActionButtonsFeature />}
                description={t('hosts-page-header.widget.list-of-all-hosts')}
                title={t('constants.hosts')}
            />
            <DataTableShared.Content>
                <Accordion radius="xs" variant="filled">
                    <Accordion.Item value="hosts-explanation">
                        <Accordion.Control
                            icon={<TbInfoCircle color="var(--mantine-color-teal-6)" size={20} />}
                        >
                            {t('hosts-page-header.widget.about-hosts')}
                        </Accordion.Control>
                        <Accordion.Panel>
                            <Stack gap="md">
                                <Text>
                                    {t('hosts-page-header.widget.header-description-line-1')}
                                    <br />
                                    {t('hosts-page-header.widget.header-description-line-2')}
                                </Text>

                                <List spacing="xs">
                                    <List.Item
                                        icon={
                                            <ThemeIcon
                                                color="teal"
                                                radius="xl"
                                                size={28}
                                                variant="light"
                                            >
                                                <TbNote size={16} />
                                            </ThemeIcon>
                                        }
                                    >
                                        <Text fw={500}>{t('hosts-page-header.widget.remark')}</Text>
                                        <Text size="sm">
                                            {t(
                                                'hosts-page-header.widget.remark-description-line-1'
                                            )}
                                            <br />
                                            {t(
                                                'hosts-page-header.widget.remark-description-line-2'
                                            )}
                                        </Text>
                                    </List.Item>

                                    <List.Item
                                        icon={
                                            <ThemeIcon
                                                color="blue"
                                                radius="xl"
                                                size={28}
                                                variant="light"
                                            >
                                                <TbNetworkOff
                                                    size={16}
                                                    style={{
                                                        strokeWidth: 1.5
                                                    }}
                                                />
                                            </ThemeIcon>
                                        }
                                    >
                                        <Text fw={500}>
                                            {t('hosts-page-header.widget.inbound')}
                                        </Text>
                                        <Text size="sm">
                                            {t('hosts-page-header.widget.inbound-line-1')}
                                            <br />
                                            {t('hosts-page-header.widget.inbound-line-2')}
                                        </Text>
                                    </List.Item>

                                    <List.Item
                                        icon={
                                            <ThemeIcon
                                                color="grape"
                                                radius="xl"
                                                size={28}
                                                variant="light"
                                            >
                                                <TbWorldWww
                                                    size={16}
                                                    style={{
                                                        strokeWidth: 1.5
                                                    }}
                                                />
                                            </ThemeIcon>
                                        }
                                    >
                                        <Text fw={500}>
                                            {t('hosts-page-header.widget.address-and-port')}
                                        </Text>
                                        <Text size="sm">
                                            {t('hosts-page-header.widget.address-and-port-line-1')}
                                            <br />
                                            {t('hosts-page-header.widget.address-and-port-line-2')}
                                            <br />
                                            {t('hosts-page-header.widget.address-and-port-line-3')}
                                        </Text>
                                    </List.Item>
                                </List>

                                <Text c="dimmed" size="sm">
                                    {t('hosts-page-header.widget.advanced-settings')}
                                    <br />
                                    {t('hosts-page-header.widget.advanced-settings-2')}
                                </Text>
                            </Stack>
                        </Accordion.Panel>
                    </Accordion.Item>
                </Accordion>
            </DataTableShared.Content>
        </DataTableShared.Container>
    )
}
