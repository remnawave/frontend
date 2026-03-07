import { GetNodePluginCommand } from '@remnawave/backend-contract'
import { TbArrowBackUp, TbBook, TbPackage } from 'react-icons/tb'
import { ActionIcon, Box, Flex, Group } from '@mantine/core'
import { useNavigate } from 'react-router-dom'

import { NodePluginEditorWidget } from '@widgets/dashboard/node-plugins/node-plugin-editor'
import { Page, PageHeaderShared } from '@shared/ui'
import { ROUTES } from '@shared/constants'

interface Props {
    plugin: GetNodePluginCommand.Response['response']
}

export const NodePluginEditorPageComponent = (props: Props) => {
    const { plugin } = props

    const navigate = useNavigate()

    return (
        <Page title={plugin.name}>
            <PageHeaderShared
                actions={
                    <Group>
                        {/* <HelpActionIconShared
                            hidden={!isHelpDrawerVisible}
                            screen="EDITOR_TEMPLATES_XRAY_JSON"
                        /> */}

                        <ActionIcon
                            color="lime"
                            component="a"
                            href="https://docs.rw/docs/learn/node-plugins"
                            size="input-md"
                            target="_blank"
                            variant="soft"
                        >
                            <TbBook size={24} />
                        </ActionIcon>

                        <ActionIcon
                            color="gray"
                            onClick={() => navigate(ROUTES.DASHBOARD.MANAGEMENT.NODE_PLUGINS.ROOT)}
                            size="input-md"
                            variant="soft"
                        >
                            <TbArrowBackUp size={24} />
                        </ActionIcon>
                    </Group>
                }
                description={plugin.uuid}
                icon={<TbPackage size={24} />}
                title={plugin.name}
            />
            <Flex gap="md">
                <Box style={{ flex: 1, minWidth: 0 }}>
                    <NodePluginEditorWidget
                        nodePlugin={plugin.pluginConfig}
                        pluginUuid={plugin.uuid}
                    />
                </Box>
            </Flex>
        </Page>
    )
}
