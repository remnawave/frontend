import { Button, Center, Divider, Group, Modal, Stack, Text, ThemeIcon, Title } from '@mantine/core'
import { TbBaselineDensitySmall, TbColumns, TbMaximize, TbRotate2 } from 'react-icons/tb'
import { PiDeviceMobile, PiMonitor, PiWarning } from 'react-icons/pi'
import { useLocalStorage } from '@mantine/hooks'
import { useEffect, useState } from 'react'

export function MobileWarningOverlay() {
    const [opened, setOpened] = useState(false)

    const [value, setValue] = useLocalStorage({
        key: 'user-table-mobile-warning-dismissed',
        defaultValue: false
    })

    useEffect(() => {
        if (!value) {
            setOpened(true)
        }
    }, [])

    const handleClose = () => {
        setValue(true)
        setOpened(false)
    }

    return (
        <Modal
            centered
            onClose={handleClose}
            opened={opened}
            padding="xl"
            radius="lg"
            size="sm"
            withCloseButton={false}
        >
            <Center>
                <Stack align="center" gap="lg" maw={320}>
                    <ThemeIcon
                        color="orange"
                        size="xl"
                        style={{
                            background: 'rgba(251, 146, 60, 0.1)',
                            border: '2px solid rgba(251, 146, 60, 0.3)'
                        }}
                        variant="light"
                    >
                        <PiWarning size="2rem" />
                    </ThemeIcon>

                    <Stack align="center" gap="sm">
                        <Title c="orange.4" order={3} ta="center">
                            Mobile Device Detected
                        </Title>

                        <Text c="gray.4" fw={800} size="sm" ta="center">
                            This page contains complex tables that may not be comfortable to use on
                            mobile devices.
                        </Text>

                        <Text c="gray.4" size="sm" ta="center">
                            Here are some controls you can use to manage the table on mobile
                            devices.
                        </Text>

                        <Group gap="xs">
                            <TbColumns color="var(--mantine-color-gray-4)" size="1.2rem" />
                            <Text c="gray.4" size="xs">
                                Show or hide columns
                            </Text>
                        </Group>

                        <Group gap="xs">
                            <TbBaselineDensitySmall
                                color="var(--mantine-color-gray-4)"
                                size="1.2rem"
                            />
                            <Text c="gray.4" size="xs">
                                Adjust row spacing density
                            </Text>
                        </Group>

                        <Group gap="xs">
                            <TbMaximize color="var(--mantine-color-gray-4)" size="1.2rem" />
                            <Text c="gray.4" size="xs">
                                Toggle fullscreen table view
                            </Text>
                        </Group>
                    </Stack>

                    <Divider color="cyan.4" mb={0} opacity={0.3} pb={0} variant="dashed" w="100%" />

                    <Stack gap="sm" w="100%">
                        <Group gap="md" justify="center">
                            <Group gap="xs">
                                <PiMonitor color="var(--mantine-color-blue-4)" size="1.2rem" />
                                <Text c="blue.4" size="xs">
                                    Desktop recommended
                                </Text>
                            </Group>

                            <Text c="gray.5" size="xs">
                                or
                            </Text>

                            <Group gap="xs">
                                <TbRotate2 color="var(--mantine-color-teal-4)" size="1.2rem" />
                                <Text c="teal.4" size="xs">
                                    Rotate device
                                </Text>
                            </Group>
                        </Group>
                    </Stack>

                    <Button
                        color="orange"
                        fullWidth
                        leftSection={<PiDeviceMobile size="1rem" />}
                        onClick={handleClose}
                        size="md"
                        variant="light"
                    >
                        I understand, continue anyway
                    </Button>
                </Stack>
            </Center>
        </Modal>
    )
}
