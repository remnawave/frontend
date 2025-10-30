import {
    GetSubscriptionTemplatesCommand,
    TSubscriptionTemplateType
} from '@remnawave/backend-contract'
import { motion } from 'motion/react'

import { TemplatesHeaderActionButtonsFeature } from '@features/ui/dashboard/templates/header-action-buttons'
import { TemplatesGridWidget } from '@widgets/dashboard/templates/templates-grid/templates-grid.widget'
import { RenameModalShared } from '@shared/ui/modals/rename-modal.shared'
import { getCoreLogoFromType } from '@shared/ui/get-core-logo-from-type'
import { Page, PageHeaderShared } from '@shared/ui'

interface Props {
    templates: GetSubscriptionTemplatesCommand.Response['response']['templates']
    title: string
    type: TSubscriptionTemplateType
}

export const TemplateBasePageComponent = (props: Props) => {
    const { templates, title, type } = props

    return (
        <Page title={title}>
            <PageHeaderShared
                actions={<TemplatesHeaderActionButtonsFeature templateType={type} />}
                icon={getCoreLogoFromType({ type })}
                title={title}
            />

            <motion.div
                animate={{ opacity: 1 }}
                initial={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
            >
                <TemplatesGridWidget templates={templates} templateTitle={title} type={type} />
            </motion.div>

            <RenameModalShared key="rename-template-modal" renameFrom="template" />
        </Page>
    )
}
