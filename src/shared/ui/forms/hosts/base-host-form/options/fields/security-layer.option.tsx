import { Select } from '@mantine/core'
import { SECURITY_LAYERS } from '@remnawave/backend-contract'

import { useSettingsRowControl } from '@shared/ui/settings-row'

import { useHostFormData } from '../host-form-data.context'

export function SecurityLayerOption() {
    const { form, securityLayerLabels } = useHostFormData()
    const rowControl = useSettingsRowControl()

    return (
        <Select
            allowDeselect={false}
            clearable={false}
            data={Object.values(SECURITY_LAYERS).map((securityLayer) => ({
                label: securityLayerLabels[securityLayer] || securityLayer,
                value: securityLayer
            }))}
            key={form.key('securityLayer')}
            w="100%"
            {...rowControl}
            {...form.getInputProps('securityLayer')}
        />
    )
}
