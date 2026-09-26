import { Switch } from '@mantine/core'

import { useSettingsRowControl } from '@shared/ui/settings-row'

import { useHostFormData } from '../host-form-data.context'

function BooleanOption(props: { name: string }) {
    const { form } = useHostFormData()
    const rowControl = useSettingsRowControl()

    return (
        <Switch
            color="teal.8"
            key={form.key(props.name)}
            size="md"
            {...rowControl}
            {...form.getInputProps(props.name, { type: 'checkbox' })}
        />
    )
}

export const IsHiddenOption = () => <BooleanOption name="isHidden" />
export const KeepSniBlankOption = () => <BooleanOption name="keepSniBlank" />
export const MihomoX25519Option = () => <BooleanOption name="mihomoX25519" />
export const OverrideSniFromAddressOption = () => <BooleanOption name="overrideSniFromAddress" />
export const ShuffleHostOption = () => <BooleanOption name="shuffleHost" />
