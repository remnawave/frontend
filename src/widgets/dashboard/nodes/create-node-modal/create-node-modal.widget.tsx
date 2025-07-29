import { CreateNodeCommand } from '@remnawave/backend-contract'
import { em, Group, Modal, Text } from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from '@mantine/hooks'
import { useState } from 'react'

import { useNodesStoreActions, useNodesStoreCreateModalIsOpen } from '@entities/dashboard/nodes'
import { configProfilesQueryKeys, useCreateNode, useGetPubKey } from '@shared/api/hooks'
import { BaseNodeForm } from '@shared/ui/forms/nodes/base-node-form/base-node-form'
import { gbToBytesUtil } from '@shared/utils/bytes'
import { queryClient } from '@shared/api'

export const CreateNodeModalWidget = () => {
    const { t } = useTranslation()

    const isModalOpen = useNodesStoreCreateModalIsOpen()
    const actions = useNodesStoreActions()

    const { data: pubKey } = useGetPubKey()

    const isMobile = useMediaQuery(`(max-width: ${em(768)})`)

    const [advancedOpened, setAdvancedOpened] = useState(false)

    const form = useForm<CreateNodeCommand.Request>({
        name: 'create-node-form',
        mode: 'uncontrolled',
        validate: zodResolver(CreateNodeCommand.RequestSchema)
    })

    const handleClose = () => {
        actions.toggleCreateModal(false)

        setTimeout(() => {
            form.reset()
            form.resetDirty()
            form.resetTouched()
            setAdvancedOpened(false)
        }, 300)
    }

    const { mutate: createNode, isPending: isCreateNodePending } = useCreateNode({
        mutationFns: {
            onSuccess: () => {
                queryClient.refetchQueries({
                    queryKey: configProfilesQueryKeys.getConfigProfiles.queryKey
                })
                handleClose()
            }
        }
    })

    const handleSubmit = form.onSubmit(async (values) => {
        createNode({
            variables: {
                ...values,
                name: values.name.trim(),
                address: values.address.trim(),
                trafficLimitBytes: gbToBytesUtil(values.trafficLimitBytes)
            }
        })
    })

    return (
        <Modal
            centered
            fullScreen={isMobile}
            onClose={handleClose}
            opened={isModalOpen}
            size="900px"
            title={
                <Group gap="xl" justify="space-between">
                    <Text fw={500}>{t('create-node-modal.widget.create-node')}</Text>
                </Group>
            }
            transitionProps={isMobile ? { transition: 'fade', duration: 200 } : undefined}
        >
            <BaseNodeForm
                advancedOpened={advancedOpened}
                fetchedNode={undefined}
                form={form}
                handleClose={handleClose}
                handleSubmit={handleSubmit}
                isUpdateNodePending={isCreateNodePending}
                node={null}
                pubKey={pubKey}
                setAdvancedOpened={setAdvancedOpened}
            />
        </Modal>
    )
}
