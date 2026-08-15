import NiceModal, { useModal } from '@ebay/nice-modal-react'
import {
    ActionIcon,
    Box,
    Center,
    Group,
    Modal,
    ScrollArea,
    Stack,
    Text,
    ThemeIcon,
    Tooltip
} from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { TbPlus, TbPlugConnected, TbRefresh } from 'react-icons/tb'

import { showModal } from '@shared/_modals/show-modal'
import { useNiceMantineModal } from '@shared/_modals/use-nice-modal'
import { useGetNodeIntegrations } from '@shared/api/hooks'
import { LoaderModalShared } from '@shared/ui/loader-modal'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { SectionCard } from '@shared/ui/section-card'

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
            {isLoading && <LoaderModalShared h="300px" />}

            {!isLoading && (
                <Stack gap="md">
                    {integrations.length === 0 ? (
                        <SectionCard.Root p="xl">
                            <SectionCard.Section>
                                <Center py="xl">
                                    <Stack align="center" gap="lg">
                                        <ThemeIcon
                                            color="gray"
                                            radius="xl"
                                            size={64}
                                            variant="soft"
                                        >
                                            <TbPlugConnected size={32} />
                                        </ThemeIcon>

                                        <Stack align="center" gap="xs">
                                            <Text c="dimmed" fw={600} size="md" ta="center">
                                                {t('common.nothing-found')}
                                            </Text>
                                        </Stack>
                                    </Stack>
                                </Center>
                            </SectionCard.Section>
                        </SectionCard.Root>
                    ) : (
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
            )}
        </Modal>
    )
})
