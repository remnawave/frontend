import { Badge, CopyButton, Group, Popover, Text } from '@mantine/core'
import { TEMPLATE_KEYS } from '@remnawave/backend-contract'
import { PiCheck, PiCopy, PiInfo } from 'react-icons/pi'

export const RemarkInfoPopoverWidget = () => {
    return (
        <Popover offset={10} position="left" shadow="md" width={200} withArrow>
            <Popover.Target>
                <span
                    style={{
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    <PiInfo size="1.25rem" />
                </span>
            </Popover.Target>
            <Popover.Dropdown>
                <>
                    <Group gap="xs" pb="xs">
                        <Text size="sm">
                            This is the name of the host that will be displayed in the dashboard.
                        </Text>
                        <Text size="sm">Supports templates.</Text>

                        <Group gap="xs">
                            {TEMPLATE_KEYS.map((key) => (
                                <>
                                    <CopyButton value={`{{${key}}}`}>
                                        {({ copied, copy }) => (
                                            <Badge
                                                color={copied ? 'teal' : 'blue'}
                                                key={key}
                                                leftSection={
                                                    copied ? (
                                                        <PiCheck size="1rem" />
                                                    ) : (
                                                        <PiCopy size="1rem" />
                                                    )
                                                }
                                                onClick={copy}
                                                size="md"
                                            >
                                                {`{{${key}}}`}
                                            </Badge>
                                        )}
                                    </CopyButton>
                                </>
                            ))}
                        </Group>
                    </Group>
                </>
            </Popover.Dropdown>
        </Popover>
    )
}
