import { Button, CopyButton, em, Menu, px } from '@mantine/core'
import { UpdateNodeCommand } from '@remnawave/backend-contract'
import { zodResolver } from 'mantine-form-zod-resolver'
import { TbCopy, TbCpu, TbDots } from 'react-icons/tb'
import { PiFloppyDiskDuotone } from 'react-icons/pi'
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
import {
    useNodesStoreActions,
    useNodesStoreEditModalIsOpen,
    useNodesStoreEditModalNode
} from '@entities/dashboard/nodes'
import { ToggleNodeStatusButtonFeature } from '@features/ui/dashboard/nodes/toggle-node-status-button'
import { GetNodeLinkedHostsFeature } from '@features/ui/dashboard/nodes/get-node-linked-hosts'
import { GetNodeUsersUsageFeature } from '@features/ui/dashboard/nodes/get-node-users-usage'
import { RestartNodeButtonFeature } from '@features/ui/dashboard/nodes/restart-node-button'
import { ResetNodeTrafficFeature } from '@features/ui/dashboard/nodes/reset-node-traffic'
import { BaseNodeForm } from '@shared/ui/forms/nodes/base-node-form/base-node-form'
import { DeleteNodeFeature } from '@features/ui/dashboard/nodes/delete-node'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { bytesToGbUtil, gbToBytesUtil } from '@shared/utils/bytes'
import { FramedModal } from '@shared/ui/framed-modal'
import { queryClient } from '@shared/api'

import { NodeDetailsCardWidget } from '../node-details-card/node-details-card.widget'

export const EditNodeModalConnectorWidget = () => {
    const { t } = useTranslation()

    const isModalOpen = useNodesStoreEditModalIsOpen()
    const actions = useNodesStoreActions()
    const node = useNodesStoreEditModalNode()

    const isMobile = useMediaQuery(`(max-width: ${em(768)})`)

    const [advancedOpened, setAdvancedOpened] = useState(false)

    const form = useForm<UpdateNodeCommand.Request>({
        name: 'edit-node-form',
        mode: 'uncontrolled',
        validate: zodResolver(UpdateNodeCommand.RequestSchema.omit({ uuid: true }))
    })

    const { data: pubKey } = useGetPubKey()

    const isQueryEnabled = !!node?.uuid && !form.isTouched()

    const { data: fetchedNode } = useGetNode({
        route: {
            uuid: node?.uuid ?? ''
        },
        rQueryParams: {
            enabled: isQueryEnabled
        }
    })

    const handleClose = (closeModal: boolean = false) => {
        if (closeModal) {
            actions.toggleEditModal(false)
        }

        queryClient.removeQueries({
            queryKey: nodesQueryKeys.getNode({ uuid: node?.uuid ?? '' }).queryKey
        })

        setTimeout(() => {
            actions.clearEditModal()
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
                handleClose(true)
            }
        }
    })

    useEffect(() => {
        if (node) {
            setAdvancedOpened(node.isTrafficTrackingActive ?? false)
            form.setValues({
                countryCode: node.countryCode,
                name: node.name,
                address: node.address,
                port: node.port ?? undefined,
                isTrafficTrackingActive: node.isTrafficTrackingActive ?? undefined,
                trafficLimitBytes: bytesToGbUtil(node.trafficLimitBytes ?? undefined),
                trafficResetDay: node.trafficResetDay ?? undefined,
                notifyPercent: node.notifyPercent ?? undefined,
                consumptionMultiplier: node.consumptionMultiplier ?? undefined,

                configProfile: {
                    activeConfigProfileUuid: node.configProfile.activeConfigProfileUuid ?? '',
                    activeInbounds:
                        node.configProfile.activeInbounds.map((inbound) => inbound.uuid) ?? []
                },

                providerUuid: node.providerUuid ?? undefined,
                tags: node.tags ?? []
            })
        }
    }, [node])

    const handleSubmit = form.onSubmit(async (values) => {
        if (!node) {
            return
        }

        updateNode({
            variables: {
                ...values,
                uuid: node.uuid,
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
            onClose={() => actions.toggleEditModal(false)}
            onExitTransitionEnd={() => handleClose}
            opened={isModalOpen}
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
            <BaseNodeForm
                advancedOpened={advancedOpened}
                fetchedNode={fetchedNode}
                form={form}
                node={node}
                nodeDetailsCard={
                    node && <NodeDetailsCardWidget fetchedNode={fetchedNode} node={node} />
                }
                pubKey={pubKey}
                setAdvancedOpened={setAdvancedOpened}
            />
        </FramedModal>
    )
}
