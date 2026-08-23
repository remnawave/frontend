import { rem, Stack, Text, ThemeIcon } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { TbAdjustmentsHorizontal } from 'react-icons/tb'

import { useHostOptions } from './host-options.context'

export function OptionsEmptyState() {
    const { isBulkEdit } = useHostOptions()
    const { t } = useTranslation()

    return (
        <Stack align="center" gap={6} py={rem(28)}>
            <ThemeIcon color="gray" mb={4} radius="xl" size={48} variant="light">
                <TbAdjustmentsHorizontal size={24} />
            </ThemeIcon>

            <Text fw={600} size="sm">
                {isBulkEdit
                    ? t('base-host-form.no-bulk-options-title')
                    : t('base-host-form.no-options-title')}
            </Text>

            <Text c="dimmed" maw={rem(360)} size="sm" ta="center">
                {isBulkEdit
                    ? t('base-host-form.no-bulk-options-description')
                    : t('base-host-form.no-options-description')}
            </Text>
        </Stack>
    )
}
