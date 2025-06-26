import { CreateInfraBillingHistoryRecordCommand } from '@remnawave/backend-contract'
import { Button, Modal, NumberInput, Stack } from '@mantine/core'
import { HiCalendar, HiCurrencyDollar } from 'react-icons/hi'
import { zodResolver } from 'mantine-form-zod-resolver'
import { notifications } from '@mantine/notifications'
import { DatePickerInput } from '@mantine/dates'
import { useTranslation } from 'react-i18next'
import { useForm } from '@mantine/form'
import dayjs from 'dayjs'

import { SelectInfraProviderShared } from '@shared/ui/infra-billing/select-infra-provider/select-infra-provider.shared'
import { QueryKeys, useCreateInfraBillingHistoryRecord } from '@shared/api/hooks'
import { MODALS, useModalsStore } from '@entities/dashboard/modal-store'
import { handleFormErrors } from '@shared/utils/misc'
import { queryClient } from '@shared/api'

export function CreateInfraBillingRecordDrawerWidget() {
    const { isOpen } = useModalsStore(
        (state) => state.modals[MODALS.CREATE_INFRA_BILLING_RECORD_DRAWER]
    )

    const { close } = useModalsStore()
    const { t } = useTranslation()

    const form = useForm<CreateInfraBillingHistoryRecordCommand.Request>({
        name: 'create-infra-billing-record-form',
        mode: 'uncontrolled',
        validate: zodResolver(
            CreateInfraBillingHistoryRecordCommand.RequestSchema.omit({
                billedAt: true,
                providerUuid: true,
                amount: true
            })
        ),
        initialValues: {
            billedAt: new Date(),
            providerUuid: '',
            amount: NaN
        }
    })

    const { mutate: createInfraBillingRecord, isPending: isCreateInfraBillingRecordPending } =
        useCreateInfraBillingHistoryRecord({
            mutationFns: {
                onSuccess: () => {
                    queryClient.refetchQueries({
                        queryKey: QueryKeys.infraBilling.getInfraBillingHistoryRecords({
                            start: 0,
                            size: 50
                        }).queryKey
                    })

                    queryClient.refetchQueries({
                        queryKey: QueryKeys.infraBilling.getInfraProviders.queryKey
                    })

                    queryClient.refetchQueries({
                        queryKey: QueryKeys.infraBilling.getInfraBillingNodes.queryKey
                    })

                    form.reset()

                    close(MODALS.CREATE_INFRA_BILLING_RECORD_DRAWER)
                },
                onError: (error) => {
                    handleFormErrors(form, error)
                }
            }
        })

    const handleSubmit = form.onSubmit(async (values) => {
        if (!values.providerUuid) {
            notifications.show({
                title: t('create-infra-billing-record.modal.widget.error'),
                message: t('create-infra-billing-record.modal.widget.please-select-a-provider'),
                color: 'red'
            })

            return
        }
        createInfraBillingRecord({
            variables: {
                // @ts-expect-error - TODO: fix ZOD schema
                billedAt: values.billedAt
                    ? dayjs(values.billedAt).startOf('day').toISOString()
                    : undefined,
                providerUuid: values.providerUuid,
                amount: values.amount
            }
        })
    })

    return (
        <Modal
            centered
            keepMounted={false}
            onClose={() => {
                form.reset()

                close(MODALS.CREATE_INFRA_BILLING_RECORD_DRAWER)
            }}
            opened={isOpen}
            overlayProps={{ backgroundOpacity: 0.6, blur: 0 }}
            padding="lg"
            size="md"
            title={t('create-infra-billing-record.modal.widget.bill-record')}
        >
            <form onSubmit={handleSubmit}>
                <Stack>
                    <Stack gap="md" mb={-10}>
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
                        key={form.key('billedAt')}
                        label={t('create-infra-billing-record.modal.widget.billed-at')}
                        required
                        valueFormat="D MMMM, YYYY"
                        {...form.getInputProps('billedAt')}
                        description={t(
                            'create-infra-billing-record.modal.widget.the-date-and-time-when-the-bill-was-paid'
                        )}
                        highlightToday
                        leftSection={<HiCalendar size="1rem" />}
                        maxDate={dayjs().add(1, 'day').toDate()}
                    />

                    <NumberInput
                        allowNegative={false}
                        decimalScale={2}
                        description={t(
                            'create-infra-billing-record.modal.widget.payment-amount-usd'
                        )}
                        fixedDecimalScale
                        key={form.key('amount')}
                        label={t('create-infra-billing-record.modal.widget.amount')}
                        leftSection={<HiCurrencyDollar size="1.25rem" />}
                        min={0.01}
                        required
                        thousandSeparator=","
                        {...form.getInputProps('amount')}
                    />

                    <Button loading={isCreateInfraBillingRecordPending} type="submit">
                        {t('create-infra-billing-record.modal.widget.create')}
                    </Button>
                </Stack>
            </form>
        </Modal>
    )
}
