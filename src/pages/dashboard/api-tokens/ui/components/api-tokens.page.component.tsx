import { useTranslation } from 'react-i18next'
import { Grid } from '@mantine/core'

import { ApiTokensDocumentationWidget } from '@widgets/dashboard/api-tokens/api-tokens-documentation'
import { ApiTokensPageHeaderWidget } from '@widgets/dashboard/api-tokens/api-tokens-page-header'
import { CreateApiTokenModalWidget } from '@widgets/dashboard/api-tokens/create-api-token-modal'
import { ApiTokensTableWidget } from '@widgets/dashboard/api-tokens/api-tokens-table'
import { LoadingScreen, Page, PageHeader } from '@shared/ui'
import { ROUTES } from '@shared/constants'

import { IProps } from './interfaces'

export default function ApiTokensPageComponent(props: IProps) {
    const { t } = useTranslation()

    const { apiTokens, isLoading, docs } = props

    return (
        <Page title={t('constants.api-tokens')}>
            <PageHeader
                breadcrumbs={[
                    { label: t('constants.dashboard'), href: ROUTES.DASHBOARD.HOME },

                    {
                        label: t('constants.api-tokens'),
                        href: ROUTES.DASHBOARD.MANAGEMENT.API_TOKENS
                    }
                ]}
                title={t('constants.api-tokens')}
            />

            <Grid>
                <Grid.Col span={12}>
                    {isLoading ? (
                        <LoadingScreen height="60vh" />
                    ) : (
                        <>
                            <ApiTokensDocumentationWidget docs={docs} />

                            <ApiTokensPageHeaderWidget />

                            <ApiTokensTableWidget apiTokens={apiTokens} />
                        </>
                    )}
                </Grid.Col>
            </Grid>

            <CreateApiTokenModalWidget key="create-api-token-modal" />
        </Page>
    )
}
