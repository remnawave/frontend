import { ChipMultiSelect } from '@shared/ui/chip-multi-select'

import { SUBSCRIPTION_TYPES } from '../../subscription-types'
import { useHostFormData } from '../host-form-data.context'

export function ExcludeFromSubscriptionTypesOption() {
    const { form } = useHostFormData()

    return (
        <ChipMultiSelect
            data={Object.entries(SUBSCRIPTION_TYPES).map(([value, { label, icon }]) => ({
                label,
                icon,
                value
            }))}
            key={form.key('excludeFromSubscriptionTypes')}
            {...form.getInputProps('excludeFromSubscriptionTypes')}
        />
    )
}
