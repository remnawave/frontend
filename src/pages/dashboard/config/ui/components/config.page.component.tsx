import { Divider } from '@mantine/core'

import { ConfigEditorWidget } from '@widgets/dashboard/config/config-editor/config-editor.widget'
import { KeypairWidget } from '@widgets/dashboard/config/keypair'
import { PageHeader } from '@shared/ui'
import { Page } from '@shared/ui/page'

import { BREADCRUMBS } from './constant'
import { Props } from './interfaces'

export const ConfigPageComponent = (props: Props) => {
    const { config } = props

    return (
        <Page title="Config">
            <PageHeader breadcrumbs={BREADCRUMBS} title="Xray Config Editor" />
            <ConfigEditorWidget config={config} />
            <Divider mb="md" mt="md" size="md" />
            <KeypairWidget />
        </Page>
    )
}
