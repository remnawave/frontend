import { Select } from '@mantine/core'
import { ALPN } from '@remnawave/backend-contract'

import { useSettingsRowControl } from '@shared/ui/settings-row'

import { useHostFormData } from '../host-form-data.context'

export function AlpnOption() {
    const { form } = useHostFormData()
    const rowControl = useSettingsRowControl()

    return (
        <Select
            clearable
            data={Object.values(ALPN).map((alpn) => ({ label: alpn, value: alpn }))}
            key={form.key('alpn')}
            placeholder="h2"
            w="100%"
            {...rowControl}
            {...form.getInputProps('alpn')}
        />
    )
}
