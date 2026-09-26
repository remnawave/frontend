import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { Button, Group, Modal, Stack } from '@mantine/core'
import { useForm, schemaResolver } from '@mantine/form'
import { BulkUpdateUsersCommand } from '@remnawave/backend-contract'
import dayjs from 'dayjs'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { PiFloppyDiskDuotone } from 'react-icons/pi'
import { TbUsers } from 'react-icons/tb'
import { z } from 'zod'

import { useNiceMantineModal } from '@shared/_modals/use-nice-modal'
import { useBulkUpdateUsers, useGetExternalSquads, useGetUserTags } from '@shared/api/hooks'
import { useIsMobile } from '@shared/hooks'
import { BulkManyFormsUsersShared } from '@shared/ui/forms/users/bulk-many-forms-components'
import { ModalFooter } from '@shared/ui/modal-footer'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { handleFormErrors } from '@shared/utils/misc'

import { useUsersTableSelectionStoreActions } from '@entities/dashboard/users/users-table-selection'

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

const originalFieldsSchema = BulkUpdateUsersCommand.RequestBodySchema.shape.fields

const fieldsWithoutExpireAt = originalFieldsSchema.omit({
    expireAt: true,
    email: true,
    telegramId: true
})

const customSchema = z.object({
    fields: fieldsWithoutExpireAt
})

interface IProps {
    usersCount: number
    onClose: () => void
}

export const BulkManyUsersUpdateModal = NiceModal.create((props: IProps) => {
    const { usersCount, onClose } = props
    const { t } = useTranslation()
    const isMobile = useIsMobile()

    const modal = useModal()
    const { modalProps } = useNiceMantineModal({
        modal,
        onClose
    })

    const { data: externalSquads } = useGetExternalSquads()
    const { data: tags } = useGetUserTags()

    const actions = useUsersTableSelectionStoreActions()

    const form = useForm<BulkUpdateUsersCommand.RequestBody>({
        mode: 'uncontrolled',
        name: 'bulk-user-actions-form',
        initialValues: {
            userIds: [],
            fields: {
                status: undefined,
                trafficLimitBytes: undefined,
                trafficLimitStrategy: undefined,
                expireAt: undefined,
                description: undefined,
                telegramId: undefined,
                tag: undefined,
                hwidDeviceLimit: undefined
            }
        },
        validate: schemaResolver(customSchema)
    })

    const { mutate: updateUsers, isPending: isUpdatePending } = useBulkUpdateUsers({
        mutationFns: {
            onSuccess: () => {
                form.reset()
            }
        }
    })

    const handleBulkUpdate = form.onSubmit(async (values) => {
        updateUsers(
            {
                variables: {
                    userIds: actions.getIds(),
                    fields: {
                        ...values.fields,
                        trafficLimitBytes: values.fields.trafficLimitBytes,
                        telegramId:
                            // @ts-expect-error - TODO: fix ZOD schema
                            values.fields.telegramId === '' ? null : values.fields.telegramId,
                        email: values.fields.email === '' ? null : values.fields.email,
                        // @ts-expect-error - TODO: fix ZOD schema
                        expireAt: values.fields.expireAt
                            ? dayjs(values.fields.expireAt).toISOString()
                            : undefined,
                        tag: values.fields.tag === '' ? null : values.fields.tag,

                        hwidDeviceLimit:
                            // @ts-expect-error - TODO: fix ZOD schema
                            values.fields.hwidDeviceLimit === ''
                                ? null
                                : values.fields.hwidDeviceLimit,
                        externalSquadUuid: values.fields.externalSquadUuid
                    }
                }
            },
            {
                onError: (error) => {
                    handleFormErrors(form, error)
                }
            }
        )
    })

    return (
        <Modal
            {...modalProps}
            size="1000px"
            title={
                <BaseOverlayHeader
                    iconColor="cyan"
                    IconComponent={TbUsers}
                    iconVariant="soft"
                    title={t('bulk-all-user-actions-tabs.update.tab.feature.update-users')}
                    titleOrder={5}
                    subtitle={t('bulk-user-actions.actions.tab.feature.perform-action-on-users', {
                        usersCount
                    })}
                />
            }
        >
            <motion.div
                animate={{ opacity: 1 }}
                initial={{ opacity: 0 }}
                transition={{
                    duration: 0.4,
                    ease: 'easeInOut'
                }}
            >
                {isMobile && (
                    <MotionStack
                        animate="visible"
                        gap="md"
                        initial="hidden"
                        variants={containerVariants}
                    >
                        <BulkManyFormsUsersShared.TrafficLimitsCard
                            cardVariants={cardVariants}
                            form={form}
                            motionWrapper={MotionWrapper}
                        />
                        <BulkManyFormsUsersShared.AccessSettingsCard
                            cardVariants={cardVariants}
                            externalSquads={externalSquads}
                            form={form}
                            motionWrapper={MotionWrapper}
                        />
                        <BulkManyFormsUsersShared.ContactInformationCard
                            cardVariants={cardVariants}
                            form={form}
                            motionWrapper={MotionWrapper}
                        />
                        <BulkManyFormsUsersShared.DeviceTagSettingsCard
                            cardVariants={cardVariants}
                            form={form}
                            motionWrapper={MotionWrapper}
                            tags={tags}
                        />
                    </MotionStack>
                )}

                {!isMobile && (
                    <Group align="flex-start" gap="md" grow={false} wrap="wrap">
                        <MotionStack
                            animate="visible"
                            gap="md"
                            initial="hidden"
                            style={{ flex: '1 1 450px' }}
                            variants={containerVariants}
                        >
                            <BulkManyFormsUsersShared.ContactInformationCard
                                cardVariants={cardVariants}
                                form={form}
                                motionWrapper={MotionWrapper}
                            />
                            <BulkManyFormsUsersShared.DeviceTagSettingsCard
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
                            <BulkManyFormsUsersShared.TrafficLimitsCard
                                cardVariants={cardVariants}
                                form={form}
                                motionWrapper={MotionWrapper}
                            />
                            <BulkManyFormsUsersShared.AccessSettingsCard
                                cardVariants={cardVariants}
                                externalSquads={externalSquads}
                                form={form}
                                motionWrapper={MotionWrapper}
                            />
                        </MotionStack>
                    </Group>
                )}

                <ModalFooter isMobile={isMobile}>
                    <Button
                        color="cyan"
                        leftSection={<PiFloppyDiskDuotone size="16px" />}
                        loading={isUpdatePending}
                        onClick={() => {
                            handleBulkUpdate()
                        }}
                        size="md"
                        variant="light"
                    >
                        {t('common.action.update')}
                    </Button>
                </ModalFooter>
            </motion.div>
        </Modal>
    )
})
