import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { Button, Modal, Stack, TextInput } from '@mantine/core'
import { useForm, schemaResolver } from '@mantine/form'
import { CreateInfraProviderCommand } from '@remnawave/backend-contract'
import { useTranslation } from 'react-i18next'
import { TbServer } from 'react-icons/tb'

import { useNiceMantineModal } from '@shared/_modals/use-nice-modal'
import { queryClient } from '@shared/api'
import { QueryKeys, useCreateInfraProvider } from '@shared/api/hooks'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { handleFormErrors } from '@shared/utils/misc'

export const CreateInfraProviderModal = NiceModal.create(() => {
    const modal = useModal()
    const { modalProps, hide } = useNiceMantineModal({ modal })

    const { t } = useTranslation()

    const form = useForm<CreateInfraProviderCommand.RequestBody>({
        name: 'create-infra-provider-form',
        mode: 'uncontrolled',
        validate: schemaResolver(CreateInfraProviderCommand.RequestBodySchema)
    })

    const { mutate: createInfraProvider, isPending: isCreateInfraProviderPending } =
        useCreateInfraProvider({
            mutationFns: {
                onSuccess: () => {
                    queryClient.refetchQueries({
                        queryKey: QueryKeys.infraBilling.getInfraProviders.queryKey
                    })

                    hide()
                },
                onError: (error) => {
                    handleFormErrors(form, error)
                }
            }
        })

    const handleSubmit = form.onSubmit(async (values) => {
        createInfraProvider({
            variables: {
                name: values.name,
                faviconLink: values.faviconLink,
                loginUrl: values.loginUrl
            }
        })
    })

    return (
        <Modal
            {...modalProps}
            centered
            size="md"
            title={
                <BaseOverlayHeader
                    iconColor="teal"
                    IconComponent={TbServer}
                    iconVariant="soft"
                    title={t('view-infra-provider.drawer.widget.infra-provider')}
                />
            }
        >
            <form onSubmit={handleSubmit}>
                <Stack>
                    <TextInput
                        description={t('view-infra-provider.drawer.widget.name-description')}
                        label={t('common.field.name')}
                        placeholder={t('view-infra-provider.drawer.widget.enter-provider-name')}
                        required
                        {...form.getInputProps('name')}
                    />

                    <TextInput
                        description={t(
                            'view-infra-provider.drawer.widget.favicon-link-description'
                        )}
                        label={t('view-infra-provider.drawer.widget.favicon-link')}
                        placeholder="https://hetzner.com"
                        required
                        {...form.getInputProps('faviconLink')}
                    />

                    <TextInput
                        description={t('view-infra-provider.drawer.widget.login-url-description')}
                        label={t('view-infra-provider.drawer.widget.login-url')}
                        placeholder="https://cloud.hetzner.com"
                        required
                        {...form.getInputProps('loginUrl')}
                    />

                    <Button loading={isCreateInfraProviderPending} type="submit">
                        {t('common.action.create')}
                    </Button>
                </Stack>
            </form>
        </Modal>
    )
})
