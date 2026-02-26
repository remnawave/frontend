import {
    ActionIcon,
    ActionIconGroup,
    Button,
    Group,
    Modal,
    Stack,
    TextInput,
    Tooltip
} from '@mantine/core'
import { CreateNodePluginCommand } from '@remnawave/backend-contract'
import { generatePath, useNavigate } from 'react-router-dom'
import { TbFile, TbPlus, TbRefresh } from 'react-icons/tb'
import { useDisclosure } from '@mantine/hooks'
import { useTranslation } from 'react-i18next'
import { useField } from '@mantine/form'

import { QueryKeys, useCreateNodePlugin, useGetNodePlugins } from '@shared/api/hooks'
import { UniversalSpotlightActionIconShared } from '@shared/ui/universal-spotlight'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { ROUTES } from '@shared/constants'
import { queryClient } from '@shared/api'

export const NodePluginsHeaderActionButtonsFeature = () => {
    const { t } = useTranslation()

    const { isFetching } = useGetNodePlugins()

    const [opened, { open, close }] = useDisclosure(false)
    const navigate = useNavigate()

    const handleUpdate = async () => {
        await queryClient.refetchQueries({
            queryKey: QueryKeys.nodePlugins.getNodePlugins.queryKey
        })
    }

    const nameField = useField<CreateNodePluginCommand.Request['name']>({
        initialValue: '',
        validateOnChange: true,
        validate: (value) => {
            const result = CreateNodePluginCommand.RequestSchema.safeParse({
                name: value
            })
            return result.success ? null : result.error.errors[0]?.message
        }
    })
    const { mutate: createNodePlugin, isPending } = useCreateNodePlugin({
        mutationFns: {
            onSuccess: (data) => {
                close()
                nameField.reset()
                handleUpdate()
                navigate(
                    generatePath(ROUTES.DASHBOARD.MANAGEMENT.NODE_PLUGINS.NODE_PLUGIN_BY_UUID, {
                        uuid: data.uuid
                    })
                )
            }
        }
    })

    return (
        <Group grow preventGrowOverflow={false} wrap="wrap">
            <UniversalSpotlightActionIconShared />

            <ActionIconGroup>
                <Tooltip label={t('common.refresh')} withArrow>
                    <ActionIcon
                        loading={isFetching}
                        onClick={handleUpdate}
                        size="input-md"
                        variant="light"
                    >
                        <TbRefresh size="24px" />
                    </ActionIcon>
                </Tooltip>
            </ActionIconGroup>

            <ActionIconGroup>
                <ActionIcon color="teal" onClick={open} size="input-md" variant="light">
                    <TbPlus size="24px" />
                </ActionIcon>
            </ActionIconGroup>

            <Modal
                centered
                onClose={close}
                opened={opened}
                size="md"
                title={
                    <BaseOverlayHeader
                        IconComponent={TbFile}
                        iconVariant="gradient-teal"
                        title={t('common.create')}
                    />
                }
            >
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        createNodePlugin({
                            variables: {
                                name: nameField.getValue()
                            }
                        })
                    }}
                >
                    <Stack gap="md">
                        <TextInput
                            data-autofocus
                            label={t('common.name')}
                            placeholder="My Node Plugin"
                            required
                            {...nameField.getInputProps()}
                        />
                        <Group justify="flex-end">
                            <Button color="gray" onClick={close} variant="light">
                                {t('common.cancel')}
                            </Button>

                            <Button color="teal" loading={isPending} type="submit">
                                {t('common.create')}
                            </Button>
                        </Group>
                    </Stack>
                </form>
            </Modal>
        </Group>
    )
}
