import { Select } from '@mantine/core'
import { MIHOMO_IP_VERSION } from '@remnawave/backend-contract'

import { useSettingsRowControl } from '@shared/ui/settings-row'

import { useHostFormData } from '../host-form-data.context'

export function MihomoIpVersionOption() {
    const { form } = useHostFormData()
    const rowControl = useSettingsRowControl()

    return (
        <Select
            clearable
            data={Object.values(MIHOMO_IP_VERSION).map((ipVersion) => ({
                label: ipVersion,
                value: ipVersion
            }))}
            key={form.key('mihomoIpVersion')}
            w="100%"
            {...rowControl}
            {...form.getInputProps('mihomoIpVersion')}
        />
    )
}
