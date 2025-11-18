import { Box, Button, Center, em, Group, Menu, Modal, px, Stack } from '@mantine/core'
import { PiFloppyDiskDuotone, PiQrCodeDuotone, PiUserCircle } from 'react-icons/pi'
import { UpdateUserCommand } from '@remnawave/backend-contract'
import { zodResolver } from 'mantine-form-zod-resolver'
import { TbDots, TbServerCog } from 'react-icons/tb'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from '@mantine/hooks'
import { useEffect, useMemo } from 'react'
import { modals } from '@mantine/modals'
import { useForm } from '@mantine/form'
import { motion } from 'motion/react'
import { renderSVG } from 'uqr'
import dayjs from 'dayjs'

import {
    AccessSettingsCard,
    ContactInformationCard,
    DeviceTagSettingsCard,
    TrafficLimitsCard,
    UserIdentificationCard
} from '@shared/ui/forms/users/forms-components'
import {
    useGetExternalSquads,
    useGetInternalSquads,
    useGetUserByUuid,
    useGetUserTags,
    usersQueryKeys,
    useUpdateUser
} from '@shared/api/hooks'
import {
    useUserModalStoreActions,
    useUserModalStoreIsModalOpen,
    useUserModalStoreUserUuid
} from '@entities/dashboard/user-modal-store/user-modal-store'
import { GetUserSubscriptionRequestHistoryFeature } from '@features/ui/dashboard/users/get-user-subscription-request-history'
import { GetUserSubscriptionLinksFeature } from '@features/ui/dashboard/users/get-user-subscription-links'
import { ToggleUserStatusButtonFeature } from '@features/ui/dashboard/users/toggle-user-status-button'
import { RevokeSubscriptionUserFeature } from '@features/ui/dashboard/users/revoke-subscription-user'
import { useBulkUsersActionsStoreActions } from '@entities/dashboard/users/bulk-users-actions-store'
import { GetHwidUserDevicesFeature } from '@features/ui/dashboard/users/get-hwid-user-devices'
import { ResetUsageUserFeature } from '@features/ui/dashboard/users/reset-usage-user'
import { MODALS, useModalsStoreOpenWithData } from '@entities/dashboard/modal-store'
import { GetUserUsageFeature } from '@features/ui/dashboard/users/get-user-usage'
import { DeleteUserFeature } from '@features/ui/dashboard/users/delete-user'
import { bytesToGbUtil, gbToBytesUtil } from '@shared/utils/bytes'
import { LoaderModalShared } from '@shared/ui/loader-modal'
import { handleFormErrors } from '@shared/utils/misc'
import { ModalFooter } from '@shared/ui/modal-footer'
import { queryClient } from '@shared/api'

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

export const ViewUserModal = () => {
    const { t } = useTranslation()

    const isViewUserModalOpen = useUserModalStoreIsModalOpen()
    const actions = useUserModalStoreActions()
    const bulkUsersActionsStoreActions = useBulkUsersActionsStoreActions()

    const selectedUser = useUserModalStoreUserUuid()

    const isMobile = useMediaQuery(`(max-width: ${em(768)})`)

    const openModalWithData = useModalsStoreOpenWithData()

    const { data: internalSquads } = useGetInternalSquads()
    const { data: externalSquads } = useGetExternalSquads()

    const form = useForm<UpdateUserCommand.Request>({
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
        validate: zodResolver(
            UpdateUserCommand.RequestSchema._def.schema.omit({
                expireAt: true,
                hwidDeviceLimit: true
            })
        )
    })

    const isQueryEnabled = !!selectedUser && !form.isTouched()

    const {
        data: user,
        isLoading: isUserLoading,
        refetch: refetchUser
    } = useGetUserByUuid({
        route: {
            uuid: selectedUser ?? ''
        },
        rQueryParams: {
            enabled: isQueryEnabled
        }
    })

    const { data: tags, isLoading: isTagsLoading } = useGetUserTags()

    const {
        mutate: updateUser,
        isPending: isUpdateUserPending,
        isSuccess: isUserUpdated
    } = useUpdateUser({
        mutationFns: {
            onSuccess: () => {
                queryClient.refetchQueries({
                    queryKey: usersQueryKeys.getUserAccessibleNodes({
                        uuid: selectedUser ?? ''
                    }).queryKey
                })
            },

            onError: (error) => {
                handleFormErrors(form, error)
            }
        }
    })

    useEffect(() => {
        if (isUserUpdated) {
            refetchUser()
            queryClient.setQueryData(
                usersQueryKeys.getUserByUuid({
                    uuid: selectedUser ?? ''
                }).queryKey,
                user
            )
        }
    }, [isUserUpdated])

    useEffect(() => {
        if (user && internalSquads) {
            const activeInternalSquads = user.activeInternalSquads.map(
                (internalSquad) => internalSquad.uuid
            )
            form.setValues({
                uuid: user.uuid,
                trafficLimitBytes: bytesToGbUtil(user.trafficLimitBytes),
                trafficLimitStrategy: user.trafficLimitStrategy,
                expireAt: user.expireAt ? new Date(user.expireAt) : new Date(),
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

    useEffect(() => {
        if (isViewUserModalOpen) {
            bulkUsersActionsStoreActions.resetState()
        }
    }, [isViewUserModalOpen])

    const handleSubmit = form.onSubmit(async (values) => {
        const dirtyFields = form.getDirty()

        updateUser({
            variables: {
                uuid: values.uuid,
                trafficLimitStrategy: dirtyFields.trafficLimitStrategy
                    ? values.trafficLimitStrategy
                    : undefined,
                trafficLimitBytes: dirtyFields.trafficLimitBytes
                    ? gbToBytesUtil(values.trafficLimitBytes)
                    : undefined,
                // @ts-expect-error - TODO: fix ZOD schema
                expireAt: dirtyFields.expireAt ? dayjs(values.expireAt).toISOString() : undefined,
                activeInternalSquads: dirtyFields.activeInternalSquads
                    ? values.activeInternalSquads
                    : undefined,
                description: dirtyFields.description ? values.description : undefined,
                // @ts-expect-error - TODO: fix ZOD schema
                telegramId: values.telegramId === '' ? null : values.telegramId,
                email: values.email === '' ? null : values.email,
                // @ts-expect-error - TODO: fix ZOD schema
                hwidDeviceLimit: values.hwidDeviceLimit === '' ? null : values.hwidDeviceLimit,
                // eslint-disable-next-line no-nested-ternary
                tag: dirtyFields.tag ? (values.tag === '' ? null : values.tag) : undefined,
                externalSquadUuid: dirtyFields.externalSquadUuid
                    ? values.externalSquadUuid
                    : undefined
            }
        })
    })

    const handleClose = (closeModal: boolean = false) => {
        if (closeModal) {
            actions.changeModalState(false)
        }

        actions.clearModalState()

        form.reset()
        form.resetDirty()
        form.resetTouched()
    }

    const userSubscriptionUrlMemo = useMemo(
        () => user?.subscriptionUrl || '',
        [user?.subscriptionUrl]
    )

    return (
        <Modal
            centered
            fullScreen={isMobile}
            onClose={() => actions.changeModalState(false)}
            onExitTransitionEnd={handleClose}
            opened={isViewUserModalOpen}
            size="1000px"
            title={t('view-user-modal.widget.edit-user-headline')}
            transitionProps={isMobile ? { transition: 'fade', duration: 200 } : undefined}
        >
            {isUserLoading || isTagsLoading || !user ? (
                <motion.div
                    animate={{ opacity: 1 }}
                    initial={{ opacity: 0 }}
                    style={{ height: '70vh' }}
                    transition={{ duration: 0.3 }}
                >
                    <Center h="100%" mt="xl" py="xl" ta="center">
                        <Box>
                            <LoaderModalShared
                                text={t('view-user-modal.widget.fetching-user-data')}
                            />
                        </Box>
                    </Center>
                </motion.div>
            ) : (
                <motion.div
                    animate={{ opacity: 1 }}
                    initial={{ opacity: 0 }}
                    transition={{
                        duration: 0.4,
                        ease: 'easeInOut'
                    }}
                >
                    <form key="view-user-form" onSubmit={handleSubmit}>
                        {isMobile ? (
                            <MotionStack
                                animate="visible"
                                gap="lg"
                                initial="hidden"
                                variants={containerVariants}
                            >
                                <UserIdentificationCard
                                    cardVariants={cardVariants}
                                    motionWrapper={MotionWrapper}
                                    user={user}
                                    userSubscriptionUrlMemo={userSubscriptionUrlMemo}
                                />
                                <TrafficLimitsCard
                                    cardVariants={cardVariants}
                                    form={form}
                                    motionWrapper={MotionWrapper}
                                    user={user}
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
                        ) : (
                            <Group align="flex-start" gap="xl" grow={false} wrap="wrap">
                                <MotionStack
                                    animate="visible"
                                    gap="lg"
                                    initial="hidden"
                                    style={{ flex: '1 1 450px' }}
                                    variants={containerVariants}
                                >
                                    <UserIdentificationCard
                                        cardVariants={cardVariants}
                                        motionWrapper={MotionWrapper}
                                        user={user}
                                        userSubscriptionUrlMemo={userSubscriptionUrlMemo}
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
                                        user={user}
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
                            <Menu keepMounted={true} position="top-end" shadow="md">
                                <Menu.Target>
                                    <Button
                                        color="gray"
                                        leftSection={<TbDots size={px('1.2rem')} />}
                                        size="sm"
                                    >
                                        {t('view-user-modal.widget.more-actions')}
                                    </Button>
                                </Menu.Target>

                                <Menu.Dropdown>
                                    <Menu.Label>
                                        {t('view-user-modal.widget.danger-zone')}
                                    </Menu.Label>
                                    <DeleteUserFeature userUuid={user.uuid} />

                                    <Menu.Divider />
                                    <Menu.Label>
                                        {t('view-user-modal.widget.management')}
                                    </Menu.Label>
                                    <ToggleUserStatusButtonFeature user={user} />
                                    <ResetUsageUserFeature userUuid={user.uuid} />
                                    <RevokeSubscriptionUserFeature userUuid={user.uuid} />

                                    <Menu.Divider />
                                    <Menu.Label>
                                        {t('view-user-modal.widget.information')}
                                    </Menu.Label>
                                    <Menu.Item
                                        leftSection={<PiUserCircle size={14} />}
                                        onClick={async () => {
                                            await actions.setDrawerUserUuid(user.uuid)
                                            actions.changeDetailedUserInfoDrawerState(true)
                                        }}
                                    >
                                        {t('view-user-modal.widget.detailed-info')}
                                    </Menu.Item>
                                    <GetUserUsageFeature userUuid={user.uuid} />
                                    <GetHwidUserDevicesFeature userUuid={user.uuid} />

                                    <Menu.Item
                                        leftSection={<TbServerCog size={14} />}
                                        onClick={() => {
                                            openModalWithData(MODALS.USER_ACCESSIBLE_NODES_DRAWER, {
                                                userUuid: user.uuid
                                            })
                                        }}
                                    >
                                        {t('view-user-modal.widget.view-accessible-nodes')}
                                    </Menu.Item>

                                    <Menu.Divider />
                                    <Menu.Label>
                                        {t('view-user-modal.widget.subscription')}
                                    </Menu.Label>
                                    <Menu.Item
                                        leftSection={<PiQrCodeDuotone size={14} />}
                                        onClick={() => {
                                            const subscriptionQrCode = renderSVG(
                                                user.subscriptionUrl,
                                                {
                                                    whiteColor: '#161B22',
                                                    blackColor: '#3CC9DB'
                                                }
                                            )
                                            modals.open({
                                                centered: true,
                                                title: t(
                                                    'view-user-modal.widget.subscription-qr-code'
                                                ),
                                                children: (
                                                    <div
                                                        dangerouslySetInnerHTML={{
                                                            __html: subscriptionQrCode
                                                        }}
                                                    />
                                                )
                                            })
                                        }}
                                    >
                                        {t('view-user-modal.widget.subscription-qr-code')}
                                    </Menu.Item>
                                    <GetUserSubscriptionLinksFeature uuid={user.uuid} />
                                    <GetUserSubscriptionRequestHistoryFeature
                                        userUuid={user.uuid}
                                    />
                                </Menu.Dropdown>
                            </Menu>
                            <Button
                                color="teal"
                                leftSection={<PiFloppyDiskDuotone size="16px" />}
                                loading={isUpdateUserPending}
                                size="sm"
                                type="submit"
                                variant="light"
                            >
                                {t('view-user-modal.widget.edit-user')}
                            </Button>
                        </ModalFooter>
                    </form>
                </motion.div>
            )}
        </Modal>
    )
}
