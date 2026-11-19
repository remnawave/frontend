import { Group, TagsInput, Text } from '@mantine/core'
import { useTranslation } from 'react-i18next'

import { useSettingsRowControl } from '@shared/ui/settings-row'
import { TagInputPill } from '@shared/ui/tag-input-pill'

import { useHostFormData } from '../host-form-data.context'

export function IncludeInSrrRulesOption() {
    const { form, srrRuleNames, srrRuleResponseTypes } = useHostFormData()
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
            renderOption={({ option }) => (
                <Group flex={1} gap="xs" justify="space-between" wrap="nowrap">
                    <Text size="sm" truncate>
                        {option.value}
                    </Text>
                    <Text c="dimmed" ff="monospace" size="xs">
                        {srrRuleResponseTypes[option.value]}
                    </Text>
                </Group>
            )}
            renderPill={({ value, onRemove }) => <TagInputPill onRemove={onRemove} value={value} />}
        />
    )
}
