import { CreateInfraBillingNodeCommand } from '@remnawave/backend-contract'
import { zodResolver } from 'mantine-form-zod-resolver'
import { notifications } from '@mantine/notifications'
import { Button, Modal, Stack } from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { useTranslation } from 'react-i18next'
import { HiCalendar } from 'react-icons/hi'
import { TbServer } from 'react-icons/tb'
import { useForm } from '@mantine/form'
import dayjs from 'dayjs'

import { SelectInfraProviderShared } from '@shared/ui/infra-billing/select-infra-provider/select-infra-provider.shared'
import { SelectBillingNodeShared } from '@shared/ui/infra-billing/select-billing-node/select-billing-node.shared'
import { MODALS, useModalClose, useModalIsOpen } from '@entities/dashboard/modal-store'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { QueryKeys, useCreateInfraBillingNode } from '@shared/api/hooks'
import { handleFormErrors } from '@shared/utils/misc'
import { queryClient } from '@shared/api'

export function CreateInfraBillingNodeModalWidget() {
    const isOpen = useModalIsOpen(MODALS.CREATE_INFRA_BILLING_NODE_MODAL)
    const close = useModalClose(MODALS.CREATE_INFRA_BILLING_NODE_MODAL)

    const { t, i18n } = useTranslation()

    const form = useForm<CreateInfraBillingNodeCommand.Request>({
        name: 'create-infra-billing-node-form',
        mode: 'uncontrolled',
        validate: zodResolver(
            CreateInfraBillingNodeCommand.RequestSchema.omit({
                providerUuid: true,
                nextBillingAt: true,
                nodeUuid: true
            })
        ),
        initialValues: {
            nodeUuid: '',
            providerUuid: '',
            nextBillingAt: new Date()
        }
    })

    const { mutate: createInfraBillingNode, isPending: isCreateInfraBillingNodePending } =
        useCreateInfraBillingNode({
            mutationFns: {
                onSuccess: (data) => {
                    queryClient.setQueryData(
                        QueryKeys.infraBilling.getInfraBillingNodes.queryKey,
                        data
                    )

                    form.reset()

                    close()
                },
                onError: (error) => {
                    handleFormErrors(form, error)
                }
            }
        })

    const handleSubmit = form.onSubmit(async (values) => {
        if (!values.providerUuid || !values.nodeUuid) {
            notifications.show({
                title: t('create-infra-billing-node.modal.widget.error'),
                message: t(
                    'create-infra-billing-node.modal.widget.please-select-a-provider-and-billing-node'
                ),
                color: 'red'
            })

            return
        }
        createInfraBillingNode({
            variables: {
                providerUuid: values.providerUuid,
                nodeUuid: values.nodeUuid,
                // @ts-expect-error - TODO: fix ZOD schema
                nextBillingAt: values.nextBillingAt
                    ? dayjs(values.nextBillingAt).startOf('day').toISOString()
                    : undefined
            }
        })
    })

    return (
        <Modal
            centered
            keepMounted={false}
            onClose={() => {
                form.reset()
                close()
            }}
            opened={isOpen}
            overlayProps={{ backgroundOpacity: 0.6, blur: 0 }}
            padding="lg"
            size="md"
            title={
                <BaseOverlayHeader
                    IconComponent={TbServer}
                    iconVariant="gradient-teal"
                    title={t('create-infra-billing-node.modal.widget.billing-node')}
                />
            }
        >
            <form onSubmit={handleSubmit}>
                <Stack>
                    <Stack gap="md">
                        <SelectBillingNodeShared
                            selectedBillingNodeUuid={form.getValues().nodeUuid}
                            setSelectedBillingNodeUuid={(nodeUuid) => {
                                form.setValues({
                                    nodeUuid: nodeUuid ?? undefined
                                })
                                form.setTouched({
                                    nodeUuid: true
                                })
                                form.setDirty({
                                    nodeUuid: true
                                })
                            }}
                        />
                    </Stack>

                    <Stack gap="md">
                        <SelectInfraProviderShared
                            selectedInfraProviderUuid={form.getValues().providerUuid}
                            setSelectedInfraProviderUuid={(providerUuid) => {
                                form.setValues({
                                    providerUuid: providerUuid ?? undefined
                                })
                                form.setTouched({
                                    providerUuid: true
                                })
                                form.setDirty({
                                    providerUuid: true
                                })
                            }}
                        />
                    </Stack>

                    <DatePickerInput
                        data-autofocus
                        key={form.key('nextBillingAt')}
                        label={t('create-infra-billing-node.modal.widget.next-billing-at')}
                        locale={i18n.language}
                        required
                        valueFormat="D MMMM, YYYY"
                        {...form.getInputProps('nextBillingAt')}
                        description={t(
                            'create-infra-billing-node.modal.widget.next-billing-at-description'
                        )}
                        highlightToday
                        leftSection={<HiCalendar size="16px" />}
                        minDate={dayjs().subtract(1, 'day').toDate()}
                    />

                    <Button loading={isCreateInfraBillingNodePending} type="submit">
                        {t('common.create')}
                    </Button>
                </Stack>
            </form>
        </Modal>
    )
}
