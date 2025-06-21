import { Button, Group, Modal, Stack, TextInput } from '@mantine/core'
import { DatePicker } from '@mantine/dates'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'

import { QueryKeys, useUpdateInfraBillingNode } from '@shared/api/hooks'
import { MODALS, useModalsStore } from '@entities/dashboard/modal-store'
import { queryClient } from '@shared/api'

import styles from './UpdateModal.module.css'

export function UpdateBillingDateModalWidget() {
    const { isOpen, internalState: billingNode } = useModalsStore(
        (state) => state.modals[MODALS.UPDATE_BILLING_DATE_MODAL]
    )
    const { close } = useModalsStore()
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)

    const { mutate: updateNode, isPending: isLoading } = useUpdateInfraBillingNode({
        mutationFns: {
            onSuccess: (data) => {
                queryClient.setQueryData(QueryKeys.infraBilling.getInfraBillingNodes.queryKey, data)

                close(MODALS.UPDATE_BILLING_DATE_MODAL)
                setSelectedDate(null)
            },
            onError: () => {}
        }
    })

    useEffect(() => {
        if (billingNode && isOpen) {
            setSelectedDate(new Date(billingNode.nextBillingAt))
        }
    }, [billingNode, isOpen])

    const handleSave = () => {
        if (!billingNode || !selectedDate) return

        updateNode({
            variables: {
                uuid: billingNode.uuid,
                // @ts-expect-error - TODO: fix ZOD schema
                nextBillingAt: selectedDate ? dayjs(selectedDate).toISOString() : undefined
            }
        })
    }

    const handleClose = () => {
        close(MODALS.UPDATE_BILLING_DATE_MODAL)

        setTimeout(() => {
            setSelectedDate(null)
        }, 300)
    }

    const handleDateChange = (value: null | string) => {
        setSelectedDate(value ? new Date(value) : null)
    }

    return (
        <Modal
            centered
            onClose={handleClose}
            opened={isOpen}
            size="auto"
            title="Update Billing Date"
        >
            <Stack gap="md">
                {billingNode && (
                    <Stack align="center" gap={0} justify="center">
                        <TextInput
                            label="Current Date"
                            mb="xs"
                            value={dayjs(new Date(billingNode.nextBillingAt)).format('D MMMM YYYY')}
                            w="100%"
                        />

                        <TextInput
                            label="New Date"
                            mb="xs"
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
                                    label: 'Today',
                                    value: dayjs().toISOString()
                                },
                                {
                                    label: 'Tomorrow',
                                    value: dayjs().add(1, 'day').toISOString()
                                },
                                {
                                    label: 'Next Month',
                                    value: dayjs(selectedDate ?? dayjs())
                                        .add(1, 'month')
                                        .toISOString()
                                }
                            ]}
                            value={selectedDate}
                        />
                    </Stack>
                )}

                <Group justify="flex-end" mt="lg">
                    <Button disabled={isLoading} onClick={handleClose} variant="default">
                        Cancel
                    </Button>
                    <Button
                        disabled={!selectedDate || !billingNode}
                        loading={isLoading}
                        onClick={handleSave}
                    >
                        Update Date
                    </Button>
                </Group>
            </Stack>
        </Modal>
    )
}
