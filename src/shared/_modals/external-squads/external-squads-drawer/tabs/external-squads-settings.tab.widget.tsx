import {
    ExternalSquadSubscriptionSettingsSchema,
    GetExternalSquadByUuidCommand
} from '@remnawave/backend-contract'
import { resolveSubscriptionSetting } from '@widgets/dashboard/subscription-settings/settings/resolve-settings'
import { useTranslation } from 'react-i18next'
import z from 'zod'

import { ExternalSquadOverridesTab } from './external-squad-overrides-tab.widget'

interface IProps {
    externalSquad: GetExternalSquadByUuidCommand.Response['response']
}

type SubscriptionSettingsOverride = z.infer<typeof ExternalSquadSubscriptionSettingsSchema>

export const ExternalSquadsSettingsTabWidget = (props: IProps) => {
    const { externalSquad } = props
    const { t } = useTranslation()

    return (
        <ExternalSquadOverridesTab<SubscriptionSettingsOverride>
            config={{
                title: t('subscription-settings.widget.main-settings'),
                description: t(
                    'external-squads-settings.tab.widget.override-subscription-settings-for-this-external-squad'
                ),
                addPlaceholder: t('external-squads-settings.tab.widget.add-override'),
                schemaShape: ExternalSquadSubscriptionSettingsSchema.shape,
                resolveFieldConfig: resolveSubscriptionSetting,
                overrideKey: 'subscriptionSettings',
                getCurrentOverrides: (squad) => squad.subscriptionSettings
            }}
            externalSquad={externalSquad}
        />
    )
}
