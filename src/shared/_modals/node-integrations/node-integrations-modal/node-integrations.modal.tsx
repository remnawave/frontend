import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { ActionIcon, Box, Group, Modal, ScrollArea, Stack, Tooltip } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { TbPlus, TbPlugConnected, TbRefresh } from 'react-icons/tb'

import { showModal } from '@shared/_modals/show-modal'
import { useNiceMantineModal } from '@shared/_modals/use-nice-modal'
import { useGetNodeIntegrations } from '@shared/api/hooks'
import { EmptyPageLayout } from '@shared/ui/layouts/empty-page'
import { LoaderModalShared } from '@shared/ui/loader-modal'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'

import { NodeIntegrationItem } from './node-integration-item'
import classes from './node-integrations.module.css'

export const NodeIntegrationsModal = NiceModal.create(() => {
    const modal = useModal()
    const { modalProps } = useNiceMantineModal({ modal })

    const { t } = useTranslation()

    const { data: nodeIntegrations, isLoading, isRefetching, refetch } = useGetNodeIntegrations()

    const integrations = nodeIntegrations?.nodeIntegrations ?? []

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
                    <Box className={classes.integrationTable}>
                        <ScrollArea.Autosize mah={360}>
                            <Stack gap={0}>
                                {integrations.map((integration) => (
                                    <NodeIntegrationItem
                                        integration={integration}
                                        key={integration.uuid}
                                    />
                                ))}
                            </Stack>
                        </ScrollArea.Autosize>
                    </Box>
                )}

                <Group justify="space-between">
                    <ActionIcon.Group>
                        <Tooltip label={t('common.refresh')}>
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

                    <Tooltip label={t('common.create')}>
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
