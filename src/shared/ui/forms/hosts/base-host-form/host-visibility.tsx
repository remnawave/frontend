import { Group, Stack, Switch, Text, ThemeIcon } from '@mantine/core'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { PiProhibit, PiPulse } from 'react-icons/pi'

import { useHostFormData } from './options'

export function HostVisibility() {
    const { form } = useHostFormData()
    const { t } = useTranslation()

    const switchId = useId()
    const isEnabled = form.getValues().isDisabled === false

    return (
        <Group gap="sm" justify="space-between" wrap="nowrap">
            <Group gap="sm" wrap="nowrap">
                <ThemeIcon color={isEnabled ? 'teal' : 'gray'} size="lg" variant="soft">
                    {isEnabled ? <PiPulse size={22} /> : <PiProhibit size={22} />}
                </ThemeIcon>

                <Stack gap={0}>
                    <Text
                        component="label"
                        fw={600}
                        htmlFor={switchId}
                        size="sm"
                        style={{ cursor: 'pointer' }}
                    >
                        {t('base-host-form.host-visibility')}
                    </Text>
                    <Text c={isEnabled ? 'teal.4' : 'dimmed'} fw={600} size="xs">
                        {isEnabled
                            ? t('use-hosts-table-widget.enabled')
                            : t('use-hosts-table-widget.disabled')}
                    </Text>
                </Stack>
            </Group>

            <Switch
                checked={isEnabled}
                color="teal.8"
                id={switchId}
                onChange={(event) => form.setFieldValue('isDisabled', !event.currentTarget.checked)}
                size="lg"
            />
        </Group>
    )
}
