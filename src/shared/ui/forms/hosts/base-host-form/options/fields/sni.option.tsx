import { TextInput } from '@mantine/core'

import { useSettingsRowControl } from '@shared/ui/settings-row'

import { useHostFormData } from '../host-form-data.context'

export function SniOption() {
    const { form, patternHoverCard } = useHostFormData()
    const rowControl = useSettingsRowControl()

    return (
        <TextInput
            key={form.key('sni')}
            placeholder="example.com"
            rightSection={patternHoverCard(true, true, true)}
            rightSectionPointerEvents="auto"
            w="100%"
            {...rowControl}
            {...form.getInputProps('sni')}
        />
    )
}
