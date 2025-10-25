import {
    ActionIcon,
    Box,
    Button,
    Code,
    Divider,
    Drawer,
    Flex,
    Group,
    Paper,
    ScrollArea,
    Stack,
    Text,
    ThemeIcon,
    Title,
    Tooltip
} from '@mantine/core'
import {
    type PublicKeyCredentialCreationOptionsJSON,
    startRegistration
} from '@simplewebauthn/browser'
import { PiClockDuotone, PiKey, PiTrash } from 'react-icons/pi'
import { notifications } from '@mantine/notifications'
import { TbFingerprint } from 'react-icons/tb'
import { useTranslation } from 'react-i18next'
import { modals } from '@mantine/modals'
import consola from 'consola/browser'
import { useState } from 'react'

import {
    QueryKeys,
    useDeletePasskey,
    useGetAllPasskeys,
    usePasskeyRegistrationOptions,
    usePasskeyRegistrationVerify
} from '@shared/api/hooks'
import { CopyableFieldShared } from '@shared/ui/copyable-field/copyable-field'
import { formatDate } from '@shared/utils/misc/date'
import { LoadingScreen } from '@shared/ui'
import { queryClient } from '@shared/api'

interface IProps {
    onClose: () => void
    opened: boolean
}

export const PasskeysDrawerComponent = ({ onClose, opened }: IProps) => {
    const { t } = useTranslation()

    const { data: passkeysData, isLoading } = useGetAllPasskeys()
    const [isPasskeyRegistering, setIsPasskeyRegistering] = useState(false)
    const { mutate: deletePasskey, isPending: isDeleting } = useDeletePasskey({
        mutationFns: {
            onSuccess: () => {
                queryClient.refetchQueries({
                    queryKey: QueryKeys.passkeys.getAllPasskeys.queryKey
                })
            }
        }
    })

    const { refetch: getPasskeyRegistrationOptions } = usePasskeyRegistrationOptions()
    const { mutateAsync: verifyRegistration } = usePasskeyRegistrationVerify({
        mutationFns: {
            onSuccess: () => {
                queryClient.refetchQueries({
                    queryKey: QueryKeys.passkeys.getAllPasskeys.queryKey
                })
            }
        }
    })

    const handleDelete = (passkeyId: string) => {
        modals.openConfirmModal({
            title: t('passkeys-drawer.component.delete-passkey'),
            centered: true,
            children: t('passkeys-drawer.component.delete-passkey-confirmation'),
            labels: {
                confirm: t('common.delete'),
                cancel: t('common.cancel')
            },
            cancelProps: { variant: 'subtle', color: 'gray' },
            confirmProps: { color: 'red' },
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
        <Drawer
            keepMounted={false}
            onClose={onClose}
            opened={opened}
            overlayProps={{ backgroundOpacity: 0.6, blur: 0 }}
            padding="md"
            position="right"
            size="lg"
            title={
                <Group gap="sm" mt="md">
                    <ThemeIcon color="blue" size="lg" variant="light">
                        <TbFingerprint size={20} />
                    </ThemeIcon>
                    <Title order={3}>{t('passkeys-drawer.component.passkeys')}</Title>
                </Group>
            }
        >
            <Flex direction="column" gap="md" h="100%">
                <Text c="dimmed" size="sm">
                    {t('passkeys-drawer.component.passkeys-description')}
                </Text>

                <Divider />

                <Group justify="space-between">
                    <Title order={4}>
                        {t('passkeys-drawer.component.active-passkeys')} ({passkeys.length})
                    </Title>

                    <Button
                        leftSection={<TbFingerprint size={20} />}
                        loading={isPasskeyRegistering}
                        onClick={handleRegisterPasskey}
                        size="md"
                        variant="light"
                    >
                        {t('common.add')}
                    </Button>
                </Group>

                {isLoading && <LoadingScreen />}

                {!isLoading && passkeys.length === 0 && (
                    <Box
                        mih="280px"
                        p="xl"
                        style={{
                            border: '1px dashed var(--mantine-color-gray-4)',
                            borderRadius: 'var(--mantine-radius-md)',
                            textAlign: 'center',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Stack align="center" gap="xl">
                            <ThemeIcon color="blue" radius="xl" size={80} variant="light">
                                <TbFingerprint size={40} />
                            </ThemeIcon>
                            <Stack align="center" gap="xs">
                                <Text fw={600} size="lg" ta="center">
                                    {t('passkeys-drawer.component.no-passkeys-registered-yet')}
                                </Text>
                                <Text c="dimmed" maw={300} size="sm" ta="center">
                                    {t('passkeys-drawer.component.add-passkeys-description')}
                                </Text>
                                <Button
                                    leftSection={<TbFingerprint size={16} />}
                                    loading={isPasskeyRegistering}
                                    mt="md"
                                    onClick={handleRegisterPasskey}
                                    size="md"
                                    variant="light"
                                >
                                    {t('passkeys-drawer.component.register')}
                                </Button>
                            </Stack>
                        </Stack>
                    </Box>
                )}

                {!isLoading && passkeys.length > 0 && (
                    <ScrollArea flex={1} offsetScrollbars type="auto">
                        <Stack gap="xs">
                            {passkeys.map(
                                (passkey: {
                                    createdAt: Date
                                    id: string
                                    lastUsedAt: Date
                                    name: string
                                }) => (
                                    <Paper bg="dark.6" p="md">
                                        <Stack gap="xs">
                                            <Group justify="space-between">
                                                <Group>
                                                    <ThemeIcon
                                                        color="violet"
                                                        size="lg"
                                                        variant="default"
                                                    >
                                                        <TbFingerprint size={24} />
                                                    </ThemeIcon>
                                                    <Title order={5}>{passkey.name}</Title>
                                                </Group>

                                                <Tooltip
                                                    label={t(
                                                        'passkeys-drawer.component.delete-passkey'
                                                    )}
                                                >
                                                    <ActionIcon
                                                        color="red"
                                                        disabled={isDeleting}
                                                        loading={isDeleting}
                                                        onClick={() => handleDelete(passkey.id)}
                                                        size="lg"
                                                        variant="light"
                                                    >
                                                        <PiTrash size={18} />
                                                    </ActionIcon>
                                                </Tooltip>
                                            </Group>

                                            <CopyableFieldShared
                                                label="ID"
                                                leftSection={<PiKey size={16} />}
                                                value={passkey.id}
                                            />

                                            <CopyableFieldShared
                                                label={t('passkeys-drawer.component.last-used-at')}
                                                leftSection={<PiClockDuotone size={16} />}
                                                value={formatDate(passkey.lastUsedAt)}
                                            />

                                            <CopyableFieldShared
                                                label={t('passkeys-drawer.component.created-at')}
                                                leftSection={<PiClockDuotone size={16} />}
                                                value={formatDate(passkey.createdAt)}
                                            />
                                        </Stack>
                                    </Paper>
                                )
                            )}
                        </Stack>
                    </ScrollArea>
                )}
            </Flex>
        </Drawer>
    )
}
