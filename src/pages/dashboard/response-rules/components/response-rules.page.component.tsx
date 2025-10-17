import { GetSubscriptionSettingsCommand } from '@remnawave/backend-contract'
import { useTranslation } from 'react-i18next'
import { Box, Flex } from '@mantine/core'

import { ResponseRulesEditorWidget } from '@widgets/dashboard/response-rules/response-rules-editor'
import { ROUTES } from '@shared/constants'
import { PageHeader } from '@shared/ui'
import { Page } from '@shared/ui/page'

interface Props {
    responseRules: GetSubscriptionSettingsCommand.Response['response']['responseRules']
    subscriptionSettingsUuid: string
}

export const ResponseRulesPageComponent = (props: Props) => {
    const { responseRules, subscriptionSettingsUuid } = props

    const { t } = useTranslation()

    // const { isOpen } = useModalsStore(
    //     (state) => state.modals[MODALS.CONFIG_PROFILE_SHOW_SNIPPETS_DRAWER]
    // )
    // const { close } = useModalsStore()

    return (
        <Page title={t('constants.response-rules')}>
            <PageHeader
                breadcrumbs={[
                    { label: t('constants.dashboard'), href: ROUTES.DASHBOARD.HOME },

                    {
                        label: t('constants.response-rules'),
                        href: ROUTES.DASHBOARD.MANAGEMENT.RESPONSE_RULES
                    }
                ]}
                title={t('constants.response-rules')}
            />

            <Flex gap="md">
                <Box style={{ flex: 1, minWidth: 0 }}>
                    <ResponseRulesEditorWidget
                        responseRules={responseRules}
                        subscriptionSettingsUuid={subscriptionSettingsUuid}
                    />
                </Box>
            </Flex>
        </Page>
    )
}
