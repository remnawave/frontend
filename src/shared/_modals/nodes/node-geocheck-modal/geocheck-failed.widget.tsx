import { Button, Stack, Text, ThemeIcon } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { TbAlertTriangle, TbRefresh } from 'react-icons/tb'

import { ErrorMessageBlock } from '@shared/ui/error-message-block'

interface IProps {
    message: null | string
    onRestart: () => void
}

export const GeocheckFailedWidget = (props: IProps) => {
    const { message, onRestart } = props
    const { t } = useTranslation()

    return (
        <Stack gap="md" py="sm">
            <Stack align="center" gap="sm">
                <ThemeIcon color="red" radius="md" size="xl" variant="soft">
                    <TbAlertTriangle size={24} />
                </ThemeIcon>

                <Text c="dimmed" size="md" ta="center">
                    {t('node-geocheck.failed-description')}
                </Text>
            </Stack>

            {message && <ErrorMessageBlock message={message} />}

            <Button
                color="teal"
                leftSection={<TbRefresh size={18} />}
                onClick={onRestart}
                variant="soft"
            >
                {t('common.try-again')}
            </Button>
        </Stack>
    )
}
