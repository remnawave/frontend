import { Button, Group, Modal, Stack, Text, TextInput } from '@mantine/core'
import { CreateConfigProfileCommand } from '@remnawave/backend-contract'
import { generatePath, useNavigate } from 'react-router-dom'
import { PiArrowsClockwise, PiPlus } from 'react-icons/pi'
import { useDisclosure } from '@mantine/hooks'
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
            <Button
                leftSection={<PiArrowsClockwise size="1rem" />}
                loading={isFetching}
                onClick={handleUpdate}
                size="xs"
                variant="default"
            >
                Update
            </Button>

            <Button leftSection={<PiPlus size="1rem" />} onClick={open} size="xs" variant="default">
                Create Config Profile
            </Button>

            <Modal centered onClose={close} opened={opened} size="md" title="Create Config Profile">
                <Stack gap="md">
                    <Text size="sm">
                        Create a new config profile by entering a name below.
                        <br />
                        <br />
                        You can customize XRay config after creation.
                    </Text>
                    <TextInput
                        description="It can't be changed later"
                        label="Profile Name"
                        placeholder="Enter profile name"
                        required
                        {...nameField.getInputProps()}
                    />
                    <Group justify="flex-end">
                        <Button onClick={close} variant="default">
                            Cancel
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
                            Create
                        </Button>
                    </Group>
                </Stack>
            </Modal>
        </Group>
    )
}
