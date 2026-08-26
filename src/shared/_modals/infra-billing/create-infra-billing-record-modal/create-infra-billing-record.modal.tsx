import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { Button, Modal, NumberInput, Stack } from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { useForm, schemaResolver } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { CreateInfraBillingRecordCommand } from '@remnawave/backend-contract'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { HiCalendar, HiCurrencyDollar } from 'react-icons/hi'
import { TbInvoice } from 'react-icons/tb'

import { useNiceMantineModal } from '@shared/_modals/use-nice-modal'
import { queryClient } from '@shared/api'
import { QueryKeys, useCreateInfraBillingHistoryRecord } from '@shared/api/hooks'
import { SelectInfraProviderShared } from '@shared/ui/infra-billing/select-infra-provider/select-infra-provider.shared'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { handleFormErrors } from '@shared/utils/misc'
import { toUtcDayISO } from '@shared/utils/time-utils'

export const CreateInfraBillingRecordModal = NiceModal.create(() => {
    const modal = useModal()
    const { modalProps, hide } = useNiceMantineModal({ modal })

    const { t, i18n } = useTranslation()

    const form = useForm<CreateInfraBillingRecordCommand.RequestBody>({
        name: 'create-infra-billing-record-form',
        mode: 'uncontrolled',
        validate: schemaResolver(
            CreateInfraBillingRecordCommand.RequestBodySchema.omit({
                billedAt: true,
                providerUuid: true
            })
        ),
        initialValues: {
            billedAt: dayjs().startOf('day').toDate(),
            amount: NaN,
            // @ts-expect-error - ignore
            providerUuid: undefined
        }
    })

    const { mutate: createInfraBillingRecord, isPending: isCreateInfraBillingRecordPending } =
        useCreateInfraBillingHistoryRecord({
            mutationFns: {
                onSuccess: () => {
                    queryClient.refetchQueries({
                        queryKey: QueryKeys.infraBilling.getInfraBillingHistoryRecords._def
                    })

                    queryClient.refetchQueries({
                        queryKey: QueryKeys.infraBilling.getInfraProviders.queryKey
                    })

                    queryClient.refetchQueries({
                        queryKey: QueryKeys.infraBilling.getInfraBillingNodes.queryKey
                    })

                    form.reset()

                    hide()
                },
                onError: (error) => {
                    handleFormErrors(form, error)
                }
            }
        })

    const handleSubmit = form.onSubmit(async (values) => {
        if (!values.providerUuid) {
            notifications.show({
                title: t('common.message.error'),
                message: t('create-infra-billing-record.modal.widget.please-select-a-provider'),
                color: 'red'
            })

            return
        }
        createInfraBillingRecord({
            variables: {
                // @ts-expect-error - TODO: fix ZOD schema
                billedAt: toUtcDayISO(values.billedAt),
                providerUuid: values.providerUuid,
                amount: values.amount
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
                    IconComponent={TbInvoice}
                    iconVariant="soft"
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
                        locale={i18n.language}
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

                    <Button
                        loading={isCreateInfraBillingRecordPending}
                        type="submit"
                        variant="soft"
                    >
                        {t('common.action.create')}
                    </Button>
                </Stack>
            </form>
        </Modal>
    )
})
