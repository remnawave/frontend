import { CreateInfraProviderCommand } from '@remnawave/backend-contract'
import { Button, Drawer, Stack, TextInput } from '@mantine/core'
import { zodResolver } from 'mantine-form-zod-resolver'
import { useForm } from '@mantine/form'

import { MODALS, useModalsStore } from '@entities/dashboard/modal-store'
import { QueryKeys, useCreateInfraProvider } from '@shared/api/hooks'
import { handleFormErrors } from '@shared/utils/misc'
import { queryClient } from '@shared/api'

export function CreateInfraProviderDrawerWidget() {
    const { isOpen } = useModalsStore((state) => state.modals[MODALS.CREATE_INFRA_PROVIDER_DRAWER])

    const { close } = useModalsStore()

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

                    close(MODALS.CREATE_INFRA_PROVIDER_DRAWER)
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
            onClose={() => close(MODALS.CREATE_INFRA_PROVIDER_DRAWER)}
            opened={isOpen}
            overlayProps={{ backgroundOpacity: 0.6, blur: 0 }}
            padding="lg"
            position="right"
            size="md"
            title={'Infra Provider'}
        >
            <form onSubmit={handleSubmit}>
                <Stack>
                    <TextInput
                        description="The name of the provider. This is used to identify the provider in the UI."
                        label="Name"
                        placeholder="Enter provider name"
                        required
                        {...form.getInputProps('name')}
                    />

                    <TextInput
                        description="The favicon link is the link to the favicon of the provider. It is used to display the favicon of the provider in the UI. You can just enter the domain name."
                        label="Favicon Link"
                        placeholder="https://hetzner.com"
                        required
                        {...form.getInputProps('faviconLink')}
                    />

                    <TextInput
                        description="The login URL is the URL of the login page of the provider. It will help you quickly go to the login page of the provider."
                        label="Login URL"
                        placeholder="https://cloud.hetzner.com"
                        required
                        {...form.getInputProps('loginUrl')}
                    />

                    <Button loading={isCreateInfraProviderPending} type="submit">
                        Create
                    </Button>
                </Stack>
            </form>
        </Drawer>
    )
}
