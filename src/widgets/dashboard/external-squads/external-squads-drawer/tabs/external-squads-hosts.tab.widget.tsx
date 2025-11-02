import {
    ExternalSquadHostOverridesSchema,
    GetExternalSquadByUuidCommand
} from '@remnawave/backend-contract'
import { useTranslation } from 'react-i18next'
import z from 'zod'

import { resolveHostFormFields } from '@shared/ui/forms/hosts/base-host-form'

import { ExternalSquadOverridesTab } from './external-squad-overrides-tab.widget'

interface IProps {
    externalSquad: GetExternalSquadByUuidCommand.Response['response']
    isOpen: boolean
}

type HostsOverrides = z.infer<typeof ExternalSquadHostOverridesSchema>

export const ExternalSquadsHostOverridesTabWidget = (props: IProps) => {
    const { externalSquad, isOpen } = props
    const { t } = useTranslation()

    return (
        <ExternalSquadOverridesTab<HostsOverrides>
            config={{
                title: t('external-squads-hosts.tab.widget.host-overrides'),
                description: t(
                    'external-squads-hosts.tab.widget.override-host-settings-for-this-external-squad'
                ),
                addPlaceholder: t('external-squads-settings.tab.widget.add-override'),
                schemaShape: ExternalSquadHostOverridesSchema.shape,
                resolveFieldConfig: resolveHostFormFields,
                overrideKey: 'hostOverrides',
                getCurrentOverrides: (squad) => squad.hostOverrides
            }}
            externalSquad={externalSquad}
            isOpen={isOpen}
        />
    )
}
