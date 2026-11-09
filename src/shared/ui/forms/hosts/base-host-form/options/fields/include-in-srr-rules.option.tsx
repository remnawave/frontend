import { TagsInput } from '@mantine/core'
import { useTranslation } from 'react-i18next'

import { useSettingsRowControl } from '@shared/ui/settings-row'
import { TagInputPill } from '@shared/ui/tag-input-pill'

import { useHostFormData } from '../host-form-data.context'

export function IncludeInSrrRulesOption() {
    const { form, srrRuleNames } = useHostFormData()
    const { t } = useTranslation()
    const rowControl = useSettingsRowControl()

    return (
        <TagsInput
            acceptValueOnBlur
            clearable
            data={srrRuleNames}
            key={form.key('includeInSrrRules')}
            placeholder={t('base-host-form.include-in-srr-rules-placeholder')}
            w="100%"
            {...rowControl}
            {...form.getInputProps('includeInSrrRules')}
            renderPill={({ value, onRemove }) => <TagInputPill onRemove={onRemove} value={value} />}
        />
    )
}
