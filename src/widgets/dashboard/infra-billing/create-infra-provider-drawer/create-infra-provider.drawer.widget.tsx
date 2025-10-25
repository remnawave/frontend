import { CreateInfraProviderCommand } from '@remnawave/backend-contract'
import { Button, Drawer, Stack, TextInput } from '@mantine/core'
import { zodResolver } from 'mantine-form-zod-resolver'
import { useTranslation } from 'react-i18next'
import { useForm } from '@mantine/form'

import { MODALS, useModalClose, useModalIsOpen } from '@entities/dashboard/modal-store'
import { QueryKeys, useCreateInfraProvider } from '@shared/api/hooks'
import { handleFormErrors } from '@shared/utils/misc'
import { queryClient } from '@shared/api'

export function CreateInfraProviderDrawerWidget() {
    const isOpen = useModalIsOpen(MODALS.CREATE_INFRA_PROVIDER_DRAWER)
    const close = useModalClose(MODALS.CREATE_INFRA_PROVIDER_DRAWER)

    const { t } = useTranslation()

    const form = useForm<CreateInfraProviderCommand.Request>({
        name: 'create-infra-provider-form',
        mode: 'uncontrolled',
        validate: zodResolver(CreateInfraProviderCommand.RequestSchema)
    })

    const { mutate: createInfraProvider, isPending: isCreateInfraProviderPending } =
        useCreateInfraProvider({
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
        <Drawer
            keepMounted={false}
            onClose={close}
            onExitTransitionEnd={() => {
                form.reset()
            }}
            opened={isOpen}
            overlayProps={{ backgroundOpacity: 0.6, blur: 0 }}
            padding="lg"
            position="right"
            size="md"
            title={t('view-infra-provider.drawer.widget.infra-provider')}
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
                        {t('common.create')}
                    </Button>
                </Stack>
            </form>
        </Drawer>
    )
}
