import {
    Button,
    Center,
    Divider,
    Group,
    Modal,
    px,
    Stack,
    Text,
    ThemeIcon,
    Title
} from '@mantine/core'
import { TbBaselineDensitySmall, TbColumns, TbMaximize, TbRotate2 } from 'react-icons/tb'
import { PiDeviceMobile, PiMonitor, PiWarning } from 'react-icons/pi'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'

import { useMiscStoreActions, useMobileWarningClosed } from '@entities/dashboard/misc-store'

export function MobileWarningOverlay() {
    const [opened, setOpened] = useState(false)
    const { t } = useTranslation()

    const mobileWarningClosed = useMobileWarningClosed()
    const actions = useMiscStoreActions()

    useEffect(() => {
        if (!mobileWarningClosed) {
            setOpened(true)
        }
    }, [])

    const handleClose = () => {
        actions.setMobileWarningClosed(true)
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
                        <PiWarning size="32px" />
                    </ThemeIcon>

                    <Stack align="center" gap="sm">
                        <Title c="orange.4" order={3} ta="center">
                            {t('mobile-warning-overlay.mobile-device-detected')}
                        </Title>

                        <Text c="gray.4" fw={800} size="sm" ta="center">
                            {t('mobile-warning-overlay.description-line-1')}
                        </Text>

                        <Text c="gray.4" size="sm" ta="center">
                            {t('mobile-warning-overlay.description-line-2')}
                        </Text>

                        <Group gap="xs">
                            <TbColumns color="var(--mantine-color-gray-4)" size={px('1.2rem')} />
                            <Text c="gray.4" size="xs">
                                {t('mobile-warning-overlay.show-or-hide-columns')}
                            </Text>
                        </Group>

                        <Group gap="xs">
                            <TbBaselineDensitySmall
                                color="var(--mantine-color-gray-4)"
                                size={px('1.2rem')}
                            />
                            <Text c="gray.4" size="xs">
                                {t('mobile-warning-overlay.adjust-row-spacing-density')}
                            </Text>
                        </Group>

                        <Group gap="xs">
                            <TbMaximize color="var(--mantine-color-gray-4)" size={px('1.2rem')} />
                            <Text c="gray.4" size="xs">
                                {t('mobile-warning-overlay.toggle-fullscreen-table-view')}
                            </Text>
                        </Group>
                    </Stack>

                    <Divider color="cyan.4" mb={0} opacity={0.3} pb={0} variant="dashed" w="100%" />

                    <Stack gap="sm" w="100%">
                        <Group gap="md" justify="center">
                            <Group gap="xs">
                                <PiMonitor
                                    color="var(--mantine-color-blue-4)"
                                    size={px('1.2rem')}
                                />
                                <Text c="blue.4" size="xs">
                                    {t('mobile-warning-overlay.desktop-recommended')}
                                </Text>
                            </Group>

                            <Text c="gray.s5" size="xs">
                                {t('mobile-warning-overlay.or')}
                            </Text>

                            <Group gap="xs">
                                <TbRotate2
                                    color="var(--mantine-color-teal-4)"
                                    size={px('1.2rem')}
                                />
                                <Text c="teal.4" size="xs">
                                    {t('mobile-warning-overlay.rotate-device')}
                                </Text>
                            </Group>
                        </Group>
                    </Stack>

                    <Button
                        color="orange"
                        fullWidth
                        leftSection={<PiDeviceMobile size="16px" />}
                        onClick={handleClose}
                        size="md"
                        variant="light"
                    >
                        {t('mobile-warning-overlay.i-understand-continue-anyway')}
                    </Button>
                </Stack>
            </Center>
        </Modal>
    )
}
