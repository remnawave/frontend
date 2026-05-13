import { TagsInput, TagsInputProps } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { PiTagDuotone } from 'react-icons/pi'

import { useGetHostTags } from '@shared/api/hooks'

export function HostTagsInputWidget(props: TagsInputProps) {
    const { t } = useTranslation()

    const { data: hostTags } = useGetHostTags({
        rQueryParams: {
            enabled: false
        }
    })

    return (
        <TagsInput
            clearable
            data={hostTags?.tags || []}
            description={t(
                'host-tags-input.tags-are-not-visible-to-end-users-tag-will-be-sent-with-raw-subscription-only'
            )}
            label="Tags"
            leftSection={<PiTagDuotone size="16px" />}
            maxTags={10}
            placeholder="Enter tags (comma, space, semicolon)"
            splitChars={[',', ' ', ';']}
            {...props}
        />
    )
}
