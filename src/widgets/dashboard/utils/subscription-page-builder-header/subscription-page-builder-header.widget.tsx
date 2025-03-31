import { IconCloudDownload, IconDownload, IconUpload } from '@tabler/icons-react'
import { Accordion, Button, FileInput, Group, Text } from '@mantine/core'
import { PiInfoDuotone } from 'react-icons/pi'

import { DataTableShared } from '@shared/ui/table'

export function SubscriptionPageBuilderHeaderWidget(props: {
    exportConfig: () => void
    importConfig: (file: File | null) => void
    loadDefaultConfig: () => Promise<void>
}) {
    const { exportConfig, importConfig, loadDefaultConfig } = props

    return (
        <DataTableShared.Container mb="xl">
            <DataTableShared.Title
                actions={
                    <Group grow preventGrowOverflow={false} wrap="wrap">
                        <Button
                            leftSection={<IconCloudDownload size="1rem" />}
                            onClick={loadDefaultConfig}
                            variant="light"
                        >
                            Load Default
                        </Button>

                        <Button leftSection={<IconDownload size="1rem" />} onClick={exportConfig}>
                            Export Config
                        </Button>

                        <FileInput
                            accept="application/json,.json"
                            clearable
                            leftSection={<IconUpload size="1rem" />}
                            onChange={importConfig}
                            placeholder="Upload Config"
                            radius="lg"
                        />
                    </Group>
                }
                title="Subscription Page Builder"
            />
            <DataTableShared.Content>
                <Accordion radius="xs" variant="filled">
                    <Accordion.Item value="importing-json-subscription">
                        <Accordion.Control
                            icon={<PiInfoDuotone color="var(--mantine-color-gray-6)" size={20} />}
                        >
                            How to use it?
                        </Accordion.Control>
                        <Accordion.Panel>
                            <Text fw={500} fz={'md'}>
                                You can use this builder to configure available clients and guides
                                for Remnawave Subscription Page.
                            </Text>
                            <Text fw={500} fz={'md'} mt={'xs'}>
                                After creating your first configuration, you can download it and
                                mount to subscription-page container.
                            </Text>
                            <Text c="dimmed" fz="sm" mt="xs">
                                Click "Load Default" to get the reference configuration from the
                                GitHub repository.
                            </Text>
                            <Button
                                component="a"
                                href="https://remna.st/subscription-templating/installation"
                                mt={'xs'}
                                target="_blank"
                            >
                                Learn more
                            </Button>
                        </Accordion.Panel>
                    </Accordion.Item>
                </Accordion>
            </DataTableShared.Content>
        </DataTableShared.Container>
    )
}
