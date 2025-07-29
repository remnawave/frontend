import { UpdateNodeCommand } from '@remnawave/backend-contract'
import { zodResolver } from 'mantine-form-zod-resolver'
import { em, Group, Modal, Text } from '@mantine/core'
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
import { BaseNodeForm } from '@shared/ui/forms/nodes/base-node-form/base-node-form'
import { bytesToGbUtil, gbToBytesUtil } from '@shared/utils/bytes'
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

                providerUuid: node.providerUuid ?? undefined
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
        <Modal
            centered
            fullScreen={isMobile}
            onClose={() => actions.toggleEditModal(false)}
            onExitTransitionEnd={() => handleClose}
            opened={isModalOpen}
            size="900px"
            title={
                <Group gap="xl" justify="space-between">
                    <Text fw={500}>{t('edit-node-modal.widget.edit-node')}</Text>
                </Group>
            }
            transitionProps={isMobile ? { transition: 'fade', duration: 200 } : undefined}
        >
            <BaseNodeForm
                advancedOpened={advancedOpened}
                fetchedNode={fetchedNode}
                form={form}
                handleClose={() => handleClose(true)}
                handleSubmit={handleSubmit}
                isUpdateNodePending={isUpdateNodePending}
                node={node}
                nodeDetailsCard={
                    node && <NodeDetailsCardWidget fetchedNode={fetchedNode} node={node} />
                }
                pubKey={pubKey}
                setAdvancedOpened={setAdvancedOpened}
            />
        </Modal>
    )
}
