import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { Button, Modal, Stack, TextInput } from '@mantine/core'
import { useForm, schemaResolver } from '@mantine/form'
import { GetInfraProvidersCommand, UpdateInfraProviderCommand } from '@remnawave/backend-contract'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { TbServer } from 'react-icons/tb'

import { useNiceMantineModal } from '@shared/_modals/use-nice-modal'
import { queryClient } from '@shared/api'
import { QueryKeys, useUpdateInfraProvider } from '@shared/api/hooks'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { handleFormErrors } from '@shared/utils/misc'

interface IProps {
    infraProvider: GetInfraProvidersCommand.Response['response']['providers'][number]
}

export const ViewInfraProviderModal = NiceModal.create((props: IProps) => {
    const { infraProvider } = props

    const modal = useModal()
    const { modalProps, hide } = useNiceMantineModal({ modal })

    const { t } = useTranslation()

    const form = useForm<UpdateInfraProviderCommand.RequestBody>({
        name: 'edit-infra-provider-form',
        mode: 'uncontrolled',
        validate: schemaResolver(UpdateInfraProviderCommand.RequestBodySchema)
    })

    const { mutate: updateInfraProvider, isPending: isUpdateInfraProviderPending } =
        useUpdateInfraProvider({
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

    useEffect(() => {
        if (infraProvider) {
            form.initialize({
                uuid: infraProvider.uuid,
                name: infraProvider.name,
                loginUrl: infraProvider.loginUrl,
                faviconLink: infraProvider.faviconLink
            })
        }
    }, [infraProvider])

    const handleSubmit = form.onSubmit(async (values) => {
        updateInfraProvider({
            variables: {
                uuid: values.uuid,
                name: values.name,
                faviconLink: values.faviconLink,
                loginUrl: values.loginUrl
            }
        })
    })

    return (
        <Modal
            {...modalProps}
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
                        label={t('common.name')}
                        placeholder={t('view-infra-provider.drawer.widget.enter-provider-name')}
                        required
                        {...form.getInputProps('name')}
                    />

                    <TextInput
                        description={t(
                            'view-infra-provider.drawer.widget.favicon-link-description'
                        )}
                        label={t('view-infra-provider.drawer.widget.favicon-link')}
                        placeholder={t('view-infra-provider.drawer.widget.enter-favicon-link')}
                        {...form.getInputProps('faviconLink')}
                    />

                    <TextInput
                        description={t('view-infra-provider.drawer.widget.login-url-description')}
                        label={t('view-infra-provider.drawer.widget.login-url')}
                        placeholder={t('view-infra-provider.drawer.widget.enter-login-url')}
                        {...form.getInputProps('loginUrl')}
                    />

                    <Button loading={isUpdateInfraProviderPending} type="submit" variant="soft">
                        {t('common.save')}
                    </Button>
                </Stack>
            </form>
        </Modal>
    )
})
