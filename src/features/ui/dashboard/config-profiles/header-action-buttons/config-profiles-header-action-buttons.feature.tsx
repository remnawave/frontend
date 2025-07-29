import {
    ActionIcon,
    ActionIconGroup,
    Button,
    Group,
    Modal,
    Stack,
    Text,
    TextInput,
    Tooltip
} from '@mantine/core'
import { CreateConfigProfileCommand } from '@remnawave/backend-contract'
import { generatePath, useNavigate } from 'react-router-dom'
import { TbPlus, TbRefresh } from 'react-icons/tb'
import { useDisclosure } from '@mantine/hooks'
import { useTranslation } from 'react-i18next'
import { useField } from '@mantine/form'

import { QueryKeys, useCreateConfigProfile, useGetConfigProfiles } from '@shared/api/hooks'
import { ROUTES } from '@shared/constants'
import { queryClient } from '@shared/api'

const generateDefaultConfig = () => {
    const randomNumber = Math.floor(Math.random() * 999999) + 1

    return {
        log: {
            loglevel: 'info'
        },
        inbounds: [
            {
                tag: `Shadowsocks_${randomNumber}`,
                port: 1234,
                protocol: 'shadowsocks',
                settings: {
                    clients: [],
                    network: 'tcp,udp'
                },
                sniffing: {
                    enabled: true,
                    destOverride: ['http', 'tls', 'quic']
                }
            }
        ],
        outbounds: [
            {
                protocol: 'freedom',
                tag: 'DIRECT'
            },
            {
                protocol: 'blackhole',
                tag: 'BLOCK'
            }
        ],
        routing: {
            rules: []
        }
    }
}

export const ConfigProfilesHeaderActionButtonsFeature = () => {
    const { isFetching } = useGetConfigProfiles()
    const { t } = useTranslation()

    const [opened, { open, close }] = useDisclosure(false)
    const navigate = useNavigate()

    const handleUpdate = async () => {
        await queryClient.refetchQueries({
            queryKey: QueryKeys['config-profiles'].getConfigProfiles.queryKey
        })
    }

    const nameField = useField<CreateConfigProfileCommand.Request['name']>({
        initialValue: '',
        validateOnChange: true,
        validate: (value) => {
            const result = CreateConfigProfileCommand.RequestSchema.omit({
                config: true
            }).safeParse({ name: value })
            return result.success ? null : result.error.errors[0]?.message
        }
    })
    const { mutate: createConfigProfile, isPending } = useCreateConfigProfile({
        mutationFns: {
            onSuccess: (data) => {
                close()
                nameField.reset()
                handleUpdate()
                navigate(
                    generatePath(ROUTES.DASHBOARD.MANAGEMENT.CONFIG_PROFILE_BY_UUID, {
                        uuid: data.uuid
                    })
                )
            }
        }
    })

    return (
        <Group grow preventGrowOverflow={false} wrap="wrap">
            <ActionIconGroup>
                <Tooltip
                    label={t('config-profiles-header-action-buttons.feature.update')}
                    withArrow
                >
                    <ActionIcon
                        loading={isFetching}
                        onClick={handleUpdate}
                        radius="md"
                        size="lg"
                        variant="light"
                    >
                        <TbRefresh size="18px" />
                    </ActionIcon>
                </Tooltip>
            </ActionIconGroup>

            <ActionIconGroup>
                <Tooltip
                    label={t('config-profiles-header-action-buttons.feature.create-config-profile')}
                    withArrow
                >
                    <ActionIcon color="teal" onClick={open} radius="md" size="lg" variant="light">
                        <TbPlus size="18px" />
                    </ActionIcon>
                </Tooltip>
            </ActionIconGroup>

            <Modal
                centered
                onClose={close}
                opened={opened}
                size="md"
                title={t('config-profiles-header-action-buttons.feature.create-config-profile')}
            >
                <Stack gap="md">
                    <Text size="sm">
                        {t(
                            'config-profiles-header-action-buttons.feature.create-a-new-config-profile-by-entering-a-name-below'
                        )}
                        <br />

                        {t(
                            'config-profiles-header-action-buttons.feature.you-can-customize-xray-config-after-creation'
                        )}
                    </Text>
                    <TextInput
                        description={t(
                            'config-profiles-header-action-buttons.feature.it-cant-be-changed-later'
                        )}
                        label={t('config-profiles-header-action-buttons.feature.profile-name')}
                        placeholder={t(
                            'config-profiles-header-action-buttons.feature.enter-profile-name'
                        )}
                        required
                        {...nameField.getInputProps()}
                    />
                    <Group justify="flex-end">
                        <Button onClick={close} variant="default">
                            {t('config-profiles-header-action-buttons.feature.cancel')}
                        </Button>

                        <Button
                            loading={isPending}
                            onClick={() => {
                                createConfigProfile({
                                    variables: {
                                        name: nameField.getValue(),
                                        config: generateDefaultConfig()
                                    }
                                })
                            }}
                        >
                            {t('config-profiles-header-action-buttons.feature.create')}
                        </Button>
                    </Group>
                </Stack>
            </Modal>
        </Group>
    )
}
