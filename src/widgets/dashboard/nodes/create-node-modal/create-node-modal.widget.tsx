import { em, Group, Modal, Progress, Stack, Text, Transition } from '@mantine/core'
import { CreateNodeCommand } from '@remnawave/backend-contract'
import { zodResolver } from 'mantine-form-zod-resolver'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from '@mantine/hooks'
import { useEffect, useState } from 'react'
import { useForm } from '@mantine/form'

import { useNodesStoreActions, useNodesStoreCreateModalIsOpen } from '@entities/dashboard/nodes'
import { configProfilesQueryKeys, useCreateNode, useGetPubKey } from '@shared/api/hooks'
import { gbToBytesUtil } from '@shared/utils/bytes'
import { queryClient } from '@shared/api'

import { CreateNodeStep2ConfigProfiles } from './create-node-steps/create-node-step-2-config-profiles'
import { CreateNodeStep1Connection } from './create-node-steps/create-node-step-1-connection'
import { CreateNodeStep3Status } from './create-node-steps/create-node-step-3-status'

export const CreateNodeModalWidget = () => {
    const { t } = useTranslation()

    const isModalOpen = useNodesStoreCreateModalIsOpen()
    const actions = useNodesStoreActions()

    const { data: pubKey } = useGetPubKey()

    const isMobile = useMediaQuery(`(max-width: ${em(768)})`)

    const [activeStep, setActiveStep] = useState(0)
    const [createdNodeUuid, setCreatedNodeUuid] = useState<string>()
    const [selectedPort, setSelectedPort] = useState<number>(2222)

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
            setActiveStep(0)
            setCreatedNodeUuid(undefined)
        }, 300)
    }

    const { mutate: createNode, isPending: isCreateNodePending } = useCreateNode({
        mutationFns: {
            onSuccess: (data) => {
                queryClient.refetchQueries({
                    queryKey: configProfilesQueryKeys.getConfigProfiles.queryKey
                })

                setCreatedNodeUuid(data.uuid)
                setActiveStep(2) // Move to status step
            }
        }
    })

    const handleCreateNode = () => {
        const values = form.getValues()
        createNode({
            variables: {
                ...values,
                name: values.name.trim(),
                address: values.address.trim(),
                trafficLimitBytes: gbToBytesUtil(values.trafficLimitBytes)
            }
        })
    }

    const nextStep = () => setActiveStep((current) => (current < 2 ? current + 1 : current))
    const prevStep = () => setActiveStep((current) => (current > 0 ? current - 1 : current))

    useEffect(() => {
        if (form.getValues().port) {
            return
        }

        form.setValues({
            port: 2222
        })
    }, [form])

    form.watch('port', ({ value }) => {
        if (value) {
            setSelectedPort(value)
        }
    })

    return (
        <Modal
            centered
            fullScreen={isMobile}
            onClose={handleClose}
            opened={isModalOpen}
            size="md"
            title={<Text fw={500}>{t('create-node-modal.widget.create-node')}</Text>}
            transitionProps={isMobile ? { transition: 'fade', duration: 200 } : undefined}
        >
            <Stack gap="xl">
                <Group gap="xs" grow>
                    <Progress
                        animated
                        color="teal"
                        radius="sm"
                        size="md"
                        striped
                        transitionDuration={300}
                        value={activeStep >= 0 ? 100 : 0}
                    />
                    <Progress
                        animated
                        color="teal"
                        radius="sm"
                        size="md"
                        striped
                        transitionDuration={300}
                        value={activeStep >= 1 ? 100 : 0}
                    />
                    <Progress
                        animated
                        color="teal"
                        radius="sm"
                        size="md"
                        striped
                        transitionDuration={300}
                        value={activeStep >= 2 ? 100 : 0}
                    />
                </Group>

                <Transition
                    duration={300}
                    exitDuration={0}
                    mounted={activeStep === 0}
                    timingFunction="ease"
                    transition="fade"
                >
                    {(styles) => (
                        <div style={styles}>
                            <CreateNodeStep1Connection
                                form={form}
                                onNext={nextStep}
                                port={selectedPort}
                                pubKey={pubKey?.pubKey}
                            />
                        </div>
                    )}
                </Transition>

                <Transition
                    duration={300}
                    exitDuration={0}
                    mounted={activeStep === 1}
                    timingFunction="ease"
                    transition="fade"
                >
                    {(styles) => (
                        <div style={styles}>
                            <CreateNodeStep2ConfigProfiles
                                form={form}
                                isCreating={isCreateNodePending}
                                onCreateNode={handleCreateNode}
                                onPrev={prevStep}
                                port={selectedPort}
                            />
                        </div>
                    )}
                </Transition>

                <Transition
                    duration={300}
                    exitDuration={0}
                    mounted={activeStep === 2}
                    timingFunction="ease"
                    transition="fade"
                >
                    {(styles) => (
                        <div style={styles}>
                            <CreateNodeStep3Status
                                nodeUuid={createdNodeUuid}
                                onClose={handleClose}
                            />
                        </div>
                    )}
                </Transition>
            </Stack>
        </Modal>
    )
}
