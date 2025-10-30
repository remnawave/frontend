import { useTranslation } from 'react-i18next'
import { motion } from 'motion/react'
import { useState } from 'react'

import { MultiSelectHostsFeature } from '@features/dashboard/hosts/multi-select-hosts/multi-select-hosts.feature'
import { CreateHostModalWidget } from '@widgets/dashboard/hosts/create-host-modal'
import { EditHostModalWidget } from '@widgets/dashboard/hosts/edit-host-modal'
import { HostsTableWidget } from '@widgets/dashboard/hosts/hosts-table'
import { LoadingScreen, Page } from '@shared/ui'

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
            {isHostsLoading || isConfigProfilesLoading || isHostTagsLoading || isNodesLoading ? (
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
