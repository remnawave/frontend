import NiceModal, { useModal } from '@ebay/nice-modal-react'
import {
    ActionIcon,
    Button,
    Center,
    Code,
    DataList,
    Group,
    Stack,
    Text,
    ThemeIcon,
    Tooltip
} from '@mantine/core'
import { modals } from '@mantine/modals'
import { notifications } from '@mantine/notifications'
import {
    type PublicKeyCredentialCreationOptionsJSON,
    startRegistration
} from '@simplewebauthn/browser'
import consola from 'consola/browser'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PiPencil, PiTrash } from 'react-icons/pi'
import { TbFingerprint, TbPasswordFingerprint, TbPlus } from 'react-icons/tb'

import { showModal } from '@shared/_modals/show-modal'
import { useNiceMantineModal } from '@shared/_modals/use-nice-modal'
import { queryClient } from '@shared/api'
import {
    QueryKeys,
    useDeletePasskey,
    useGetPasskeys,
    usePasskeyRegistrationOptions,
    usePasskeyRegistrationVerify
} from '@shared/api/hooks'
import { CompoundDrawerShared } from '@shared/ui/compound-drawer/compound-drawer.shared'
import { CopyableDataListItem } from '@shared/ui/copyable-field/copyable-data-list-item'
import { LoaderModalShared } from '@shared/ui/loader-modal'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { SectionCard } from '@shared/ui/section-card'
import { formatTimeUtil } from '@shared/utils/time-utils'

export const PasskeysDrawer = NiceModal.create(() => {
    const { t, i18n } = useTranslation()

    const modal = useModal()
    const { modalProps } = useNiceMantineModal({
        modal,
        drawer: true
    })

    const { data: passkeysData, isLoading } = useGetPasskeys()

    const [isPasskeyRegistering, setIsPasskeyRegistering] = useState(false)
    const { mutate: deletePasskey, isPending: isDeleting } = useDeletePasskey({
        mutationFns: {
            onSuccess: () => {
                queryClient.refetchQueries({
                    queryKey: QueryKeys.passkeys.getPasskeys.queryKey
                })
            }
        }
    })

    const { refetch: getPasskeyRegistrationOptions } = usePasskeyRegistrationOptions()
    const { mutateAsync: verifyRegistration } = usePasskeyRegistrationVerify({
        mutationFns: {
            onSuccess: () => {
                queryClient.refetchQueries({
                    queryKey: QueryKeys.passkeys.getPasskeys.queryKey
                })
            }
        }
    })

    const handleDelete = (passkeyId: string) => {
        modals.openConfirmModal({
            title: t('common.action.confirm-action'),
            centered: true,
            children: t('common.message.confirm-action-description'),
            labels: {
                confirm: t('common.action.delete'),
                cancel: t('common.action.cancel')
            },
            cancelProps: { variant: 'subtle' },
            confirmProps: { color: 'red', variant: 'soft' },
            onConfirm: () => {
                deletePasskey({
                    variables: { id: passkeyId }
                })
            }
        })
    }

    const handleRegisterPasskey = async () => {
        setIsPasskeyRegistering(true)

        try {
            const {
                data: registrationOptions,
                isError,
                error
            } = await getPasskeyRegistrationOptions()

            if (isError) {
                modals.open({
                    title: 'Request Failed',
                    centered: true,
                    children: (
                        <Stack gap="md">
                            <Code p="md">
                                <Text c="red.1" fw={500} size="sm">
                                    {error.message}
                                </Text>
                            </Code>
                        </Stack>
                    )
                })

                return
            }

            const registrationResponse = await startRegistration({
                optionsJSON: registrationOptions as PublicKeyCredentialCreationOptionsJSON
            })

            await verifyRegistration({
                variables: {
                    response: registrationResponse
                }
            })
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.name === 'NotAllowedError') {
                    notifications.show({
                        title: 'Passkey Registration',
                        message: 'Registration was cancelled',
                        color: 'red'
                    })
                } else if (error.name === 'NotSupportedError') {
                    notifications.show({
                        title: 'Passkey Registration',
                        message: 'Passkeys are not supported on this device',
                        color: 'red'
                    })
                } else if (error.name === 'InvalidStateError') {
                    notifications.show({
                        title: 'Passkey Registration',
                        message: 'This device is already registered',
                        color: 'red'
                    })
                } else {
                    notifications.show({
                        title: 'Passkey Registration Error',
                        message: error.message || 'Unknown error occurred',
                        color: 'red'
                    })
                }
            } else {
                consola.error(error)
                notifications.show({
                    title: 'Passkey Registration Error',
                    message: 'An unexpected error occurred',
                    color: 'red'
                })
            }
        } finally {
            setIsPasskeyRegistering(false)
        }
    }

    const passkeys = passkeysData?.passkeys || []

    return (
        <CompoundDrawerShared
            drawerProps={{
                ...modalProps,
                padding: 'md',
                position: 'right',
                size: 'lg'
            }}
            title={
                <BaseOverlayHeader
                    iconColor="blue"
                    IconComponent={TbFingerprint}
                    iconVariant="soft"
                    title={t('passkeys-drawer.component.passkeys')}
                />
            }
            buttons={
                <Tooltip label={t('common.action.add')}>
                    <ActionIcon
                        color="teal"
                        onClick={handleRegisterPasskey}
                        loading={isPasskeyRegistering}
                        size="lg"
                        variant="soft"
                    >
                        <TbPlus size={20} />
                    </ActionIcon>
                </Tooltip>
            }
        >
            {isLoading && <LoaderModalShared mih="300px" />}

            {!isLoading && passkeys.length === 0 && (
                <SectionCard.Root>
                    <SectionCard.Section>
                        <Center py="xl">
                            <Stack align="center" gap="lg">
                                <ThemeIcon color="gray" radius="xl" size={64} variant="soft">
                                    <TbFingerprint size={32} />
                                </ThemeIcon>

                                <Stack align="center" gap="xs">
                                    <Text c="dimmed" fw={600} size="md" ta="center">
                                        {t('passkeys-drawer.component.no-passkeys-registered-yet')}
                                    </Text>
                                    <Text c="dimmed" maw={300} size="sm" ta="center">
                                        {t('passkeys-drawer.component.add-passkeys-description')}
                                    </Text>
                                    <Button
                                        color="teal"
                                        onClick={handleRegisterPasskey}
                                        loading={isPasskeyRegistering}
                                        size="md"
                                        variant="soft"
                                        leftSection={<TbFingerprint size={20} />}
                                    >
                                        {t('passkeys-drawer.component.register')}
                                    </Button>
                                </Stack>
                            </Stack>
                        </Center>
                    </SectionCard.Section>
                </SectionCard.Root>
            )}

            {!isLoading && passkeys.length > 0 && (
                <Stack gap="xs">
                    {passkeys.map((passkey) => (
                        <SectionCard.Root key={passkey.id}>
                            <SectionCard.Section>
                                <Group gap="xs" justify="space-between" wrap="nowrap">
                                    <BaseOverlayHeader
                                        iconColor="teal"
                                        IconComponent={TbPasswordFingerprint}
                                        iconSize={20}
                                        iconVariant="soft"
                                        titleOrder={4}
                                        title={passkey.name}
                                    />
                                    <Group gap="xs">
                                        <Tooltip label={t('common.action.rename')}>
                                            <ActionIcon
                                                onClick={() =>
                                                    showModal('renameModal', {
                                                        renameFrom: 'passkey',
                                                        name: passkey.name,
                                                        uuid: passkey.id
                                                    })
                                                }
                                                size="lg"
                                                variant="soft"
                                            >
                                                <PiPencil size={18} />
                                            </ActionIcon>
                                        </Tooltip>

                                        <Tooltip label={t('common.action.delete')}>
                                            <ActionIcon
                                                color="red"
                                                disabled={isDeleting}
                                                loading={isDeleting}
                                                onClick={() => handleDelete(passkey.id)}
                                                size="lg"
                                                variant="soft"
                                            >
                                                <PiTrash size={18} />
                                            </ActionIcon>
                                        </Tooltip>
                                    </Group>
                                </Group>
                            </SectionCard.Section>
                            <SectionCard.Section>
                                <DataList withDivider orientation="vertical" size="xs">
                                    <CopyableDataListItem label="ID" monospace value={passkey.id} />
                                    <CopyableDataListItem
                                        label={t('passkeys-drawer.component.last-used-at')}
                                        monospace
                                        value={formatTimeUtil({
                                            time: passkey.lastUsedAt,
                                            template: 'TIME_FIRST_DATETIME',
                                            language: i18n.language
                                        })}
                                    />
                                    <CopyableDataListItem
                                        label={t('common.field.created-at')}
                                        monospace
                                        value={formatTimeUtil({
                                            time: passkey.createdAt,
                                            template: 'TIME_FIRST_DATETIME',
                                            language: i18n.language
                                        })}
                                    />
                                </DataList>
                            </SectionCard.Section>
                        </SectionCard.Root>
                    ))}
                </Stack>
            )}
        </CompoundDrawerShared>
    )
})
