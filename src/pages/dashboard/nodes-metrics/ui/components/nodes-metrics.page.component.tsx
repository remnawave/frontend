import { useTranslation } from 'react-i18next'
import { Grid } from '@mantine/core'

import { EditNodeByUuidModalWidget } from '@widgets/dashboard/nodes/edit-node-by-uuid-modal'
import { NodeMetricsWidget } from '@widgets/dashboard/nodes/nodes-metrics'
import { LoadingScreen, Page, PageHeader } from '@shared/ui'
import { ROUTES } from '@shared/constants'

import { IProps } from './interfaces'

export default function NodesMetricsPageComponent(props: IProps) {
    const { t } = useTranslation()
    const { isLoading } = props

    return (
        <Page title={t('constants.nodes-metrics')}>
            <PageHeader
                breadcrumbs={[
                    { label: t('constants.dashboard'), href: ROUTES.DASHBOARD.HOME },

                    { label: t('constants.nodes'), href: ROUTES.DASHBOARD.MANAGEMENT.NODES },
                    { label: t('constants.nodes-metrics') }
                ]}
                title={t('constants.nodes-metrics')}
            />

            <Grid>
                <Grid.Col span={12}>
                    {isLoading ? <LoadingScreen height="60vh" /> : <NodeMetricsWidget />}
                </Grid.Col>
            </Grid>

            <EditNodeByUuidModalWidget />
        </Page>
    )
}
