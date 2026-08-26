import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { ActionIcon, Box, Group, Modal, ScrollArea, Stack, Tooltip } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { TbList, TbPlus, TbRefresh } from 'react-icons/tb'

import { showModal } from '@shared/_modals/show-modal'
import { useNiceMantineModal } from '@shared/_modals/use-nice-modal'
import { useGetSharedLists } from '@shared/api/hooks'
import { EmptyPageLayout } from '@shared/ui/layouts/empty-page/empty-page.layout'
import { LoaderModalShared } from '@shared/ui/loader-modal'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'

import { SharedListItem } from './shared-list-item'
import classes from './shared-lists.module.css'

export const SharedListsModal = NiceModal.create(() => {
    const modal = useModal()
    const { modalProps } = useNiceMantineModal({ modal })

    const { t } = useTranslation()

    const { data: sharedLists, isLoading, isRefetching, refetch } = useGetSharedLists()

    const lists = sharedLists?.sharedLists ?? []

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
                    <Box className={classes.sharedListTable}>
                        <ScrollArea.Autosize mah={360}>
                            <Stack gap={0}>
                                {lists.map((sharedList) => (
                                    <SharedListItem key={sharedList.name} sharedList={sharedList} />
                                ))}
                            </Stack>
                        </ScrollArea.Autosize>
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
