import { useForm, schemaResolver } from '@mantine/form'
import { UpdateNodeCommand } from '@remnawave/backend-contract'
import { NodeDetailsCardWidget } from '@widgets/dashboard/nodes/node-details-card'
import { NodeSystemCardWidget } from '@widgets/dashboard/nodes/node-system-card'
import { motion } from 'motion/react'
import { useEffect, useRef } from 'react'

import { queryClient } from '@shared/api'
import {
    configProfilesQueryKeys,
    nodesQueryKeys,
    useGetNode,
    useGetNodeIntegrations,
    useGetNodePlugins,
    useGetNodeSecretKey,
    useUpdateNode
} from '@shared/api/hooks'
import { BaseNodeForm } from '@shared/ui/forms/nodes/base-node-form/base-node-form'
import { LoaderModalShared } from '@shared/ui/loader-modal'
import { withNodeIpsErrors } from '@shared/ui/node-ips'

interface IProps {
    nodeUuid: string
    onClose: () => void
}

export const EditNodeByUuidModalContent = (props: IProps) => {
    const { nodeUuid, onClose } = props

    const isFormInitialized = useRef(false)

    const form = useForm<UpdateNodeCommand.RequestBody>({
        name: 'edit-node-form',
        mode: 'uncontrolled',
        onValuesChange: (values) => {
            if (typeof values.proxyUrl === 'string' && values.proxyUrl === '') {
                form.setFieldValue('proxyUrl', null)
            }
        },
        validate: withNodeIpsErrors(
            schemaResolver(UpdateNodeCommand.RequestBodySchema.omit({ uuid: true }))
        )
    })

    const { data: secretKey } = useGetNodeSecretKey()
    const { data: nodePlugins } = useGetNodePlugins()
    const { data: nodeIntegrations } = useGetNodeIntegrations()

    const { data: fetchedNode } = useGetNode({
        route: {
            uuid: nodeUuid
        },
        rQueryParams: {
            enabled: !form.isTouched()
        }
    })

    const { mutate: updateNode, isPending: isUpdateNodePending } = useUpdateNode({
        mutationFns: {
            onSuccess: async (data) => {
                queryClient.setQueryData(
                    nodesQueryKeys.getNode({
                        uuid: nodeUuid
                    }).queryKey,
                    data
                )

                queryClient.refetchQueries({
                    queryKey: nodesQueryKeys.getAllNodes.queryKey
                })
                queryClient.refetchQueries({
                    queryKey: configProfilesQueryKeys.getConfigProfiles.queryKey
                })

                form.resetDirty()
            }
        }
    })

    useEffect(() => {
        if (fetchedNode && !isFormInitialized.current) {
            isFormInitialized.current = true
            form.initialize({
                uuid: fetchedNode.uuid,
                countryCode: fetchedNode.countryCode,
                name: fetchedNode.name,
                address: fetchedNode.address,
                port: fetchedNode.port ?? undefined,
                isTrafficTrackingActive: fetchedNode.isTrafficTrackingActive ?? undefined,
                trafficLimitBytes: fetchedNode.trafficLimitBytes ?? undefined,
                trafficResetDay: fetchedNode.trafficResetDay ?? undefined,
                notifyPercent: fetchedNode.notifyPercent ?? undefined,
                consumptionMultiplier: fetchedNode.consumptionMultiplier ?? undefined,
                nodeConsumptionMultiplier: fetchedNode.nodeConsumptionMultiplier ?? undefined,
                tags: fetchedNode.tags ?? undefined,
                integrationUuids: fetchedNode.integrationUuids ?? [],
                ips: fetchedNode.ips ?? [],
                proxyUrl: fetchedNode.proxyUrl ?? undefined,
                configProfile: {
                    activeConfigProfileUuid:
                        fetchedNode.configProfile.activeConfigProfileUuid ?? '',
                    activeInbounds:
                        fetchedNode.configProfile.activeInbounds.map((inbound) => inbound.uuid) ??
                        []
                },

                providerUuid: fetchedNode.providerUuid ?? undefined,
                activePluginUuid: fetchedNode.activePluginUuid ?? undefined,
                note: fetchedNode.note ?? undefined
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
                name: values.name?.trim(),
                address: values.address?.trim(),
                trafficLimitBytes: values.trafficLimitBytes,
                configProfile: {
                    activeConfigProfileUuid: values.configProfile?.activeConfigProfileUuid ?? '',
                    activeInbounds: values.configProfile?.activeInbounds ?? []
                }
            }
        })
    })

    if (!fetchedNode || !secretKey || !nodePlugins || !nodeIntegrations) {
        return (
            <motion.div
                animate={{ opacity: 1 }}
                initial={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
            >
                <LoaderModalShared h="78vh" />
            </motion.div>
        )
    }

    return (
        <BaseNodeForm
            form={form}
            handleClose={onClose}
            handleSubmit={handleSubmit}
            isDataSubmitting={isUpdateNodePending}
            node={fetchedNode}
            nodeDetailsCard={<NodeDetailsCardWidget node={fetchedNode} />}
            nodeIntegrations={nodeIntegrations.nodeIntegrations}
            nodePlugins={nodePlugins.nodePlugins}
            nodeSystemCard={<NodeSystemCardWidget node={fetchedNode} />}
            secretKey={secretKey}
        />
    )
}
