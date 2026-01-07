import { CreateUserCommand, USERS_STATUS } from '@remnawave/backend-contract'
import { Button, em, Group, Stack } from '@mantine/core'
import { zodResolver } from 'mantine-form-zod-resolver'
import { PiFloppyDiskDuotone } from 'react-icons/pi'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from '@mantine/hooks'
import { useForm } from '@mantine/form'
import { TbUser } from 'react-icons/tb'
import { motion } from 'motion/react'
import { useEffect } from 'react'
import dayjs from 'dayjs'

import {
    AccessSettingsCard,
    ContactInformationCard,
    DeviceTagSettingsCard,
    TrafficLimitsCard,
    UserIdentityCreationCard
} from '@shared/ui/forms/users/forms-components'
import {
    useUserCreationModalStoreActions,
    useUserCreationModalStoreIsModalOpen
} from '@entities/dashboard/user-creation-modal-store/user-creation-modal-store'
import {
    useCreateUser,
    useGetExternalSquads,
    useGetInternalSquads,
    useGetUserTags
} from '@shared/api/hooks'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { LoaderModalShared } from '@shared/ui/loader-modal'
import { handleFormErrors } from '@shared/utils/misc'
import { gbToBytesUtil } from '@shared/utils/bytes'
import { Modal } from '@mantine/core'
import { ModalFooter } from '@shared/ui/modal-footer'

const MotionWrapper = motion.div
const MotionStack = motion.create(Stack)

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
    const { data: externalSquads } = useGetExternalSquads()
    const { data: tags, isLoading: isTagsLoading } = useGetUserTags()
    const isMobile = useMediaQuery(`(max-width: ${em(768)})`)

    const { mutate: createUser, isPending: isDataSubmitting } = useCreateUser({
        mutationFns: {
            onSuccess: () => {
                handleCloseModal()
            }
        }
    })

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
                    activeInternalSquads: values.activeInternalSquads,
                    externalSquadUuid: values.externalSquadUuid
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
            fullScreen={isMobile}
            onClose={handleCloseModal}
            onExitTransitionEnd={handleResetForm}
            opened={isModalOpen}
            size="1000px"
            title={
                <BaseOverlayHeader
                    IconComponent={TbUser}
                    iconVariant="gradient-teal"
                    title={t('create-user-modal.widget.create-user')}
                />
            }
            transitionProps={isMobile ? { transition: 'fade', duration: 200 } : undefined}
        >
            {(isInternalSquadsLoading || isTagsLoading) && (
                <motion.div
                    animate={{ opacity: 1 }}
                    initial={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <LoaderModalShared h="78vh" />
                </motion.div>
            )}

            {!isInternalSquadsLoading && !isTagsLoading && isMobile && (
                <MotionStack
                    animate="visible"
                    gap="md"
                    initial="hidden"
                    variants={containerVariants}
                >
                    <UserIdentityCreationCard
                        cardVariants={cardVariants}
                        form={form}
                        motionWrapper={MotionWrapper}
                    />
                    <TrafficLimitsCard
                        cardVariants={cardVariants}
                        form={form}
                        motionWrapper={MotionWrapper}
                    />
                    <AccessSettingsCard
                        cardVariants={cardVariants}
                        externalSquads={externalSquads}
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
            )}

            {!isInternalSquadsLoading && !isTagsLoading && !isMobile && (
                <Group align="flex-start" gap="md" wrap="wrap">
                    <MotionStack
                        animate="visible"
                        gap="md"
                        initial="hidden"
                        style={{ flex: '1 1 450px' }}
                        variants={containerVariants}
                    >
                        <UserIdentityCreationCard
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
                        gap="md"
                        initial="hidden"
                        style={{ flex: '1 1 450px' }}
                        variants={containerVariants}
                    >
                        <TrafficLimitsCard
                            cardVariants={cardVariants}
                            form={form}
                            motionWrapper={MotionWrapper}
                        />
                        <AccessSettingsCard
                            cardVariants={cardVariants}
                            externalSquads={externalSquads}
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
                    leftSection={<PiFloppyDiskDuotone size="16px" />}
                    loading={isDataSubmitting}
                    onClick={() => {
                        handleSubmit()
                    }}
                    size="md"
                    variant="light"
                >
                    {t('common.create')}
                </Button>
            </ModalFooter>
        </Modal>
    )
}
