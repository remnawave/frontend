import { InboundsHeaderActionButtonsFeature } from '@features/ui/dashboard/inbounds/inbounds-header-action-buttons'
import { Grid, Stack } from '@mantine/core'
import { getInboundNodeAggregate } from '@widgets/dashboard/inbounds/inbound-status-tile/get-inbound-node-status.util'
import { InboundsCardsWidget } from '@widgets/dashboard/inbounds/inbounds-cards/inbounds-cards.widget'
import { InboundsDataTableWidget } from '@widgets/dashboard/inbounds/inbounds-datatable/inbounds-datatable.widget'
import { InboundsRealtimeMetricsWidget } from '@widgets/dashboard/inbounds/inbounds-realtime-metrics/inbounds-realtime-metrics.widget'
import { motion } from 'motion/react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { TbTag } from 'react-icons/tb'

import { Page } from '@shared/ui/page'
import { PageHeaderShared } from '@shared/ui/page-header/page-header.shared'

import {
    INBOUNDS_VIEW_MODE,
    useInboundsViewMode,
    useViewPreferencesStoreActions
} from '@entities/dashboard/view-preferences-store'

import { Props } from './interfaces'

export const InboundsPageComponent = (props: Props) => {
    const { t } = useTranslation()
    const { inbounds, configProfiles, nodes } = props

    const viewMode = useInboundsViewMode()
    const { setInboundsViewMode } = useViewPreferencesStoreActions()

    const nodeAggregateByInboundUuid = useMemo(
        () =>
            new Map(
                inbounds.map((inbound) => [
                    inbound.uuid,
                    getInboundNodeAggregate(nodes, inbound.uuid)
                ])
            ),
        [inbounds, nodes]
    )

    return (
        <Page title={t('constants.inbounds')}>
            <Grid>
                <Grid.Col span={12}>
                    <Stack>
                        <InboundsRealtimeMetricsWidget inbounds={inbounds} isLoading={false} />

                        <PageHeaderShared
                            actions={
                                <InboundsHeaderActionButtonsFeature
                                    setViewMode={setInboundsViewMode}
                                    viewMode={viewMode}
                                />
                            }
                            icon={<TbTag size={24} />}
                            title={t('constants.inbounds')}
                        />
                    </Stack>

                    {viewMode === INBOUNDS_VIEW_MODE.TABLE ? (
                        <motion.div
                            animate={{ opacity: 1 }}
                            initial={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <InboundsDataTableWidget
                                configProfiles={configProfiles}
                                inbounds={inbounds}
                                nodeAggregateByInboundUuid={nodeAggregateByInboundUuid}
                            />
                        </motion.div>
                    ) : (
                        <InboundsCardsWidget
                            configProfiles={configProfiles}
                            inbounds={inbounds}
                            nodeAggregateByInboundUuid={nodeAggregateByInboundUuid}
                        />
                    )}
                </Grid.Col>
            </Grid>
        </Page>
    )
}
