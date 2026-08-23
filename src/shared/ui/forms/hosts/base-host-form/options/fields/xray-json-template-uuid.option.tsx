import { Select } from '@mantine/core'
import { useTranslation } from 'react-i18next'

import { useSettingsRowControl } from '@shared/ui/settings-row'

import { useHostFormData } from '../host-form-data.context'

export function XrayJsonTemplateUuidOption() {
    const { form, subscriptionTemplates } = useHostFormData()
    const { t } = useTranslation()
    const rowControl = useSettingsRowControl()

    return (
        <Select
            clearable
            data={subscriptionTemplates
                .filter((template) => template.templateType === 'XRAY_JSON')
                .map((template) => ({ label: template.name, value: template.uuid }))}
            key={form.key('xrayJsonTemplateUuid')}
            placeholder={t('base-host-form.select-a-xray-json-template')}
            w="100%"
            {...rowControl}
            {...form.getInputProps('xrayJsonTemplateUuid')}
        />
    )
}
