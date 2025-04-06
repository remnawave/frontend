import { useTranslation } from 'react-i18next'
import { Grid } from '@mantine/core'

import { InboundsPageHeaderWidget } from '@widgets/dashboard/inbounds/inbounds-page-header'
import { InboundsCardWidget } from '@widgets/dashboard/inbounds/inbounds-card'
import { LoadingScreen, Page, PageHeader } from '@shared/ui'
import { ROUTES } from '@shared/constants'

import { IProps } from './interfaces'

export default function InboundsPageComponent(props: IProps) {
    const { t } = useTranslation()
    const { inbounds, isInboundsLoading } = props

    return (
        <Page title={t('constants.inbounds')}>
            <PageHeader
                breadcrumbs={[
                    { label: t('constants.dashboard'), href: ROUTES.DASHBOARD.HOME },
                    { label: t('constants.management') },
                    { label: t('constants.inbounds') }
                ]}
                title={t('constants.inbounds')}
            />

            <InboundsPageHeaderWidget />

            {isInboundsLoading ? (
                <LoadingScreen height="60vh" />
            ) : (
                <Grid>
                    {inbounds?.map((inbound) => (
                        <Grid.Col key={inbound.uuid} span={{ xs: 12, sm: 6, md: 6 }}>
                            <InboundsCardWidget inbound={inbound} />
                        </Grid.Col>
                    ))}
                </Grid>
            )}
        </Page>
    )
}
