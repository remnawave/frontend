import { TbCirclesRelation } from 'react-icons/tb'
import { useTranslation } from 'react-i18next'

import { InternalSquadAccessibleNodesModalWidget } from '@widgets/dashboard/internal-squads/internal-squad-accessible-nodes-modal/internal-squad-accessible-nodes.modal.widget'
import { InternalSquadsSpotlightWidget } from '@widgets/dashboard/internal-squads/internal-squads-spotlight/internal-squads-spotlight'
import { InternalSquadsGridWidget } from '@widgets/dashboard/internal-squads/internal-squads-grid/internal-squads-grid.widget'
import { InternalSquadsHeaderActionButtonsFeature } from '@features/ui/dashboard/internal-squads/header-action-buttons'
import { InternalSquadsDrawerWithStore } from '@widgets/dashboard/users/internal-squads-drawer-with-store'
import { PageHeaderShared } from '@shared/ui/page-header/page-header.shared'
import { RenameModalShared } from '@shared/ui/modals/rename-modal.shared'
import { Page } from '@shared/ui/page'

import { Props } from './interfaces'

export const InternalSquadsPageComponent = (props: Props) => {
    const { t } = useTranslation()
    const { internalSquads } = props

    return (
        <Page title={t('constants.internal-squads')}>
            <PageHeaderShared
                actions={
                    <InternalSquadsHeaderActionButtonsFeature
                        internalSquadCount={internalSquads.length}
                    />
                }
                icon={<TbCirclesRelation size={24} />}
                title={t('constants.internal-squads')}
            />

            <InternalSquadsGridWidget internalSquads={internalSquads} />

            {internalSquads.length > 0 && (
                <InternalSquadsSpotlightWidget internalSquads={internalSquads} />
            )}

            <RenameModalShared key="rename-internal-squad-modal" renameFrom="internalSquad" />
            <InternalSquadAccessibleNodesModalWidget key="internal-squad-accessible-nodes-modal" />
            <InternalSquadsDrawerWithStore key="internal-squads-drawer-with-store" />
        </Page>
    )
}
