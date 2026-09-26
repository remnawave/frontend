import { NumberInput } from '@mantine/core'

import { useSettingsRowControl } from '@shared/ui/settings-row'

import { useHostFormData } from '../host-form-data.context'

export function VlessRouteIdOption() {
    const { form } = useHostFormData()
    const rowControl = useSettingsRowControl()

    return (
        <NumberInput
            key={form.key('vlessRouteId')}
            w="100%"
            {...rowControl}
            {...form.getInputProps('vlessRouteId')}
            allowDecimal={false}
            allowNegative={false}
            clampBehavior="strict"
            decimalScale={0}
            hideControls
            max={65535}
            min={0}
        />
    )
}
