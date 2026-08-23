import { Checkbox, MultiSelect, SegmentedControl } from '@mantine/core'
import { INTERNAL_SQUADS_MODE } from '@remnawave/backend-contract'
import { useTranslation } from 'react-i18next'

import { useSettingsRowControl } from '@shared/ui/settings-row'
import { TagInputPill } from '@shared/ui/tag-input-pill'

import { useHostFormData } from '../host-form-data.context'

export function InternalSquadsModeControl() {
    const { form, internalSquadsModeProps } = useHostFormData()
    const { t } = useTranslation()

    return (
        <SegmentedControl
            aria-label={t('base-host-form.access-mode')}
            data={[
                {
                    label: t('base-host-form.internal-squads-mode-exclude'),
                    value: INTERNAL_SQUADS_MODE.EXCLUDE
                },
                {
                    label: t('base-host-form.internal-squads-mode-allow-only'),
                    value: INTERNAL_SQUADS_MODE.ALLOW_ONLY
                }
            ]}
            key={form.key('internalSquads.mode')}
            size="xs"
            {...internalSquadsModeProps}
        />
    )
}

export function InternalSquadsOption() {
    const { form, internalSquads } = useHostFormData()
    const rowControl = useSettingsRowControl()

    return (
        <MultiSelect
            clearable
            clearButtonProps={{ size: 'xs' }}
            data={internalSquads.map((internalSquad) => ({
                label: internalSquad.name,
                value: internalSquad.uuid
            }))}
            key={form.key('internalSquads.squads')}
            renderOption={(item) => (
                <Checkbox
                    aria-hidden
                    checked={item.checked}
                    label={item.option.label}
                    onChange={() => {}}
                    style={{ pointerEvents: 'none' }}
                    tabIndex={-1}
                />
            )}
            renderPill={({ option, value, onRemove }) => (
                <TagInputPill onRemove={onRemove} value={option?.label ?? value} />
            )}
            searchable
            w="100%"
            {...rowControl}
            {...form.getInputProps('internalSquads.squads')}
        />
    )
}
