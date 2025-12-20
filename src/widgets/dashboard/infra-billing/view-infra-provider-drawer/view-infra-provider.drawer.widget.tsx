import { UpdateInfraProviderCommand } from '@remnawave/backend-contract'
import { Button, Drawer, Stack, TextInput } from '@mantine/core'
import { zodResolver } from 'mantine-form-zod-resolver'
import { useTranslation } from 'react-i18next'
import { TbServer } from 'react-icons/tb'
import { useForm } from '@mantine/form'
import { useEffect } from 'react'

import { MODALS, useModalClose, useModalState } from '@entities/dashboard/modal-store'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { QueryKeys, useUpdateInfraProvider } from '@shared/api/hooks'
import { handleFormErrors } from '@shared/utils/misc'
import { queryClient } from '@shared/api'

export function ViewInfraProviderDrawerWidget() {
    const { isOpen, internalState: infraProvider } = useModalState(
        MODALS.VIEW_INFRA_PROVIDER_DRAWER
    )
    const close = useModalClose(MODALS.VIEW_INFRA_PROVIDER_DRAWER)

    const { t } = useTranslation()

    const form = useForm<UpdateInfraProviderCommand.Request>({
        name: 'edit-infra-provider-form',
        mode: 'uncontrolled',
        validate: zodResolver(UpdateInfraProviderCommand.RequestSchema)
    })

    const { mutate: updateInfraProvider, isPending: isUpdateInfraProviderPending } =
        useUpdateInfraProvider({
            mutationFns: {
                onSuccess: () => {
                    queryClient.refetchQueries({
                        queryKey: QueryKeys.infraBilling.getInfraProviders.queryKey
                    })

                    close()
                },
                onError: (error) => {
                    handleFormErrors(form, error)
                }
            }
        })

    useEffect(() => {
        if (infraProvider) {
            form.setValues({
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
        <Drawer
            keepMounted={false}
            onClose={close}
            opened={isOpen}
            overlayProps={{ backgroundOpacity: 0.6, blur: 0 }}
            padding="lg"
            position="right"
            size="md"
            title={
                <BaseOverlayHeader
                    IconComponent={TbServer}
                    iconVariant="gradient-teal"
                    title={t('view-infra-provider.drawer.widget.infra-provider')}
                />
            }
        >
            <form onSubmit={handleSubmit}>
                <Stack>
                    <TextInput
                        description={t('view-infra-provider.drawer.widget.name-description')}
                        label={t('view-infra-provider.drawer.widget.name')}
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

                    <Button loading={isUpdateInfraProviderPending} type="submit">
                        {t('view-infra-provider.drawer.widget.save-changes')}
                    </Button>
                </Stack>
            </form>
        </Drawer>
    )
}
