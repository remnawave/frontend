import { CreateNodeCommand } from '@remnawave/backend-contract'
import { Button, Group, Skeleton, Stack } from '@mantine/core'
import { UseFormReturnType } from '@mantine/form'
import { useTranslation } from 'react-i18next'
import { PiArrowLeft } from 'react-icons/pi'
import { TbCheck } from 'react-icons/tb'

import { ShowConfigProfilesWithInboundsFeature } from '@features/ui/dashboard/nodes/show-config-profiles-with-inbounds'
import { useGetConfigProfiles } from '@shared/api/hooks'

import { CopyDockerComposeWidget } from './copy-docker-compose.widget'

interface IProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: UseFormReturnType<CreateNodeCommand.Request, any>
    isCreating: boolean
    onCreateNode: () => void
    onPrev: () => void
    port: number
}

export const CreateNodeStep2ConfigProfiles = ({
    form,
    isCreating,
    onCreateNode,
    onPrev,
    port
}: IProps) => {
    const { t } = useTranslation()

    const { data: configProfiles, isLoading: isConfigProfilesLoading } = useGetConfigProfiles()

    const saveInbounds = (inbounds: string[], configProfileUuid: string) => {
        form.setValues({
            configProfile: {
                activeInbounds: inbounds,
                activeConfigProfileUuid: configProfileUuid
            }
        })
        form.setTouched({
            activeConfigProfileUuid: true,
            activeInbounds: true
        })
        form.setDirty({
            activeConfigProfileUuid: true,
            activeInbounds: true
        })
    }

    const handleCreateNode = () => {
        const configProfileErrors = form.validateField('configProfile')
        const activeConfigProfileUuidErrors = form.validateField(
            'configProfile.activeConfigProfileUuid'
        )
        const activeInboundsErrors = form.validateField('configProfile.activeInbounds')

        if (
            !configProfileErrors.hasError &&
            !activeConfigProfileUuidErrors.hasError &&
            !activeInboundsErrors.hasError
        ) {
            onCreateNode()
        }
    }

    return (
        <Stack gap="xl" mih={400}>
            <Stack gap="md">
                {isConfigProfilesLoading && (
                    <Stack gap="md">
                        <Skeleton height={24} width="40%" />
                        <Skeleton height={16} width="60%" />
                        <Skeleton height={76} radius="md" />
                        <Skeleton height={25} radius="sm" width="100%" />
                    </Stack>
                )}

                {!isConfigProfilesLoading && configProfiles && (
                    <ShowConfigProfilesWithInboundsFeature
                        activeConfigProfileInbounds={
                            form.getValues().configProfile?.activeInbounds ?? []
                        }
                        activeConfigProfileUuid={
                            form.getValues().configProfile?.activeConfigProfileUuid
                        }
                        configProfiles={configProfiles.configProfiles}
                        errors={form.errors.configProfile}
                        onSaveInbounds={saveInbounds}
                    />
                )}
            </Stack>

            <Stack gap="xs" mt="auto">
                <CopyDockerComposeWidget port={port} />

                <Group justify="space-between">
                    <Button
                        color="gray"
                        leftSection={<PiArrowLeft size={18} />}
                        onClick={onPrev}
                        size="md"
                    >
                        {t('create-node-modal.widget.back')}
                    </Button>
                    <Button
                        color="teal"
                        leftSection={<TbCheck size={18} />}
                        loading={isCreating}
                        onClick={handleCreateNode}
                        size="md"
                        type="submit"
                    >
                        {t('create-node-modal.widget.create-node')}
                    </Button>
                </Group>
            </Stack>
        </Stack>
    )
}
