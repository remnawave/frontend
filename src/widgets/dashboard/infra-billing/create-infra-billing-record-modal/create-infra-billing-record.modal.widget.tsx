import { CreateInfraBillingHistoryRecordCommand } from '@remnawave/backend-contract'
import { Button, Modal, NumberInput, Stack } from '@mantine/core'
import { HiCalendar, HiCurrencyDollar } from 'react-icons/hi'
import { zodResolver } from 'mantine-form-zod-resolver'
import { notifications } from '@mantine/notifications'
import { DatePickerInput } from '@mantine/dates'
import { useTranslation } from 'react-i18next'
import { TbInvoice } from 'react-icons/tb'
import { useForm } from '@mantine/form'
import dayjs from 'dayjs'

import { SelectInfraProviderShared } from '@shared/ui/infra-billing/select-infra-provider/select-infra-provider.shared'
import { MODALS, useModalClose, useModalIsOpen } from '@entities/dashboard/modal-store'
import { QueryKeys, useCreateInfraBillingHistoryRecord } from '@shared/api/hooks'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { handleFormErrors } from '@shared/utils/misc'
import { queryClient } from '@shared/api'

export function CreateInfraBillingRecordDrawerWidget() {
    const isOpen = useModalIsOpen(MODALS.CREATE_INFRA_BILLING_RECORD_DRAWER)
    const close = useModalClose(MODALS.CREATE_INFRA_BILLING_RECORD_DRAWER)

    const { t } = useTranslation()

    const form = useForm<CreateInfraBillingHistoryRecordCommand.Request>({
        name: 'create-infra-billing-record-form',
        mode: 'uncontrolled',
        validate: zodResolver(
            CreateInfraBillingHistoryRecordCommand.RequestSchema.omit({
                billedAt: true,
                providerUuid: true
            })
        ),
        initialValues: {
            billedAt: dayjs().startOf('day').toDate(),
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

                    close()
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
            keepMounted={false}
            onClose={() => {
                form.reset()

                close()
            }}
            opened={isOpen}
            title={
                <BaseOverlayHeader
                    IconComponent={TbInvoice}
                    iconVariant="gradient-teal"
                    title={t('create-infra-billing-record.modal.widget.bill-record')}
                />
            }
        >
            <form onSubmit={handleSubmit}>
                <Stack>
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

                    <DatePickerInput
                        description={t(
                            'create-infra-billing-record.modal.widget.the-date-and-time-when-the-bill-was-paid'
                        )}
                        highlightToday
                        key={form.key('billedAt')}
                        label={t('create-infra-billing-record.modal.widget.billed-at')}
                        leftSection={<HiCalendar size="16px" />}
                        maxDate={dayjs().add(1, 'day').toDate()}
                        required
                        valueFormat="D MMMM, YYYY"
                        {...form.getInputProps('billedAt')}
                    />

                    <NumberInput
                        allowNegative={false}
                        data-autofocus
                        description={t(
                            'create-infra-billing-record.modal.widget.payment-amount-usd'
                        )}
                        fixedDecimalScale
                        key={form.key('amount')}
                        label={t('create-infra-billing-record.modal.widget.amount')}
                        leftSection={<HiCurrencyDollar size="20px" />}
                        required
                        thousandSeparator=","
                        {...form.getInputProps('amount')}
                    />

                    <Button loading={isCreateInfraBillingRecordPending} type="submit">
                        {t('common.create')}
                    </Button>
                </Stack>
            </form>
        </Modal>
    )
}
