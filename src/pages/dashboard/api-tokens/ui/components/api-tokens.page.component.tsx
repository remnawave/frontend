import { Grid } from '@mantine/core'

import { ApiTokensPageHeaderWidget } from '@widgets/dashboard/api-tokens/api-tokens-page-header'
import { CreateApiTokenModalWidget } from '@widgets/dashboard/api-tokens/create-api-token-modal'
import { ApiTokensTableWidget } from '@widgets/dashboard/api-tokens/api-tokens-table'
import { LoadingScreen, Page, PageHeader } from '@shared/ui'

import { BREADCRUMBS } from './constants'
import { IProps } from './interfaces'

export default function ApiTokensPageComponent(props: IProps) {
    const { apiTokens, isLoading } = props

    return (
        <Page title="API Tokens">
            <PageHeader breadcrumbs={BREADCRUMBS} title="API Tokens" />

            <Grid>
                <Grid.Col span={12}>
                    <ApiTokensPageHeaderWidget />

                    {isLoading ? (
                        <LoadingScreen height="60vh" />
                    ) : (
                        <ApiTokensTableWidget apiTokens={apiTokens} />
                    )}
                </Grid.Col>
            </Grid>

            <CreateApiTokenModalWidget key="create-api-token-modal" />
        </Page>
    )
}
