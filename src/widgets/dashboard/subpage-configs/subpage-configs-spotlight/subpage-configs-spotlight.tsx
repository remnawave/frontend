import { GetSubscriptionPageConfigsCommand } from '@remnawave/backend-contract'
import { generatePath, useNavigate } from 'react-router-dom'
import { TbFile } from 'react-icons/tb'

import { UniversalSpotlightContentShared } from '@shared/ui/universal-spotlight'
import { ROUTES } from '@shared/constants'

interface IProps {
    configs: GetSubscriptionPageConfigsCommand.Response['response']['configs']
}

export const SubpageConfigsSpotlightWidget = (props: IProps) => {
    const { configs } = props

    const navigate = useNavigate()

    const handleViewSubscriptionPageConfig = (subscriptionPageConfigUuid: string) => {
        navigate(
            generatePath(ROUTES.DASHBOARD.SUBPAGE_CONFIGS.SUBPAGE_CONFIG_BY_UUID, {
                uuid: subscriptionPageConfigUuid
            })
        )
    }

    return (
        <UniversalSpotlightContentShared
            actions={configs.map((config) => ({
                label: config.name,
                id: config.uuid,
                leftSection: <TbFile size={24} />,

                onClick: () => handleViewSubscriptionPageConfig(config.uuid)
            }))}
        />
    )
}
