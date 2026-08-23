import { TextInput } from '@mantine/core'
import { useTranslation } from 'react-i18next'

import { useSettingsRowControl } from '@shared/ui/settings-row'

import { useHostFormData } from '../host-form-data.context'

export function ServerDescriptionOption() {
    const { form } = useHostFormData()
    const { t } = useTranslation()
    const rowControl = useSettingsRowControl()

    return (
        <TextInput
            key={form.key('serverDescription')}
            placeholder={t('base-host-form.server-description-placeholder')}
            w="100%"
            {...rowControl}
            {...form.getInputProps('serverDescription')}
        />
    )
}
