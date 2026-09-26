import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { ActionIcon, Box, Group, Modal, Stack, Tooltip } from '@mantine/core'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { TbList, TbPlus, TbRefresh } from 'react-icons/tb'

import { showModal } from '@shared/_modals/show-modal'
import { useNiceMantineModal } from '@shared/_modals/use-nice-modal'
import { useGetSharedLists } from '@shared/api/hooks'
import { EmptyPageLayout } from '@shared/ui/layouts/empty-page/empty-page.layout'
import { LoaderModalShared } from '@shared/ui/loader-modal'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { buildTree, TreeBrowser } from '@shared/ui/tree-browser'

import { sharedListRow, TSharedList } from './shared-list-row'
import { useSharedListActions } from './use-shared-list-actions'

const getName = (sharedList: TSharedList) => sharedList.name

export const SharedListsModal = NiceModal.create(() => {
    const modal = useModal()
    const { modalProps } = useNiceMantineModal({ modal })

    const { t } = useTranslation()

    const { data: sharedLists, isLoading, isRefetching, refetch } = useGetSharedLists()

    const lists = sharedLists?.sharedLists ?? []

    const tree = useMemo(() => buildTree(lists, getName), [sharedLists])

    const { deletingName, handleDelete } = useSharedListActions()

    return (
        <Modal
            {...modalProps}
            size="min(700px, 90vw)"
            title={
                <BaseOverlayHeader
                    iconColor="indigo"
                    IconComponent={TbList}
                    iconVariant="soft"
                    subtitle={t('shared-lists.modal.subtitle')}
                    title={t('common.field.shared-lists')}
                />
            }
        >
            <Stack gap="md">
                {isLoading && <LoaderModalShared mih="180px" />}
                {!isLoading && lists.length === 0 && (
                    <EmptyPageLayout icon={<TbList size={32} />} />
                )}
                {!isLoading && lists.length > 0 && (
                    <Box h={360}>
                        <TreeBrowser
                            emptyLabel={t('common.message.nothing-found')}
                            onSelect={(sharedList) =>
                                showModal('sharedLists_sharedListEditorModal', {
                                    name: sharedList.name
                                })
                            }
                            renderRow={(node, isFolder) =>
                                sharedListRow({
                                    deletingName,
                                    isFolder,
                                    node,
                                    onDelete: handleDelete
                                })
                            }
                            rootLabel={t('common.field.shared-lists')}
                            tree={tree}
                        />
                    </Box>
                )}

                <Group justify="space-between">
                    <ActionIcon.Group>
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
                    </ActionIcon.Group>

                    <Tooltip label={t('common.action.create')}>
                        <ActionIcon
                            color="teal"
                            onClick={() => showModal('sharedLists_sharedListEditorModal', {})}
                            size="input-md"
                            variant="soft"
                        >
                            <TbPlus size={24} />
                        </ActionIcon>
                    </Tooltip>
                </Group>
            </Stack>
        </Modal>
    )
})
