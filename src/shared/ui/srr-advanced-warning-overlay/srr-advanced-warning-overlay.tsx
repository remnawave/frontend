import { Button, Center, List, Modal, Stack, Text, ThemeIcon, Title } from '@mantine/core'
import { TbAlertTriangle, TbCheck } from 'react-icons/tb'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'

import { useMiscStoreActions, useSrrAdvancedModalClosed } from '@entities/dashboard/misc-store'

export function SrrAdvancedWarningOverlay() {
    const { t } = useTranslation()

    const [opened, setOpened] = useState(false)

    const srrAdvancedModalClosed = useSrrAdvancedModalClosed()
    const actions = useMiscStoreActions()

    useEffect(() => {
        if (!srrAdvancedModalClosed) {
            setOpened(true)
        }
    }, [])

    const handleClose = () => {
        actions.setSrrAdvancedModalClosed(true)
        setOpened(false)
    }

    return (
        <Modal
            centered
            onClose={handleClose}
            opened={opened}
            padding="xl"
            radius="md"
            size="md"
            withCloseButton={false}
        >
            <Center>
                <Stack align="center" gap="xl" maw={480}>
                    <ThemeIcon
                        color="orange"
                        radius="xl"
                        size={80}
                        style={{
                            background:
                                'linear-gradient(135deg, rgba(251, 146, 60, 0.15) 0%, rgba(251, 146, 60, 0.05) 100%)',
                            border: '3px solid rgba(251, 146, 60, 0.3)',
                            boxShadow: '0 8px 32px rgba(251, 146, 60, 0.2)'
                        }}
                        variant="light"
                    >
                        <TbAlertTriangle size={40} strokeWidth={2} />
                    </ThemeIcon>

                    <Stack align="center" gap="md">
                        <Title c="orange.4" order={2} ta="center">
                            {t('srr-advanced-warning-overlay.warning')}
                        </Title>

                        <Text c="dimmed" fw={500} size="md" ta="center">
                            {t('srr-advanced-warning-overlay.warning-line-1')}
                        </Text>

                        <List
                            c="dimmed"
                            center
                            icon={
                                <ThemeIcon color="orange" radius="xl" size={20} variant="light">
                                    <TbAlertTriangle size={12} />
                                </ThemeIcon>
                            }
                            size="sm"
                            spacing="xs"
                        >
                            <List.Item>
                                <Text fw={700} span>
                                    {t(
                                        'srr-advanced-warning-overlay.incorrect-configuration-line-1'
                                    )}
                                </Text>{' '}
                                {t('srr-advanced-warning-overlay.incorrect-configuration-line-2')}
                            </List.Item>
                            <List.Item>
                                <Text fw={700} span>
                                    {t(
                                        'srr-advanced-warning-overlay.review-settings-carefully-line-1'
                                    )}
                                </Text>{' '}
                                {t('srr-advanced-warning-overlay.review-settings-carefully-line-2')}
                            </List.Item>
                        </List>
                    </Stack>

                    <Button
                        color="orange"
                        leftSection={<TbCheck size={18} />}
                        onClick={handleClose}
                        size="md"
                        variant="light"
                    >
                        {t('common.continue')}
                    </Button>
                </Stack>
            </Center>
        </Modal>
    )
}
