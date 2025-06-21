import { UpdateInfraProviderCommand } from '@remnawave/backend-contract'
import { Button, Drawer, Stack, TextInput } from '@mantine/core'
import { zodResolver } from 'mantine-form-zod-resolver'
import { useForm } from '@mantine/form'
import { useEffect } from 'react'

import { MODALS, useModalsStore } from '@entities/dashboard/modal-store'
import { QueryKeys, useUpdateInfraProvider } from '@shared/api/hooks'
import { handleFormErrors } from '@shared/utils/misc'
import { queryClient } from '@shared/api'

export function ViewInfraProviderDrawerWidget() {
    const { isOpen, internalState: infraProvider } = useModalsStore(
        (state) => state.modals[MODALS.VIEW_INFRA_PROVIDER_DRAWER]
    )
    const { close } = useModalsStore()

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

                    close(MODALS.VIEW_INFRA_PROVIDER_DRAWER)
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
            onClose={() => close(MODALS.VIEW_INFRA_PROVIDER_DRAWER)}
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
                        description="The favicon link is the link to the favicon of the provider. It is used to display the favicon of the provider in the UI."
                        label="Favicon Link"
                        placeholder="Enter favicon link"
                        {...form.getInputProps('faviconLink')}
                    />

                    <TextInput
                        description="The login URL is the URL of the login page of the provider. It will help you quickly go to the login page of the provider."
                        label="Login URL"
                        placeholder="Enter login URL"
                        {...form.getInputProps('loginUrl')}
                    />

                    <Button loading={isUpdateInfraProviderPending} type="submit">
                        Save Changes
                    </Button>
                </Stack>
            </form>
        </Drawer>
    )
}
