import { useTranslation } from 'react-i18next'
import { TbWebhook } from 'react-icons/tb'
import { motion } from 'motion/react'

import { ExternalSquadsGridWidget } from '@widgets/dashboard/external-squads/external-squads-grid/external-squads-grid.widget'
import { ExternalSquadsHeaderActionButtonsFeature } from '@features/ui/dashboard/external-squads/header-action-buttons'
import { ExternalSquadsDrawer } from '@widgets/dashboard/external-squads/external-squads-drawer'
import { PageHeaderShared } from '@shared/ui/page-header/page-header.shared'
import { RenameModalShared } from '@shared/ui/modals/rename-modal.shared'
import { Page } from '@shared/ui/page'

import { Props } from './interfaces'

export const ExternalSquadsPageComponent = (props: Props) => {
    const { t } = useTranslation()
    const { externalSquads } = props

    return (
        <Page title={t('constants.internal-squads')}>
            <PageHeaderShared
                actions={<ExternalSquadsHeaderActionButtonsFeature />}
                icon={<TbWebhook size={24} />}
                title={t('constants.external-squads')}
            />

            <motion.div
                animate={{ opacity: 1 }}
                initial={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
            >
                <ExternalSquadsGridWidget externalSquads={externalSquads} />
            </motion.div>

            <ExternalSquadsDrawer />
            <RenameModalShared key="rename-external-squad-modal" renameFrom="externalSquad" />
        </Page>
    )
}
