import { TextInput } from '@mantine/core'

import { useSettingsRowControl } from '@shared/ui/settings-row'

import { useHostFormData } from '../host-form-data.context'

export function HostOption() {
    const { form, patternHoverCard } = useHostFormData()
    const rowControl = useSettingsRowControl()

    return (
        <TextInput
            key={form.key('host')}
            placeholder="example.com"
            rightSection={patternHoverCard(true, false, true)}
            rightSectionPointerEvents="auto"
            w="100%"
            {...rowControl}
            {...form.getInputProps('host')}
        />
    )
}
