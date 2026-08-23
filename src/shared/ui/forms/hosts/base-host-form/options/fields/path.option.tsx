import { TextInput } from '@mantine/core'

import { useSettingsRowControl } from '@shared/ui/settings-row'

import { useHostFormData } from '../host-form-data.context'

export function PathOption() {
    const { form } = useHostFormData()
    const rowControl = useSettingsRowControl()

    return (
        <TextInput
            key={form.key('path')}
            placeholder="/ws"
            w="100%"
            {...rowControl}
            {...form.getInputProps('path')}
        />
    )
}
