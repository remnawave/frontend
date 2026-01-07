import { useTranslation } from 'react-i18next'
import { Grid } from '@mantine/core'

import { NodesBandwidthTableWidget } from '@widgets/dashboard/nodes-bandwidth-table/table'
import { LoadingScreen, Page } from '@shared/ui'

import { IProps } from './interfaces'

export default function NodesBandwidthTablePageComponent(props: IProps) {
    const { t } = useTranslation()
    const { isLoading } = props

    return (
        <Page title={t('constants.nodes-bandwidth-table')}>
            <Grid>
                <Grid.Col span={12}>
                    {isLoading ? <LoadingScreen height="60vh" /> : <NodesBandwidthTableWidget />}
                </Grid.Col>
            </Grid>
        </Page>
    )
}
