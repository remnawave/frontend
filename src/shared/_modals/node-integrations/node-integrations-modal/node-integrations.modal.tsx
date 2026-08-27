import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { ActionIcon, Box, Group, Modal, Stack, Tooltip } from '@mantine/core'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { TbPlugConnected, TbPlus, TbRefresh } from 'react-icons/tb'

import { showModal } from '@shared/_modals/show-modal'
import { useNiceMantineModal } from '@shared/_modals/use-nice-modal'
import { useGetNodeIntegrations } from '@shared/api/hooks'
import { EmptyPageLayout } from '@shared/ui/layouts/empty-page'
import { LoaderModalShared } from '@shared/ui/loader-modal'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { buildTree, TreeBrowser } from '@shared/ui/tree-browser'

import { nodeIntegrationRow, TNodeIntegration } from './node-integration-row'
import { useNodeIntegrationActions } from './use-node-integration-actions'

const getName = (integration: TNodeIntegration) => integration.name

export const NodeIntegrationsModal = NiceModal.create(() => {
    const modal = useModal()
    const { modalProps } = useNiceMantineModal({ modal })

    const { t } = useTranslation()

    const { data: nodeIntegrations, isLoading, isRefetching, refetch } = useGetNodeIntegrations()

    const integrations = nodeIntegrations?.nodeIntegrations ?? []

    const tree = useMemo(() => buildTree(integrations, getName), [nodeIntegrations])

    const { deletingUuid, handleDelete } = useNodeIntegrationActions()

    return (
        <Modal
            {...modalProps}
            size="min(700px, 90vw)"
            title={
                <BaseOverlayHeader
                    iconColor="pink"
                    IconComponent={TbPlugConnected}
                    iconVariant="soft"
                    title={t('node-integrations.modal.title')}
                />
            }
        >
            <Stack gap="md">
                {isLoading && <LoaderModalShared />}
                {!isLoading && integrations.length === 0 && (
                    <EmptyPageLayout icon={<TbPlugConnected size={32} />} />
                )}
                {!isLoading && integrations.length > 0 && (
                    <Box h={360}>
                        <TreeBrowser
                            emptyLabel={t('common.message.nothing-found')}
                            onSelect={(integration) =>
                                showModal('nodeIntegrations_nodeIntegrationEditorModal', {
                                    integrationUuid: integration.uuid
                                })
                            }
                            renderRow={(node) =>
                                nodeIntegrationRow({ deletingUuid, node, onDelete: handleDelete })
                            }
                            rootLabel={t('node-integrations.modal.title')}
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
                            onClick={() =>
                                showModal('nodeIntegrations_nodeIntegrationEditorModal', {})
                            }
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
