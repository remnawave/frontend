import { ActionIcon, Box, Group, Text, Tooltip } from '@mantine/core'
import { modals } from '@mantine/modals'
import { GetNodeIntegrationsCommand } from '@remnawave/backend-contract'
import { useTranslation } from 'react-i18next'
import { TbTrash } from 'react-icons/tb'

import { showModal } from '@shared/_modals/show-modal'
import { queryClient } from '@shared/api'
import { QueryKeys, useDeleteNodeIntegration } from '@shared/api/hooks'

import classes from './node-integrations.module.css'

interface IProps {
    integration: GetNodeIntegrationsCommand.Response['response']['nodeIntegrations'][number]
}

export const NodeIntegrationItem = (props: IProps) => {
    const { integration } = props
    const { t } = useTranslation()

    const { mutate: deleteNodeIntegration, isPending: isDeleting } = useDeleteNodeIntegration({
        mutationFns: {
            onSuccess: async () => {
                await queryClient.refetchQueries({
                    queryKey: QueryKeys.nodeIntegrations.getNodeIntegrations.queryKey
                })
                await queryClient.refetchQueries({
                    queryKey: QueryKeys.nodes.getAllNodes.queryKey
                })
            }
        }
    })

    const handleDelete = () => {
        modals.openConfirmModal({
            title: t('common.confirm-action'),
            children: t('node-integrations.modal.delete-description'),
            labels: {
                confirm: t('common.delete'),
                cancel: t('common.cancel')
            },
            cancelProps: { variant: 'subtle' },
            confirmProps: { color: 'red', variant: 'soft' },
            centered: true,
            onConfirm: () => deleteNodeIntegration({ route: { uuid: integration.uuid } })
        })
    }

    const openEditor = () =>
        showModal('nodeIntegrations_nodeIntegrationEditorModal', {
            integrationUuid: integration.uuid
        })

    return (
        <Box
            className={classes.integrationRow}
            onClick={openEditor}
            onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    openEditor()
                }
            }}
            role="button"
            tabIndex={0}
        >
            <Group gap="sm" style={{ minWidth: 0 }} wrap="nowrap">
                <Box
                    style={{
                        background: 'var(--mantine-color-pink-5)',
                        borderRadius: '50%',
                        flexShrink: 0,
                        height: 8,
                        width: 8
                    }}
                />
                <Text fw={500} size="sm" truncate="end">
                    {integration.name}
                </Text>
            </Group>

            <Text c="dimmed" ff="monospace" size="xs" truncate="end">
                {integration.description || '—'}
            </Text>

            <Tooltip label={t('common.delete')}>
                <ActionIcon
                    color="red"
                    loading={isDeleting}
                    onClick={(event) => {
                        event.stopPropagation()
                        handleDelete()
                    }}
                    size="md"
                    variant="subtle"
                >
                    <TbTrash size={18} />
                </ActionIcon>
            </Tooltip>
        </Box>
    )
}
