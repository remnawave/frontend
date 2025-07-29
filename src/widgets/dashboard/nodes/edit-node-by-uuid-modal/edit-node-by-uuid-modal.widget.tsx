import { Button, em, Group, Modal, Stack, Text } from '@mantine/core'
import { UpdateNodeCommand } from '@remnawave/backend-contract'
import { zodResolver } from 'mantine-form-zod-resolver'
import { PiEmpty, PiXBold } from 'react-icons/pi'
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
import { BaseNodeForm } from '@shared/ui/forms/nodes/base-node-form/base-node-form'
import { MODALS, useModalsStore } from '@entities/dashboard/modal-store'
import { bytesToGbUtil, gbToBytesUtil } from '@shared/utils/bytes'
import { LoaderModalShared } from '@shared/ui/loader-modal'
import { ModalFooter } from '@shared/ui/modal-footer'
import { queryClient } from '@shared/api'

import { NodeDetailsCardWidget } from '../node-details-card/node-details-card.widget'

export const EditNodeByUuidModalWidget = () => {
    const { t } = useTranslation()

    const { isOpen, internalState: nodeUuid } = useModalsStore(
        (state) => state.modals[MODALS.EDIT_NODE_BY_UUID_MODAL]
    )

    const { close } = useModalsStore()

    const isMobile = useMediaQuery(`(max-width: ${em(768)})`)

    const [advancedOpened, setAdvancedOpened] = useState(false)

    const form = useForm<UpdateNodeCommand.Request>({
        name: 'edit-node-form',
        mode: 'uncontrolled',
        validate: zodResolver(UpdateNodeCommand.RequestSchema.omit({ uuid: true }))
    })

    const { data: pubKey } = useGetPubKey()

    const { data: fetchedNode, isLoading } = useGetNode({
        route: {
            uuid: nodeUuid?.nodeUuid ?? ''
        },
        rQueryParams: {
            enabled: isOpen
        }
    })

    const handleClose = (closeModal: boolean = false) => {
        if (closeModal) {
            close(MODALS.EDIT_NODE_BY_UUID_MODAL)
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
        <Modal
            centered
            fullScreen={isMobile}
            onClose={() => close(MODALS.EDIT_NODE_BY_UUID_MODAL)}
            onExitTransitionEnd={() => handleClose}
            opened={isOpen}
            size="900px"
            title={
                <Group gap="xl" justify="space-between">
                    <Text fw={500}>{t('edit-node-modal.widget.edit-node')}</Text>
                </Group>
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
                            {t('edit-node-by-uuid-modal.widget.close')}
                        </Button>
                    </ModalFooter>
                </>
            )}

            {fetchedNode && (
                <BaseNodeForm
                    advancedOpened={advancedOpened}
                    fetchedNode={fetchedNode}
                    form={form}
                    handleClose={() => handleClose(true)}
                    handleSubmit={handleSubmit}
                    isUpdateNodePending={isUpdateNodePending}
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
        </Modal>
    )
}
