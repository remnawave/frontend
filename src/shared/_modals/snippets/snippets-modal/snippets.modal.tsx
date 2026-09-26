import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { ActionIcon, Box, Group, Modal, Stack, Tooltip } from '@mantine/core'
import { modals } from '@mantine/modals'
import { SnippetsGridWidget } from '@widgets/dashboard/config-profiles/snippets'
import {
    CREATE_SNIPPET_MODAL_ID,
    CreateSnippetModal
} from '@widgets/dashboard/config-profiles/snippets/create-snippet.modal'
import { useTranslation } from 'react-i18next'
import { TbCode, TbPlus, TbRefresh } from 'react-icons/tb'

import { HelpActionIconShared } from '@shared/_modals/universal'
import { useNiceMantineModal } from '@shared/_modals/use-nice-modal'
import { useGetSnippets } from '@shared/api/hooks'
import { useIsMobile } from '@shared/hooks'
import { LoaderModalShared } from '@shared/ui/loader-modal'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'

export const SnippetsModal = NiceModal.create(() => {
    const modal = useModal()
    const { modalProps } = useNiceMantineModal({ modal })

    const { t } = useTranslation()
    const isMobile = useIsMobile()

    const { data: snippets, isLoading, isRefetching, refetch } = useGetSnippets()

    const handleCreateModal = () => {
        modals.open({
            title: (
                <BaseOverlayHeader
                    iconColor="teal"
                    IconComponent={TbCode}
                    iconVariant="soft"
                    title={t('snippets.drawer.widget.create-snippet')}
                />
            ),
            centered: true,
            modalId: CREATE_SNIPPET_MODAL_ID,
            size: '80%',
            fullScreen: isMobile,
            transitionProps: { transition: 'fade' },
            children: <CreateSnippetModal />
        })
    }

    return (
        <Modal
            {...modalProps}
            size="min(760px, 95vw)"
            title={
                <BaseOverlayHeader
                    iconColor="teal"
                    IconComponent={TbCode}
                    iconVariant="soft"
                    title={t('snippets.drawer.widget.snippets')}
                />
            }
            transitionProps={{ transition: 'fade', duration: 200 }}
        >
            {isLoading && <LoaderModalShared mih="240px" />}

            {!isLoading && (
                <Stack gap="md">
                    <Box h={isMobile ? undefined : 'min(62vh, 560px)'}>
                        <SnippetsGridWidget snippets={snippets} />
                    </Box>

                    <Group justify="space-between">
                        <Group gap="xs">
                            <HelpActionIconShared hidden={false} screen="PAGE_SNIPPETS" />

                            <Tooltip label={t('common.action.refresh')}>
                                <ActionIcon
                                    loading={isRefetching}
                                    onClick={() => refetch()}
                                    size="input-md"
                                    variant="soft"
                                >
                                    <TbRefresh size={24} />
                                </ActionIcon>
                            </Tooltip>
                        </Group>

                        <Tooltip label={t('snippets.drawer.widget.new-snippet')}>
                            <ActionIcon
                                color="teal"
                                onClick={handleCreateModal}
                                size="input-md"
                                variant="soft"
                            >
                                <TbPlus size={24} />
                            </ActionIcon>
                        </Tooltip>
                    </Group>
                </Stack>
            )}
        </Modal>
    )
})
