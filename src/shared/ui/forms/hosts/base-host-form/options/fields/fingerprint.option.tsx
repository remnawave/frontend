import { Autocomplete } from '@mantine/core'
import { FINGERPRINTS } from '@remnawave/backend-contract'
import { PiCaretDown } from 'react-icons/pi'

import { useSettingsRowControl } from '@shared/ui/settings-row'

import { useHostFormData } from '../host-form-data.context'

export function FingerprintOption() {
    const { form } = useHostFormData()
    const rowControl = useSettingsRowControl()

    return (
        <Autocomplete
            clearable
            clearSectionMode="both"
            data={FINGERPRINTS}
            key={form.key('fingerprint')}
            placeholder="chrome"
            rightSection={<PiCaretDown size={16} />}
            w="100%"
            {...rowControl}
            {...form.getInputProps('fingerprint')}
        />
    )
}
