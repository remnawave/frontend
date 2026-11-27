import { Box, Flex } from '@mantine/core'
import {
    GetSubscriptionSettingsCommand,
    TSubscriptionTemplateType
} from '@remnawave/backend-contract'
import { ResponseRulesEditorWidget } from '@widgets/dashboard/response-rules/response-rules-editor'
import { useTranslation } from 'react-i18next'
import { TbRoute } from 'react-icons/tb'

import { Page, PageHeaderShared } from '@shared/ui'
import { SrrAdvancedWarningOverlay } from '@shared/ui/srr-advanced-warning-overlay/srr-advanced-warning-overlay'

interface Props {
    externalSquads: { name: string; uuid: string }[]
    groupedTemplates: Record<TSubscriptionTemplateType, string[]>
    responseRules: GetSubscriptionSettingsCommand.Response['response']['responseRules']
    subscriptionSettingsUuid: string
}

export const ResponseRulesPageComponent = (props: Props) => {
    const { externalSquads, groupedTemplates, responseRules, subscriptionSettingsUuid } = props

    const { t } = useTranslation()

    return (
        <Page title={t('constants.response-rules')}>
            <PageHeaderShared icon={<TbRoute size={24} />} title={t('constants.response-rules')} />

            <SrrAdvancedWarningOverlay />

            <Flex gap="md">
                <Box style={{ flex: 1, minWidth: 0 }}>
                    <ResponseRulesEditorWidget
                        externalSquads={externalSquads}
                        groupedTemplates={groupedTemplates}
                        responseRules={responseRules}
                        subscriptionSettingsUuid={subscriptionSettingsUuid}
                    />
                </Box>
            </Flex>
        </Page>
    )
}
