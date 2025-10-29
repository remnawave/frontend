import {
    GetSubscriptionTemplatesCommand,
    TSubscriptionTemplateType
} from '@remnawave/backend-contract'
import { useTranslation } from 'react-i18next'
import { motion } from 'motion/react'
import { Grid } from '@mantine/core'

import { TemplatesHeaderActionButtonsFeature } from '@features/ui/dashboard/templates/header-action-buttons'
import { TemplatesGridWidget } from '@widgets/dashboard/templates/templates-grid/templates-grid.widget'
import { RenameModalShared } from '@shared/ui/modals/rename-modal.shared'
import { DataTableShared } from '@shared/ui/table'
import { ROUTES } from '@shared/constants'
import { PageHeader } from '@shared/ui'
import { Page } from '@shared/ui/page'

interface Props {
    templates: GetSubscriptionTemplatesCommand.Response['response']['templates']
    title: string
    type: TSubscriptionTemplateType
}

export const TemplateBasePageComponent = (props: Props) => {
    const { t } = useTranslation()
    const { templates, title, type } = props

    return (
        <Page title={title}>
            <PageHeader
                breadcrumbs={[
                    { label: t('constants.dashboard'), href: ROUTES.DASHBOARD.HOME },
                    { label: t('constants.templates') },
                    { label: title }
                ]}
                title={title}
            />

            <Grid>
                <Grid.Col span={12}>
                    <DataTableShared.Container mb="xl">
                        <DataTableShared.Title
                            actions={<TemplatesHeaderActionButtonsFeature templateType={type} />}
                            title={title}
                        />
                    </DataTableShared.Container>

                    <motion.div
                        animate={{ opacity: 1 }}
                        initial={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <TemplatesGridWidget
                            templates={templates}
                            templateTitle={title}
                            type={type}
                        />
                    </motion.div>
                </Grid.Col>
            </Grid>

            <RenameModalShared key="rename-template-modal" renameFrom="template" />
        </Page>
    )
}
