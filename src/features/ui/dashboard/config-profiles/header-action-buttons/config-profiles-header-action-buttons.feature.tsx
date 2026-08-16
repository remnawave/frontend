import { ActionIcon, ActionIconGroup, Group, Tooltip } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { TbCode, TbPlus, TbRefresh } from 'react-icons/tb'
import { useNavigate } from 'react-router'

import { showModal } from '@shared/_modals/show-modal'
import { HelpActionIconShared } from '@shared/_modals/universal'
import { queryClient } from '@shared/api'
import { QueryKeys, useGetConfigProfiles } from '@shared/api/hooks'
import { UniversalSpotlightActionIconShared } from '@shared/ui/universal-spotlight'

interface IProps {
    configProfileCount: number
}

export const ConfigProfilesHeaderActionButtonsFeature = (props: IProps) => {
    const { configProfileCount } = props
    const { isFetching } = useGetConfigProfiles()
    const { t } = useTranslation()

    const navigate = useNavigate()

    const handleUpdate = async () => {
        await queryClient.refetchQueries({
            queryKey: QueryKeys.configProfiles.getConfigProfiles.queryKey
        })
    }

    return (
        <Group grow preventGrowOverflow={false} wrap="wrap">
            <HelpActionIconShared hidden={false} screen="PAGE_CONFIG_PROFILES" />

            {configProfileCount > 0 && <UniversalSpotlightActionIconShared />}

            <ActionIconGroup>
                <Tooltip label={t('snippets.drawer.widget.snippets')} withArrow>
                    <ActionIcon
                        color="teal"
                        onClick={() => showModal('snippets_snippetsModal')}
                        size="input-md"
                        variant="soft"
                    >
                        <TbCode size="24px" />
                    </ActionIcon>
                </Tooltip>
            </ActionIconGroup>

            <ActionIconGroup>
                <Tooltip label={t('common.update')} withArrow>
                    <ActionIcon
                        loading={isFetching}
                        onClick={handleUpdate}
                        size="input-md"
                        variant="soft"
                    >
                        <TbRefresh size="24px" />
                    </ActionIcon>
                </Tooltip>
            </ActionIconGroup>

            <ActionIconGroup>
                <Tooltip
                    label={t('config-profiles-header-action-buttons.feature.create-config-profile')}
                    withArrow
                >
                    <ActionIcon
                        color="teal"
                        onClick={() =>
                            showModal('createModal', {
                                createFrom: 'configProfile',
                                contentOptions: { navigate }
                            })
                        }
                        size="input-md"
                        variant="soft"
                    >
                        <TbPlus size="24px" />
                    </ActionIcon>
                </Tooltip>
            </ActionIconGroup>
        </Group>
    )
}
