import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { Button, Group, Modal, Stack, TextInput } from '@mantine/core'
import { DatePicker } from '@mantine/dates'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TbCalendar } from 'react-icons/tb'

import { useNiceMantineModal } from '@shared/_modals/use-nice-modal'
import { queryClient } from '@shared/api'
import { QueryKeys, useUpdateInfraBillingNode } from '@shared/api/hooks'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { toUtcDayISO } from '@shared/utils/time-utils'

import styles from './update-billing-date.module.css'

interface IProps {
    callback?: () => void
    nextBillingAt?: Date
    uuids: string[]
}

export const UpdateBillingDateModal = NiceModal.create((props: IProps) => {
    const { callback, nextBillingAt, uuids } = props

    const modal = useModal()
    const { modalProps, hide } = useNiceMantineModal({ modal })

    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const { t } = useTranslation()

    const { mutate: updateNode, isPending: isLoading } = useUpdateInfraBillingNode({
        mutationFns: {
            onSuccess: (data) => {
                queryClient.setQueryData(QueryKeys.infraBilling.getInfraBillingNodes.queryKey, data)

                if (callback) {
                    callback()
                }

                hide()
            },
            onError: () => {}
        }
    })

    useEffect(() => {
        if (nextBillingAt && uuids.length === 1) {
            setSelectedDate(new Date(nextBillingAt))
        } else {
            setSelectedDate(new Date())
        }
    }, [nextBillingAt, uuids])

    const handleSave = () => {
        if (!selectedDate) return

        updateNode({
            variables: {
                uuids,
                // @ts-expect-error - TODO: fix ZOD schema
                nextBillingAt: toUtcDayISO(selectedDate)
            }
        })
    }

    const handleDateChange = (value: null | string) => {
        setSelectedDate(value ? new Date(value) : null)
    }

    return (
        <Modal
            {...modalProps}
            size="auto"
            title={
                <BaseOverlayHeader
                    iconColor="teal"
                    IconComponent={TbCalendar}
                    iconVariant="soft"
                    title={t('update-billing-date-modal.widget.update-billing-date')}
                />
            }
        >
            <Stack gap="md">
                <Stack align="center" gap={0} justify="center">
                    {uuids.length === 1 && nextBillingAt && (
                        <TextInput
                            label={t('update-billing-date-modal.widget.current-date')}
                            mb="xs"
                            readOnly
                            value={dayjs(new Date(nextBillingAt)).format('D MMMM YYYY')}
                            w="100%"
                        />
                    )}

                    <TextInput
                        label={t('update-billing-date-modal.widget.new-date')}
                        mb="xs"
                        readOnly
                        value={dayjs(selectedDate).format('D MMMM YYYY')}
                        w="100%"
                    />
                    <DatePicker
                        classNames={styles}
                        defaultDate={selectedDate ?? undefined}
                        maxDate={dayjs().add(2, 'years').toDate()}
                        onChange={handleDateChange}
                        presets={[
                            {
                                label: t('common.field.today'),
                                value: dayjs().toISOString()
                            },
                            {
                                label: t('update-billing-date-modal.widget.tomorrow'),
                                value: dayjs().add(1, 'day').toISOString()
                            },
                            {
                                label: t('update-billing-date-modal.widget.next-month'),
                                value: dayjs(selectedDate ?? dayjs())
                                    .add(1, 'month')
                                    .toISOString()
                            }
                        ]}
                        value={selectedDate}
                    />
                </Stack>

                <Group justify="flex-end" mt="lg">
                    <Button disabled={!selectedDate} loading={isLoading} onClick={handleSave}>
                        {t('common.action.update')}
                    </Button>
                </Group>
            </Stack>
        </Modal>
    )
})
