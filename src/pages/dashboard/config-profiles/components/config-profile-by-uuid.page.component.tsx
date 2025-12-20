import { GetConfigProfileByUuidCommand, GetSnippetsCommand } from '@remnawave/backend-contract'
import { ActionIcon, Box, Drawer, Flex, Group, Transition } from '@mantine/core'
import { TbArrowBack, TbCode, TbFile } from 'react-icons/tb'
import { useMediaQuery } from '@mantine/hooks'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { ConfigEditorWidget } from '@widgets/dashboard/config-profiles/config-editor/config-editor.widget'
import { SnippetsDrawerWidget } from '@widgets/dashboard/config-profiles/snippets-drawer'
import { MODALS, useModalClose, useModalIsOpen } from '@entities/dashboard/modal-store'
import { PageHeaderShared } from '@shared/ui/page-header/page-header.shared'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { HelpActionIconShared } from '@shared/ui/help-drawer'
import { ROUTES } from '@shared/constants'
import { Page } from '@shared/ui/page'

interface Props {
    configProfile: GetConfigProfileByUuidCommand.Response['response']
    snippets: GetSnippetsCommand.Response['response']
}

export const ConfigProfileByUuidPageComponent = (props: Props) => {
    const { configProfile, snippets } = props

    const { t } = useTranslation()
    const isMobile = useMediaQuery('(max-width: 1200px)')
    const navigate = useNavigate()

    const isOpen = useModalIsOpen(MODALS.CONFIG_PROFILE_SHOW_SNIPPETS_DRAWER)
    const close = useModalClose(MODALS.CONFIG_PROFILE_SHOW_SNIPPETS_DRAWER)

    return (
        <>
            <Page title={t('constants.config-profiles')}>
                <PageHeaderShared
                    actions={
                        <Group>
                            <HelpActionIconShared hidden={false} screen="PAGE_CONFIG_PROFILES" />

                            <ActionIcon
                                color="gray"
                                onClick={() =>
                                    navigate(ROUTES.DASHBOARD.MANAGEMENT.CONFIG_PROFILES)
                                }
                                size="input-md"
                                variant="light"
                            >
                                <TbArrowBack size={24} />
                            </ActionIcon>
                        </Group>
                    }
                    description={configProfile.uuid}
                    icon={<TbFile size={24} />}
                    title={configProfile.name}
                />

                {isMobile ? (
                    <>
                        <ConfigEditorWidget configProfile={configProfile} snippets={snippets} />

                        <Drawer
                            keepMounted={false}
                            onClose={close}
                            opened={isOpen}
                            position="right"
                            size="450px"
                            title={
                                <BaseOverlayHeader
                                    IconComponent={TbCode}
                                    iconVariant="gradient-violet"
                                    title={t('snippets.drawer.widget.snippets')}
                                />
                            }
                            withCloseButton={true}
                        >
                            <SnippetsDrawerWidget />
                        </Drawer>
                    </>
                ) : (
                    <Flex gap="md">
                        <Box style={{ flex: 1, minWidth: 0 }}>
                            <ConfigEditorWidget configProfile={configProfile} snippets={snippets} />
                        </Box>

                        <Box
                            style={{
                                width: isOpen ? '400px' : '0px',
                                overflow: 'hidden',
                                transition: 'width 0.3s ease'
                            }}
                        >
                            <Transition
                                duration={300}
                                keepMounted
                                mounted={isOpen}
                                timingFunction="ease"
                                transition={{
                                    in: { opacity: 1, transform: 'translateX(0)' },
                                    out: { opacity: 0, transform: 'translateX(20px)' },
                                    transitionProperty: 'transform, opacity'
                                }}
                            >
                                {(transitionStyles) => (
                                    <Box
                                        style={{
                                            ...transitionStyles,
                                            width: '400px',
                                            pointerEvents: isOpen ? 'auto' : 'none'
                                        }}
                                    >
                                        <SnippetsDrawerWidget />
                                    </Box>
                                )}
                            </Transition>
                        </Box>
                    </Flex>
                )}
            </Page>
        </>
    )
}
