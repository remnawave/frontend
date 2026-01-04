import { Button, CopyButton, em, Menu, px, Stack, Text } from '@mantine/core'
import { PiEmpty, PiFloppyDiskDuotone, PiXBold } from 'react-icons/pi'
import { UpdateNodeCommand } from '@remnawave/backend-contract'
import { zodResolver } from 'mantine-form-zod-resolver'
import { TbCopy, TbCpu, TbDots } from 'react-icons/tb'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from '@mantine/hooks'
import { useEffect, useState } from 'react'
import { useForm } from '@mantine/form'

import {
    configProfilesQueryKeys,
    nodesQueryKeys,
    useGetNode,
    useGetPubKey,
    useUpdateNode
} from '@shared/api/hooks'
import { ToggleNodeStatusButtonFeature } from '@features/ui/dashboard/nodes/toggle-node-status-button'
import { GetNodeLinkedHostsFeature } from '@features/ui/dashboard/nodes/get-node-linked-hosts'
import { GetNodeUsersUsageFeature } from '@features/ui/dashboard/nodes/get-node-users-usage'
import { RestartNodeButtonFeature } from '@features/ui/dashboard/nodes/restart-node-button'
import { ResetNodeTrafficFeature } from '@features/ui/dashboard/nodes/reset-node-traffic'
import { MODALS, useModalClose, useModalState } from '@entities/dashboard/modal-store'
import { BaseNodeForm } from '@shared/ui/forms/nodes/base-node-form/base-node-form'
import { DeleteNodeFeature } from '@features/ui/dashboard/nodes/delete-node'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { bytesToGbUtil, gbToBytesUtil } from '@shared/utils/bytes'
import { LoaderModalShared } from '@shared/ui/loader-modal'
import { ModalFooter } from '@shared/ui/modal-footer'
import { FramedModal } from '@shared/ui/framed-modal'
import { queryClient } from '@shared/api'

import { NodeDetailsCardWidget } from '../node-details-card/node-details-card.widget'

export const EditNodeByUuidModalWidget = () => {
    const { t } = useTranslation()

    const { isOpen, internalState: nodeUuid } = useModalState(MODALS.EDIT_NODE_BY_UUID_MODAL)
    const close = useModalClose(MODALS.EDIT_NODE_BY_UUID_MODAL)

    const isMobile = useMediaQuery(`(max-width: ${em(768)})`)

    const [advancedOpened, setAdvancedOpened] = useState(false)

    const form = useForm<UpdateNodeCommand.Request>({
        name: 'edit-node-form',
        mode: 'uncontrolled',
        validate: zodResolver(UpdateNodeCommand.RequestSchema.omit({ uuid: true }))
    })

    const { data: pubKey } = useGetPubKey()

    const isQueryEnabled = isOpen && !form.isTouched()

    const { data: fetchedNode, isLoading } = useGetNode({
        route: {
            uuid: nodeUuid?.nodeUuid ?? ''
        },
        rQueryParams: {
            enabled: isQueryEnabled
        }
    })

    const handleClose = (closeModal: boolean = false) => {
        if (closeModal) {
            close()
        }

        queryClient.removeQueries({
            queryKey: nodesQueryKeys.getNode({ uuid: nodeUuid?.nodeUuid ?? '' }).queryKey
        })

        setTimeout(() => {
            form.reset()
            form.resetDirty()
            form.resetTouched()
            setAdvancedOpened(false)
        }, 300)
    }

    const { mutate: updateNode, isPending: isUpdateNodePending } = useUpdateNode({
        mutationFns: {
            onSuccess: async () => {
                queryClient.refetchQueries({
                    queryKey: configProfilesQueryKeys.getConfigProfiles.queryKey
                })
                queryClient.refetchQueries({
                    queryKey: nodesQueryKeys.getAllNodes.queryKey
                })
                handleClose(true)
            }
        }
    })

    useEffect(() => {
        if (fetchedNode) {
            setAdvancedOpened(fetchedNode.isTrafficTrackingActive ?? false)
            form.setValues({
                countryCode: fetchedNode.countryCode,
                name: fetchedNode.name,
                address: fetchedNode.address,
                port: fetchedNode.port ?? undefined,
                isTrafficTrackingActive: fetchedNode.isTrafficTrackingActive ?? undefined,
                trafficLimitBytes: bytesToGbUtil(fetchedNode.trafficLimitBytes ?? undefined),
                trafficResetDay: fetchedNode.trafficResetDay ?? undefined,
                notifyPercent: fetchedNode.notifyPercent ?? undefined,
                consumptionMultiplier: fetchedNode.consumptionMultiplier ?? undefined,

                configProfile: {
                    activeConfigProfileUuid:
                        fetchedNode.configProfile.activeConfigProfileUuid ?? '',
                    activeInbounds:
                        fetchedNode.configProfile.activeInbounds.map((inbound) => inbound.uuid) ??
                        []
                },

                providerUuid: fetchedNode.providerUuid ?? undefined
            })
        }
    }, [fetchedNode])

    const handleSubmit = form.onSubmit(async (values) => {
        if (!fetchedNode) {
            return
        }

        updateNode({
            variables: {
                ...values,
                uuid: fetchedNode.uuid,
                name: values.name?.trim(),
                address: values.address?.trim(),
                trafficLimitBytes: gbToBytesUtil(values.trafficLimitBytes),
                configProfile: {
                    activeConfigProfileUuid: values.configProfile?.activeConfigProfileUuid ?? '',
                    activeInbounds: values.configProfile?.activeInbounds ?? []
                }
            }
        })
    })

    return (
        <FramedModal
            centered
            closeOnEscape={false}
            footer={
                <>
                    {fetchedNode && (
                        <Menu keepMounted={true} position="top-end" shadow="md">
                            <Menu.Target>
                                <Button
                                    color="gray"
                                    leftSection={<TbDots size={px('1.2rem')} />}
                                    size="md"
                                >
                                    {t('base-node-form.more-actions')}
                                </Button>
                            </Menu.Target>

                            <Menu.Dropdown>
                                <DeleteNodeFeature handleClose={handleClose} node={fetchedNode} />
                                <Menu.Divider />

                                <Menu.Label>{t('base-node-form.management')}</Menu.Label>
                                <CopyButton value={fetchedNode.uuid}>
                                    {({ copy }) => (
                                        <Menu.Item
                                            leftSection={<TbCopy size="16px" />}
                                            onClick={copy}
                                        >
                                            {t('common.copy-uuid')}
                                        </Menu.Item>
                                    )}
                                </CopyButton>
                                <ResetNodeTrafficFeature
                                    handleClose={handleClose}
                                    node={fetchedNode}
                                />

                                <RestartNodeButtonFeature
                                    handleClose={handleClose}
                                    node={fetchedNode}
                                />
                                <ToggleNodeStatusButtonFeature
                                    handleClose={handleClose}
                                    node={fetchedNode}
                                />
                                <Menu.Divider />
                                <Menu.Label>{t('base-node-form.quick-actions')}</Menu.Label>
                                <GetNodeUsersUsageFeature nodeUuid={fetchedNode.uuid} />
                                <GetNodeLinkedHostsFeature nodeUuid={fetchedNode.uuid} />
                            </Menu.Dropdown>
                        </Menu>
                    )}
                    <Button
                        color="teal"
                        disabled={!form.isDirty() || !form.isTouched()}
                        leftSection={<PiFloppyDiskDuotone size="16px" />}
                        loading={isUpdateNodePending}
                        onClick={() => handleSubmit()}
                        size="md"
                        variant="light"
                    >
                        {t('common.save')}
                    </Button>
                </>
            }
            fullScreen={isMobile}
            onClose={close}
            onExitTransitionEnd={() => handleClose()}
            opened={isOpen}
            size="1000px"
            title={
                <BaseOverlayHeader
                    IconComponent={TbCpu}
                    iconVariant="gradient-teal"
                    title={t('edit-node-modal.widget.edit-node')}
                />
            }
            transitionProps={isMobile ? { transition: 'fade', duration: 200 } : undefined}
        >
            {isLoading && (
                <LoaderModalShared
                    h="80vh"
                    text={t('edit-node-by-uuid-modal.widget.loading-node')}
                />
            )}

            {!isLoading && !fetchedNode && (
                <>
                    <Stack align="center" gap="xl" h="80vh" justify="center">
                        <Stack align="center" c="dimmed" gap="md">
                            <PiEmpty size={48} />
                            <Text>{t('empty-page.layout.nothing-found')}</Text>
                        </Stack>
                    </Stack>
                    <ModalFooter>
                        <Button
                            color="teal"
                            leftSection={<PiXBold size="16px" />}
                            onClick={() => handleClose(true)}
                            size="sm"
                            variant="outline"
                        >
                            {t('common.close')}
                        </Button>
                    </ModalFooter>
                </>
            )}

            {fetchedNode && (
                <BaseNodeForm
                    advancedOpened={advancedOpened}
                    fetchedNode={fetchedNode}
                    form={form}
                    node={fetchedNode}
                    nodeDetailsCard={
                        fetchedNode && (
                            <NodeDetailsCardWidget fetchedNode={fetchedNode} node={fetchedNode} />
                        )
                    }
                    pubKey={pubKey}
                    setAdvancedOpened={setAdvancedOpened}
                />
            )}
        </FramedModal>
    )
}
