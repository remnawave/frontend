import { useEffect } from 'react'

import { Grid } from '@mantine/core'
import { useHostsStoreActions, useHostsStoreHosts } from '@entitites/dashboard'
import {
    useDashboardStoreActions,
    useDSInbounds
} from '@entitites/dashboard/dashboard-store/dashboard-store'
import { Page, PageHeader } from '@/shared/ui'
import { HostsTableWidget } from '@/widgets/dashboard/hosts/hosts-table'
import { BREADCRUMBS } from './constants'
import { IProps } from './interfaces'

export default function HostsPageComponent(props: IProps) {
    const hosts = useHostsStoreHosts()
    const actions = useHostsStoreActions()
    const dsActions = useDashboardStoreActions()
    const inbounds = useDSInbounds()

    useEffect(() => {
        ;(async () => {
            await actions.getHosts()
            await dsActions.getInbounds()
        })()
    }, [])

    if (!hosts || !inbounds) {
        return null
    }
    return (
        <Page title="Hosts">
            <PageHeader title="Hosts" breadcrumbs={BREADCRUMBS} />

            <Grid>
                <Grid.Col span={12}>
                    <HostsTableWidget hosts={hosts} inbounds={inbounds} />
                </Grid.Col>
            </Grid>
        </Page>
    )
}
