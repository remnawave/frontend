import { GetAllNodesCommand, GetNodePluginsCommand } from '@remnawave/backend-contract'
import { useTranslation } from 'react-i18next'
import { TbFile } from 'react-icons/tb'
import { motion } from 'motion/react'

import { NodePluginExecutorDrawer } from '@widgets/dashboard/node-plugins/node-plugin-executor/node-plugin-executor.drawer'
import { NodePluginsGridWidget } from '@widgets/dashboard/node-plugins/node-plugins-grid/node-plugins-grid.widget'
import { NodePluginsHeaderActionButtonsFeature } from '@features/ui/dashboard/node-plugins/header-action-buttons'
import { NodePluginsSpotlightWidget } from '@widgets/dashboard/node-plugins/node-plugins-spotlight'
import { RenameModalShared } from '@shared/ui/modals/rename-modal.shared'
import { Page, PageHeaderShared } from '@shared/ui'

interface Props {
    nodes: GetAllNodesCommand.Response['response']
    plugins: GetNodePluginsCommand.Response['response']['nodePlugins']
}

export const NodePluginsBasePageComponent = (props: Props) => {
    const { nodes, plugins } = props
    const { t } = useTranslation()

    return (
        <Page title={t('constants.node-plugins')}>
            <PageHeaderShared
                actions={<NodePluginsHeaderActionButtonsFeature />}
                icon={<TbFile size={24} />}
                title={t('constants.node-plugins')}
            />

            <motion.div
                animate={{ opacity: 1 }}
                initial={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
            >
                <NodePluginsGridWidget nodes={nodes} plugins={plugins} />
            </motion.div>

            <NodePluginsSpotlightWidget plugins={plugins} />

            <RenameModalShared key="rename-node-plugin-modal" renameFrom="nodePlugin" />
            <NodePluginExecutorDrawer />
        </Page>
    )
}
