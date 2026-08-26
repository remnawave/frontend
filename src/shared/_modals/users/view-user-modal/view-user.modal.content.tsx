import { DeleteUserFeature } from '@features/ui/dashboard/users/delete-user'
import { ResetUsageUserFeature } from '@features/ui/dashboard/users/reset-usage-user'
import { RevokeSubscriptionUserFeature } from '@features/ui/dashboard/users/revoke-subscription-user'
import { ToggleUserStatusButtonFeature } from '@features/ui/dashboard/users/toggle-user-status-button'
import { Button, Group, Menu, px, Stack } from '@mantine/core'
import { useForm, schemaResolver } from '@mantine/form'
import { UpdateUserCommand } from '@remnawave/backend-contract'
import dayjs from 'dayjs'
import { motion } from 'motion/react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { PiFloppyDiskDuotone } from 'react-icons/pi'
import { TbDots } from 'react-icons/tb'
import { z } from 'zod'

import { queryClient } from '@shared/api'
import {
    useGetExternalSquads,
    useGetInternalSquads,
    useGetNodes,
    useGetUserById,
    useGetUserTags,
    usersQueryKeys,
    useUpdateUser
} from '@shared/api/hooks'
import { useIsMobile } from '@shared/hooks'
import {
    AccessSettingsCard,
    ContactInformationCard,
    DeviceTagSettingsCard,
    TrafficLimitsCard,
    UserIdentificationCard
} from '@shared/ui/forms/users/forms-components'
import { LoaderModalShared } from '@shared/ui/loader-modal'
import { ModalFooter } from '@shared/ui/modal-footer'
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

interface IProps {
    userId: number
}

export const ViewUserModalContent = (props: IProps) => {
    const { userId } = props

    const { t } = useTranslation()

    const isMobile = useIsMobile()

    const { data: internalSquads } = useGetInternalSquads()
    const { data: externalSquads } = useGetExternalSquads()
    const { data: nodes } = useGetNodes()
    const { data: tags } = useGetUserTags()

    const form = useForm<UpdateUserCommand.RequestBody>({
        name: 'edit-user-form',
        mode: 'uncontrolled',
        onValuesChange: (values) => {
            if (typeof values.telegramId === 'string' && values.telegramId === '') {
                form.setFieldValue('telegramId', null)
            }
            if (typeof values.email === 'string' && values.email === '') {
                form.setFieldValue('email', null)
            }
        },
        validate: schemaResolver(
            z.object(UpdateUserCommand.RequestBodySchema.shape).omit({
                expireAt: true,
                hwidDeviceLimit: true
            })
        )
    })

    const { data: user } = useGetUserById({
        route: {
            userId: userId
        }
    })

    const { mutate: updateUser, isPending: isUpdateUserPending } = useUpdateUser({
        mutationFns: {
            onSuccess: (data) => {
                queryClient.refetchQueries({
                    queryKey: usersQueryKeys.getUserAccessibleNodes({
                        userId: userId
                    }).queryKey
                })
                queryClient.setQueryData(
                    usersQueryKeys.getUserById({
                        userId: userId
                    }).queryKey,
                    data
                )
                form.resetTouched()
            },

            onError: (error) => {
                handleFormErrors(form, error)
            }
        }
    })

    useEffect(() => {
        if (user && internalSquads) {
            const activeInternalSquads = user.activeInternalSquads.map(
                (internalSquad) => internalSquad.uuid
            )

            form.initialize({
                id: user.id,
                trafficLimitBytes: user.trafficLimitBytes,
                trafficLimitStrategy: user.trafficLimitStrategy,
                expireAt: user.expireAt,
                activeInternalSquads,
                description: user.description ?? '',
                telegramId: user.telegramId ?? undefined,
                email: user.email ?? undefined,
                hwidDeviceLimit: user.hwidDeviceLimit ?? undefined,
                tag: user.tag ?? undefined,
                externalSquadUuid: user.externalSquadUuid ?? undefined
            })
        }
    }, [user, internalSquads])

    const handleSubmit = form.onSubmit(async (values) => {
        const touchedFields = form.getTouched()

        updateUser({
            variables: {
                id: values.id,
                trafficLimitStrategy: touchedFields.trafficLimitStrategy
                    ? values.trafficLimitStrategy
                    : undefined,
                trafficLimitBytes: touchedFields.trafficLimitBytes
                    ? values.trafficLimitBytes
                    : undefined,
                // @ts-expect-error - TODO: fix ZOD schema
                expireAt: touchedFields.expireAt ? dayjs(values.expireAt).toISOString() : undefined,
                activeInternalSquads: touchedFields.activeInternalSquads
                    ? values.activeInternalSquads
                    : undefined,
                description: touchedFields.description ? values.description : undefined,
                // @ts-expect-error - TODO: fix ZOD schema
                telegramId: values.telegramId === '' ? null : values.telegramId,
                email: values.email === '' ? null : values.email,
                // @ts-expect-error - TODO: fix ZOD schema
                hwidDeviceLimit: values.hwidDeviceLimit === '' ? null : values.hwidDeviceLimit,
                // eslint-disable-next-line no-nested-ternary
                tag: touchedFields.tag ? (values.tag === '' ? null : values.tag) : undefined,
                externalSquadUuid: touchedFields.externalSquadUuid
                    ? values.externalSquadUuid
                    : undefined
            }
        })
    })

    if (!user || !nodes || !tags || !internalSquads || !externalSquads) {
        return (
            <motion.div
                animate={{ opacity: 1 }}
                initial={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
            >
                <LoaderModalShared mih="70vh" />
            </motion.div>
        )
    }

    const lastConnectedNode = nodes.find((n) => n.uuid === user.userTraffic.lastConnectedNodeUuid)

    return (
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
                    <UserIdentificationCard
                        cardVariants={cardVariants}
                        lastConnectedNode={lastConnectedNode}
                        motionWrapper={MotionWrapper}
                        user={user}
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

            {!isMobile && (
                <Group align="flex-start" gap="md" grow={false} wrap="wrap">
                    <MotionStack
                        animate="visible"
                        gap="md"
                        initial="hidden"
                        style={{ flex: '1 1 450px' }}
                        variants={containerVariants}
                    >
                        <UserIdentificationCard
                            cardVariants={cardVariants}
                            lastConnectedNode={lastConnectedNode}
                            motionWrapper={MotionWrapper}
                            user={user}
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
                <Menu keepMounted position="top-end" shadow="md">
                    <Menu.Target>
                        <Button color="gray" leftSection={<TbDots size={px('1.2rem')} />} size="md">
                            {t('common.action.more-actions')}
                        </Button>
                    </Menu.Target>

                    <Menu.Dropdown>
                        <Menu.Label>{t('view-user-modal.widget.danger-zone')}</Menu.Label>
                        <DeleteUserFeature userId={user.id} />

                        <Menu.Divider />
                        <Menu.Label>{t('view-user-modal.widget.management')}</Menu.Label>
                        <ToggleUserStatusButtonFeature user={user} />
                        <ResetUsageUserFeature userId={user.id} />
                        <RevokeSubscriptionUserFeature userId={user.id} />
                    </Menu.Dropdown>
                </Menu>

                <Button
                    color="teal"
                    leftSection={<PiFloppyDiskDuotone size="16px" />}
                    loading={isUpdateUserPending}
                    onClick={() => {
                        handleSubmit()
                    }}
                    size="md"
                    variant="soft"
                >
                    {t('common.action.save')}
                </Button>
            </ModalFooter>
        </motion.div>
    )
}
