import { GetSubscriptionPageConfigsCommand } from '@remnawave/backend-contract'
import { useTranslation } from 'react-i18next'
import { TbFile } from 'react-icons/tb'
import { motion } from 'motion/react'

import { SubpageConfigsGridWidget } from '@widgets/dashboard/subpage-configs/subpage-configs-grid/subpage-configs-grid.widget'
import { SubpageConfigsHeaderActionButtonsFeature } from '@features/ui/dashboard/subpage-configs/header-action-buttons'
import { SubpageConfigsSpotlightWidget } from '@widgets/dashboard/subpage-configs/subpage-configs-spotlight'
import { RenameModalShared } from '@shared/ui/modals/rename-modal.shared'
import { Page, PageHeaderShared } from '@shared/ui'

interface Props {
    configs: GetSubscriptionPageConfigsCommand.Response['response']['configs']
}

export const SubpageConfigBasePageComponent = (props: Props) => {
    const { configs } = props
    const { t } = useTranslation()

    return (
        <Page title={t('constants.subscription-page')}>
            <PageHeaderShared
                actions={<SubpageConfigsHeaderActionButtonsFeature />}
                icon={<TbFile size={24} />}
                title={t('constants.subscription-page')}
            />

            <motion.div
                animate={{ opacity: 1 }}
                initial={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
            >
                <SubpageConfigsGridWidget configs={configs} />
            </motion.div>

            <SubpageConfigsSpotlightWidget configs={configs} />

            <RenameModalShared key="rename-subpage-config-modal" renameFrom="subpageConfig" />
        </Page>
    )
}
