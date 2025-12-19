import { Center, Stack, Text } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { PiEmpty } from 'react-icons/pi'

export const EmptyPageLayout = () => {
    const { t } = useTranslation()
    return (
        <Center h="calc(90vh - 120px)" mt="-5vh">
            <Stack align="center" c="dimmed" gap="md">
                <PiEmpty size={48} />
                <Text c="dimmed" fw={600}>
                    {t('empty-page.layout.nothing-found')}
                </Text>
            </Stack>
        </Center>
    )
}
