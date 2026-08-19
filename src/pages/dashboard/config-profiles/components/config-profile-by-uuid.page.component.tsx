import { ActionIcon, ActionIconGroup, Group, Tooltip } from '@mantine/core'
import { GetConfigProfileByUuidCommand, GetSnippetsCommand } from '@remnawave/backend-contract'
import { ConfigEditorWidget } from '@widgets/dashboard/config-profiles/config-editor/config-editor.widget'
import { useTranslation } from 'react-i18next'
import { TbArrowBackUp, TbCode, TbFile } from 'react-icons/tb'
import { useNavigate } from 'react-router'

import { showModal } from '@shared/_modals/show-modal'
import { HelpActionIconShared } from '@shared/_modals/universal'
import { OPEN_ENTITY, ROUTES } from '@shared/constants'
import { CopyEntityLinkButton } from '@shared/ui'
import { Page } from '@shared/ui/page'
import { PageHeaderShared } from '@shared/ui/page-header/page-header.shared'

interface Props {
    configProfile: GetConfigProfileByUuidCommand.Response['response']
    isWasmCrashed: boolean
    isWasmRestarting: boolean
    onRestartWasm: () => void
    snippets: GetSnippetsCommand.Response['response']
}

export const ConfigProfileByUuidPageComponent = (props: Props) => {
    const { configProfile, isWasmCrashed, isWasmRestarting, onRestartWasm, snippets } = props

    const { t } = useTranslation()
    const navigate = useNavigate()

    return (
        <>
            <Page title={t('constants.config-profiles')}>
                <PageHeaderShared
                    actions={
                        <Group>
                            <CopyEntityLinkButton
                                entity={OPEN_ENTITY.CONFIG_PROFILE}
                                iconSize={24}
                                id={configProfile.uuid}
                                size="input-md"
                                variant="soft"
                            />

                            <HelpActionIconShared hidden={false} screen="PAGE_CONFIG_PROFILES" />

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

                            <ActionIcon
                                color="gray"
                                onClick={() =>
                                    navigate(ROUTES.DASHBOARD.MANAGEMENT.CONFIG_PROFILES)
                                }
                                size="input-md"
                                variant="soft"
                            >
                                <TbArrowBackUp size={24} />
                            </ActionIcon>
                        </Group>
                    }
                    description={configProfile.uuid}
                    icon={<TbFile size={24} />}
                    title={configProfile.name}
                />

                <ConfigEditorWidget
                    configProfile={configProfile}
                    isWasmCrashed={isWasmCrashed}
                    isWasmRestarting={isWasmRestarting}
                    onRestartWasm={onRestartWasm}
                    snippets={snippets}
                />
            </Page>
        </>
    )
}
