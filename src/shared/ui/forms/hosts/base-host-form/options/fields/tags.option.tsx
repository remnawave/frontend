import { TagsInput } from '@mantine/core'

import { useSettingsRowControl } from '@shared/ui/settings-row'
import { TagInputPill } from '@shared/ui/tag-input-pill'

import { useHostFormData } from '../host-form-data.context'

export function TagsOption() {
    const { form, handleTagsChange, hostTags, tagsInputProps } = useHostFormData()
    const rowControl = useSettingsRowControl()

    return (
        <TagsInput
            clearable
            data={hostTags ?? []}
            key={form.key('tags')}
            maxTags={10}
            placeholder="Enter tags (comma, space, semicolon)"
            splitChars={[',', ' ', ';']}
            w="100%"
            {...rowControl}
            {...tagsInputProps}
            error={
                Object.keys(form.errors)
                    .filter((key) => key.startsWith('tags.'))
                    .map((key) => form.errors[key])
                    .join(', ') || tagsInputProps.error
            }
            onChange={handleTagsChange}
            renderPill={({ value, onRemove }) => <TagInputPill onRemove={onRemove} value={value} />}
        />
    )
}
