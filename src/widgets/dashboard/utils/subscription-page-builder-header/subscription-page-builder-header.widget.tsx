import {
    TbCloudDownload as IconCloudDownload,
    TbDownload as IconDownload,
    TbUpload as IconUpload
} from 'react-icons/tb'
import { Accordion, Button, FileInput, Group, Text } from '@mantine/core'
import { PiInfoDuotone } from 'react-icons/pi'
import { useTranslation } from 'react-i18next'

import { DataTableShared } from '@shared/ui/table'

export function SubscriptionPageBuilderHeaderWidget(props: {
    exportConfig: () => void
    importConfig: (file: File | null) => void
    loadDefaultConfig: () => Promise<void>
}) {
    const { exportConfig, importConfig, loadDefaultConfig } = props
    const { t } = useTranslation()
    return (
        <DataTableShared.Container mb="xl">
            <DataTableShared.Title
                actions={
                    <Group grow preventGrowOverflow={false} wrap="wrap">
                        <Button
                            leftSection={<IconCloudDownload size="16px" />}
                            onClick={loadDefaultConfig}
                            variant="light"
                        >
                            {t('subscription-page-builder-header.widget.load-default')}
                        </Button>

                        <Button leftSection={<IconDownload size="16px" />} onClick={exportConfig}>
                            {t('subscription-page-builder-header.widget.export-config')}
                        </Button>

                        <FileInput
                            accept="application/json,.json"
                            clearable
                            leftSection={<IconUpload size="16px" />}
                            onChange={importConfig}
                            placeholder={t('subscription-page-builder-header.widget.upload-config')}
                            radius="lg"
                        />
                    </Group>
                }
                title={t('subscription-page-builder-header.widget.subscription-page-builder')}
            />
            <DataTableShared.Content>
                <Accordion radius="xs" variant="filled">
                    <Accordion.Item value="importing-json-subscription">
                        <Accordion.Control
                            icon={<PiInfoDuotone color="var(--mantine-color-gray-6)" size={20} />}
                        >
                            {t('subscription-page-builder-header.widget.how-to-use-it')}
                        </Accordion.Control>
                        <Accordion.Panel>
                            <Text fw={500} fz={'md'}>
                                {t('subscription-page-builder-header.widget.description-line-1')}
                            </Text>
                            <Text fw={500} fz={'md'} mt={'xs'}>
                                {t('subscription-page-builder-header.widget.description-line-2')}
                            </Text>
                            <Text c="dimmed" fz="sm" mt="xs">
                                {t('subscription-page-builder-header.widget.description-line-3')}
                            </Text>
                            <Button
                                component="a"
                                href="https://remna.st/docs/install/remnawave-subscription-page#configuring-subscription-page-optional"
                                mt={'xs'}
                                target="_blank"
                            >
                                {t('subscription-page-builder-header.widget.learn-more')}
                            </Button>
                        </Accordion.Panel>
                    </Accordion.Item>
                </Accordion>
            </DataTableShared.Content>
        </DataTableShared.Container>
    )
}
