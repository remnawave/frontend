import {
    ActionIcon,
    Badge,
    CopyButton,
    Group,
    Paper,
    Stack,
    Text,
    Title,
    Tooltip
} from '@mantine/core'
import { PiCheck, PiCopy, PiCpu } from 'react-icons/pi'

import { XtlsLogo } from '@shared/ui/logos/xtls-logo'

import { IProps } from './interfaces/props.interface'

export const ConfigProfileDetailHeaderWidget = (props: IProps) => {
    const { configProfile } = props

    return (
        <>
            <Paper mb="lg" p="md" radius="md" withBorder>
                <Group align="center" gap="md" wrap="nowrap">
                    <XtlsLogo size={32} />
                    <Stack gap={4} style={{ flex: 1 }}>
                        <Title lineClamp={2} order={3}>
                            {configProfile.name}
                        </Title>
                        <Group gap="xs">
                            <Group gap={4}>
                                <Text c="dimmed" ff="monospace" size="sm" truncate>
                                    {configProfile.uuid}
                                </Text>
                                <CopyButton timeout={2000} value={configProfile.uuid}>
                                    {({ copied, copy }) => (
                                        <Tooltip label={copied ? 'Copied!' : 'Copy UUID'}>
                                            <ActionIcon
                                                color={copied ? 'teal' : 'gray'}
                                                onClick={copy}
                                                size="xs"
                                                variant="subtle"
                                            >
                                                {copied ? (
                                                    <PiCheck size={12} />
                                                ) : (
                                                    <PiCopy size={12} />
                                                )}
                                            </ActionIcon>
                                        </Tooltip>
                                    )}
                                </CopyButton>
                            </Group>
                        </Group>
                    </Stack>

                    <Tooltip label="Active nodes" position="left">
                        <Badge
                            color={configProfile.nodes.length > 0 ? 'teal' : 'red'}
                            leftSection={<PiCpu size={14} />}
                            size="lg"
                            variant="light"
                        >
                            {configProfile.nodes.length}
                        </Badge>
                    </Tooltip>
                </Group>
            </Paper>
        </>
    )
}
