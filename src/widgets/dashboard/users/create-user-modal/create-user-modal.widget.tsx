import { CreateUserCommand, USERS_STATUS } from '@remnawave/backend-contract'
import { Button, em, Group, Modal, Stack } from '@mantine/core'
import { PiFloppyDiskDuotone, PiXBold } from 'react-icons/pi'
import { zodResolver } from 'mantine-form-zod-resolver'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from '@mantine/hooks'
import { useForm } from '@mantine/form'
import { motion } from 'motion/react'
import { useEffect } from 'react'
import dayjs from 'dayjs'

import {
    AccessSettingsCard,
    ContactInformationCard,
    DeviceTagSettingsCard,
    TrafficLimitsCard,
    UserIndentityCreationCard
} from '@shared/ui/forms/users/forms-components'
import {
    useUserCreationModalStoreActions,
    useUserCreationModalStoreIsModalOpen
} from '@entities/dashboard/user-creation-modal-store/user-creation-modal-store'
import { useCreateUser, useGetInternalSquads, useGetUserTags } from '@shared/api/hooks'
import { LoaderModalShared } from '@shared/ui/loader-modal'
import { handleFormErrors } from '@shared/utils/misc'
import { ModalFooter } from '@shared/ui/modal-footer'
import { gbToBytesUtil } from '@shared/utils/bytes'

const MotionWrapper = motion.div
const MotionStack = motion(Stack)

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.1
        }
    }
}

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3 }
    }
}

export const CreateUserModalWidget = () => {
    const { t } = useTranslation()

    const isModalOpen = useUserCreationModalStoreIsModalOpen()
    const actions = useUserCreationModalStoreActions()

    const { data: internalSquads, isLoading: isInternalSquadsLoading } = useGetInternalSquads()

    const { data: tags, isLoading: isTagsLoading } = useGetUserTags()
    const isMobile = useMediaQuery(`(max-width: ${em(768)})`)

    const {
        mutate: createUser,
        isPending: isDataSubmitting,
        isSuccess: isUserCreated
    } = useCreateUser()

    const form = useForm<CreateUserCommand.Request>({
        name: 'create-user-form',
        mode: 'uncontrolled',
        validateInputOnBlur: true,

        onValuesChange: (values) => {
            if (typeof values.telegramId === 'string' && values.telegramId === '') {
                form.setFieldValue('telegramId', null)
            }
            if (typeof values.email === 'string' && values.email === '') {
                form.setFieldValue('email', null)
            }
        },
        validate: zodResolver(
            CreateUserCommand.RequestSchema.omit({
                expireAt: true,
                hwidDeviceLimit: true
            })
        ),

        initialValues: {
            status: USERS_STATUS.ACTIVE,
            username: '',
            trafficLimitStrategy: 'NO_RESET',
            expireAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
            trafficLimitBytes: 0,
            description: '',
            telegramId: undefined,
            email: undefined,
            hwidDeviceLimit: undefined,
            tag: undefined,
            activeInternalSquads: []
        }
    })

    const handleCloseModal = () => {
        actions.changeModalState(false)
    }

    const handleResetForm = () => {
        actions.resetState()
        form.reset()
        form.resetDirty()
        form.resetTouched()
    }

    useEffect(() => {
        if (isUserCreated) {
            handleCloseModal()
        }
    }, [isUserCreated])

    const handleSubmit = form.onSubmit(async (values) => {
        createUser(
            {
                variables: {
                    username: values.username,
                    trafficLimitStrategy: values.trafficLimitStrategy,
                    trafficLimitBytes: gbToBytesUtil(values.trafficLimitBytes),
                    // @ts-expect-error - TODO: fix ZOD schema
                    expireAt: dayjs(values.expireAt).toISOString(),
                    status: values.status,
                    description: values.description,
                    // @ts-expect-error - TODO: fix ZOD schema
                    telegramId: values.telegramId === '' ? undefined : values.telegramId,
                    email: values.email === '' ? undefined : values.email,
                    // @ts-expect-error - TODO: fix ZOD schema
                    hwidDeviceLimit: values.hwidDeviceLimit === '' ? null : values.hwidDeviceLimit,
                    tag: values.tag,
                    activeInternalSquads: values.activeInternalSquads
                }
            },
            {
                onError: (error) => handleFormErrors(form, error)
            }
        )
    })

    return (
        <Modal
            centered
            closeButtonProps={{
                icon: <PiXBold size={26} />
            }}
            fullScreen={isMobile}
            onClose={handleCloseModal}
            onExitTransitionEnd={handleResetForm}
            opened={isModalOpen}
            size="1000px"
            title={t('create-user-modal.widget.create-user')}
            transitionProps={isMobile ? { transition: 'fade', duration: 200 } : undefined}
        >
            {isInternalSquadsLoading || isTagsLoading ? (
                <LoaderModalShared
                    h="500"
                    text={t('create-user-modal.widget.loading-user-creation')}
                />
            ) : (
                <form onSubmit={handleSubmit}>
                    {isMobile ? (
                        <MotionStack
                            animate="visible"
                            gap="lg"
                            initial="hidden"
                            variants={containerVariants}
                        >
                            <UserIndentityCreationCard
                                cardVariants={cardVariants}
                                form={form}
                                motionWrapper={MotionWrapper}
                            />

                            <TrafficLimitsCard
                                cardVariants={cardVariants}
                                form={form}
                                motionWrapper={MotionWrapper}
                                user={undefined}
                            />

                            <AccessSettingsCard
                                cardVariants={cardVariants}
                                form={form}
                                internalSquads={internalSquads}
                                motionWrapper={MotionWrapper}
                            />

                            <ContactInformationCard
                                cardVariants={cardVariants}
                                form={form}
                                motionWrapper={MotionWrapper}
                            />

                            <DeviceTagSettingsCard
                                cardVariants={cardVariants}
                                form={form}
                                motionWrapper={MotionWrapper}
                                tags={tags}
                            />
                        </MotionStack>
                    ) : (
                        <Group align="flex-start" gap="xl" grow={false} wrap="wrap">
                            <MotionStack
                                animate="visible"
                                gap="lg"
                                initial="hidden"
                                style={{ flex: '1 1 450px' }}
                                variants={containerVariants}
                            >
                                <UserIndentityCreationCard
                                    cardVariants={cardVariants}
                                    form={form}
                                    motionWrapper={MotionWrapper}
                                />

                                <ContactInformationCard
                                    cardVariants={cardVariants}
                                    form={form}
                                    motionWrapper={MotionWrapper}
                                />

                                <DeviceTagSettingsCard
                                    cardVariants={cardVariants}
                                    form={form}
                                    motionWrapper={MotionWrapper}
                                    tags={tags}
                                />
                            </MotionStack>

                            <MotionStack
                                animate="visible"
                                gap="lg"
                                initial="hidden"
                                style={{ flex: '1 1 450px' }}
                                variants={containerVariants}
                            >
                                <TrafficLimitsCard
                                    cardVariants={cardVariants}
                                    form={form}
                                    motionWrapper={MotionWrapper}
                                    user={undefined}
                                />

                                <AccessSettingsCard
                                    cardVariants={cardVariants}
                                    form={form}
                                    internalSquads={internalSquads}
                                    motionWrapper={MotionWrapper}
                                />
                            </MotionStack>
                        </Group>
                    )}

                    <ModalFooter>
                        <Button
                            color="teal"
                            leftSection={<PiFloppyDiskDuotone size="1rem" />}
                            loading={isDataSubmitting}
                            size="sm"
                            type="submit"
                            variant="outline"
                        >
                            {t('create-user-modal.widget.create-user')}
                        </Button>
                    </ModalFooter>
                </form>
            )}
        </Modal>
    )
}
