import { GetConfigProfilesCommand } from '@remnawave/backend-contract'
import { generatePath, useNavigate } from 'react-router-dom'
import { PiCpu, PiTag } from 'react-icons/pi'
import { Badge, Group } from '@mantine/core'

import { UniversalSpotlightContentShared } from '@shared/ui/universal-spotlight'
import { formatInt } from '@shared/utils/misc'
import { XrayLogo } from '@shared/ui/logos'
import { ROUTES } from '@shared/constants'

interface IProps {
    configProfiles: GetConfigProfilesCommand.Response['response']['configProfiles']
}

export const ConfigProfilesSpotlightWidget = (props: IProps) => {
    const { configProfiles } = props

    const navigate = useNavigate()

    const handleViewConfigProfile = (configProfileUuid: string) => {
        navigate(
            generatePath(ROUTES.DASHBOARD.MANAGEMENT.CONFIG_PROFILE_BY_UUID, {
                uuid: configProfileUuid
            })
        )
    }

    return (
        <UniversalSpotlightContentShared
            actions={configProfiles.map((configProfile) => ({
                label: configProfile.name,
                id: configProfile.uuid,
                leftSection: <XrayLogo color="var(--mantine-color-gray-5)" size={16} />,
                rightSection: (
                    <Group gap="xs" wrap="nowrap">
                        <Badge
                            color="blue"
                            leftSection={<PiTag size={12} />}
                            size="lg"
                            variant="light"
                        >
                            {formatInt(configProfile.inbounds.length, {
                                thousandSeparator: ','
                            })}
                        </Badge>

                        <Badge
                            color={configProfile.nodes.length > 0 ? 'teal' : 'gray'}
                            leftSection={<PiCpu size={12} />}
                            size="lg"
                            variant="light"
                        >
                            {formatInt(configProfile.nodes.length, {
                                thousandSeparator: ','
                            })}
                        </Badge>
                    </Group>
                ),
                onClick: () => handleViewConfigProfile(configProfile.uuid)
            }))}
        />
    )
}
