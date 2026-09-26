import { ActionIcon, ActionIconGroup, Group, Tooltip } from '@mantine/core'
import { TSubscriptionTemplateType } from '@remnawave/backend-contract'
import { useTranslation } from 'react-i18next'
import { TbPlus, TbRefresh } from 'react-icons/tb'
import { useNavigate } from 'react-router'

import { showModal } from '@shared/_modals/show-modal'
import { queryClient } from '@shared/api'
import { QueryKeys, useGetSubscriptionTemplates } from '@shared/api/hooks'
import { UniversalSpotlightActionIconShared } from '@shared/ui/universal-spotlight'

interface IProps {
    templateType: TSubscriptionTemplateType
}

export const TemplatesHeaderActionButtonsFeature = (props: IProps) => {
    const { templateType } = props
    const { t } = useTranslation()

    const navigate = useNavigate()

    const { isFetching } = useGetSubscriptionTemplates()

    const handleUpdate = async () => {
        await queryClient.refetchQueries({
            queryKey: QueryKeys.subscriptionTemplate.getSubscriptionTemplates.queryKey
        })
    }

    return (
        <Group grow preventGrowOverflow={false} wrap="wrap">
            <UniversalSpotlightActionIconShared />

            <ActionIconGroup>
                <Tooltip label={t('header-action-buttons.feature.update-templates')} withArrow>
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
                <Tooltip label={t('common.action.create')} withArrow>
                    <ActionIcon
                        color="teal"
                        onClick={() =>
                            showModal('createModal', {
                                createFrom: 'template',
                                contentOptions: { templateType, navigate }
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
