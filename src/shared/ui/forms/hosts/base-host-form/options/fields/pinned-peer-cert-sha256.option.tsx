import { TextInput } from '@mantine/core'

import { useSettingsRowControl } from '@shared/ui/settings-row'

import { useHostFormData } from '../host-form-data.context'

export function PinnedPeerCertSha256Option() {
    const { form } = useHostFormData()
    const rowControl = useSettingsRowControl()

    return (
        <TextInput
            key={form.key('pinnedPeerCertSha256')}
            w="100%"
            {...rowControl}
            {...form.getInputProps('pinnedPeerCertSha256')}
        />
    )
}
