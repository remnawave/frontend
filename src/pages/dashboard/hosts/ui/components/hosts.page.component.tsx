/* eslint-disable @stylistic/indent */

import { useTranslation } from 'react-i18next'
import { motion } from 'motion/react'
import { Grid } from '@mantine/core'
import { useState } from 'react'

import { MultiSelectHostsFeature } from '@features/dashboard/hosts/multi-select-hosts/multi-select-hosts.feature'
import { CreateHostModalWidget } from '@widgets/dashboard/hosts/create-host-modal'
import { HostsPageHeaderWidget } from '@widgets/dashboard/hosts/hosts-page-header'
import { EditHostModalWidget } from '@widgets/dashboard/hosts/edit-host-modal'
import { HostsTableWidget } from '@widgets/dashboard/hosts/hosts-table'
import { LoadingScreen, Page, PageHeader } from '@shared/ui'
import { ROUTES } from '@shared/constants'

import { IProps } from './interfaces'

export default function HostsPageComponent(props: IProps) {
    const { t } = useTranslation()
    const {
        configProfiles,
        hosts,
        hostTags,
        isHostsLoading,
        isConfigProfilesLoading,
        isHostTagsLoading,
        isNodesLoading
    } = props
    const [selectedHosts, setSelectedHosts] = useState<string[]>([])

    return (
        <Page title={t('constants.hosts')}>
            <PageHeader
                breadcrumbs={[
                    { label: t('constants.dashboard'), href: ROUTES.DASHBOARD.HOME },

                    { label: t('constants.hosts') }
                ]}
                title={t('constants.hosts')}
            />

            <Grid>
                <Grid.Col span={12}>
                    <HostsPageHeaderWidget />

                    {isHostsLoading ||
                    isConfigProfilesLoading ||
                    isHostTagsLoading ||
                    isNodesLoading ? (
                        <LoadingScreen height="60vh" />
                    ) : (
                        <motion.div
                            animate={{ opacity: 1 }}
                            initial={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <HostsTableWidget
                                configProfiles={configProfiles}
                                hosts={hosts}
                                hostTags={hostTags}
                                selectedHosts={selectedHosts}
                                setSelectedHosts={setSelectedHosts}
                            />
                        </motion.div>
                    )}
                </Grid.Col>
            </Grid>

            <EditHostModalWidget key="edit-host-modal" />
            <CreateHostModalWidget key="create-host-modal" />
            <MultiSelectHostsFeature
                configProfiles={configProfiles}
                hosts={hosts}
                selectedHosts={selectedHosts}
                setSelectedHosts={setSelectedHosts}
            />
        </Page>
    )
}
