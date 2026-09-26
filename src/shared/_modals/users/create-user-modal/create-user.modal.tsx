import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { Button, Group, Modal, Stack } from '@mantine/core'
import { useForm, schemaResolver } from '@mantine/form'
import { CreateUserCommand, USERS_STATUS } from '@remnawave/backend-contract'
import dayjs from 'dayjs'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { PiFloppyDiskDuotone } from 'react-icons/pi'
import { TbUser } from 'react-icons/tb'

import { useNiceMantineModal } from '@shared/_modals/use-nice-modal'
import { queryClient } from '@shared/api'
import {
    QueryKeys,
    useCreateUser,
    useGetExternalSquads,
    useGetInternalSquads,
    useGetUserTags
} from '@shared/api/hooks'
import { useIsMobile } from '@shared/hooks'
import {
    AccessSettingsCard,
    ContactInformationCard,
    DeviceTagSettingsCard,
    TrafficLimitsCard,
    UserIdentityCreationCard
} from '@shared/ui/forms/users/forms-components'
import { LoaderModalShared } from '@shared/ui/loader-modal'
import { ModalFooter } from '@shared/ui/modal-footer'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { handleFormErrors } from '@shared/utils/misc'

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

export const CreateUserModal = NiceModal.create(() => {
    const { t } = useTranslation()

    const modal = useModal()
    const { modalProps, hide } = useNiceMantineModal({
        modal,
        onClose: () => {
            queryClient.refetchQueries({
                queryKey: QueryKeys.users.getAllUsers._def
            })
            queryClient.refetchQueries({
                queryKey: QueryKeys.users.getUserTags.queryKey
            })
            queryClient.refetchQueries({
                queryKey: QueryKeys.system.getSystemStats.queryKey
            })
        }
    })

    const { data: internalSquads, isLoading: isInternalSquadsLoading } = useGetInternalSquads()
    const { data: externalSquads } = useGetExternalSquads()
    const { data: tags, isLoading: isTagsLoading } = useGetUserTags()
    const isMobile = useIsMobile()

    const { mutate: createUser, isPending: isDataSubmitting } = useCreateUser({
        mutationFns: {
            onSuccess: hide
        }
    })

    const form = useForm<CreateUserCommand.RequestBody>({
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
        validate: schemaResolver(
            CreateUserCommand.RequestBodySchema.omit({
                expireAt: true,
                hwidDeviceLimit: true
            })
        ),

        initialValues: {
            status: USERS_STATUS.ACTIVE,
            username: '',
            trafficLimitStrategy: 'NO_RESET',
            expireAt: dayjs().add(1, 'day').toDate(),
            trafficLimitBytes: 0,
            description: '',
            telegramId: undefined,
            email: undefined,
            hwidDeviceLimit: undefined,
            tag: undefined,
            activeInternalSquads: []
        }
    })

    const handleSubmit = form.onSubmit(async (values) => {
        createUser(
            {
                variables: {
                    username: values.username,
                    trafficLimitStrategy: values.trafficLimitStrategy,
                    trafficLimitBytes: values.trafficLimitBytes,
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
            {...modalProps}
            size="1000px"
            title={
                <BaseOverlayHeader
                    iconColor="teal"
                    IconComponent={TbUser}
                    iconVariant="soft"
                    title={t('create-user-modal.widget.create-user')}
                />
            }
        >
            {(isInternalSquadsLoading || isTagsLoading) && (
                <motion.div
                    animate={{ opacity: 1 }}
                    initial={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <LoaderModalShared mih="70vh" />
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

            <ModalFooter isMobile={isMobile}>
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
                    {t('common.action.create')}
                </Button>
            </ModalFooter>
        </Modal>
    )
})
