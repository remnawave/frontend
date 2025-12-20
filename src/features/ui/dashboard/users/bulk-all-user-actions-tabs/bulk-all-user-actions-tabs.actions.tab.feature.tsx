import { Button, Divider, Group, NumberInput, Paper, Stack, Text } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { PiClockUser } from 'react-icons/pi'
import { modals } from '@mantine/modals'

import { useBulkAllExtendUsersExpirationDate, useBulkAllResetTrafficUsers } from '@shared/api/hooks'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'

import { IProps } from './interfaces/props.interface'

export const BulkAllUserActionsActionsTabFeature = (props: IProps) => {
    const { t } = useTranslation()

    const { cleanUpDrawer } = props

    const { mutate: resetTraffic, isPending: isResetTrafficPending } = useBulkAllResetTrafficUsers({
        mutationFns: {
            onSuccess: () => {
                cleanUpDrawer()
            }
        }
    })

    const { mutate: extendExpirationDate, isPending: isExtendExpirationDatePending } =
        useBulkAllExtendUsersExpirationDate({
            mutationFns: {
                onSuccess: () => {
                    cleanUpDrawer()
                }
            }
        })

    const handleResetTraffic = () => {
        modals.openConfirmModal({
            title: t('common.confirm-action'),
            centered: true,
            children: t('common.confirm-action-description'),
            labels: {
                confirm: t('bulk-all-user-actions-tabs.actions.tab.feature.reset'),
                cancel: t('common.cancel')
            },
            confirmProps: { color: 'red' },
            onConfirm: () => {
                resetTraffic({})
            }
        })
    }

    const handleExtendExpirationDate = () => {
        let userInput = 1

        modals.open({
            title: (
                <BaseOverlayHeader
                    IconComponent={PiClockUser}
                    iconVariant="gradient-teal"
                    title={t('bulk-user-actions.actions.tab.feature.extend-expiration-date')}
                    titleOrder={5}
                />
            ),
            centered: true,
            children: (
                <>
                    <NumberInput
                        allowDecimal={false}
                        allowNegative={false}
                        data-autofocus
                        decimalScale={0}
                        defaultValue={1}
                        description={t(
                            'bulk-user-actions.actions.tab.feature.enter-the-number-of-days-to-extend-the-expiration-date'
                        )}
                        label={t('bulk-user-actions.actions.tab.feature.extend-days')}
                        max={9999}
                        min={1}
                        onChange={(value) => {
                            userInput = Number(value)
                        }}
                        required
                        step={1}
                    />
                    <Button
                        fullWidth
                        mt="md"
                        onClick={() => {
                            modals.closeAll()
                            extendExpirationDate({
                                variables: {
                                    extendDays: userInput
                                }
                            })
                        }}
                    >
                        {t('bulk-user-actions.actions.tab.feature.extend')}
                    </Button>
                </>
            )
        })
    }

    return (
        <Stack gap="md">
            <Text c="dimmed" size="sm">
                {t('bulk-all-user-actions-tabs.actions.tab.feature.perform-actions-on-all-users')}
            </Text>

            <Paper bg="dark.6" p="md" shadow="sm" withBorder>
                <Stack gap="md">
                    <Group align="center" justify="space-between" wrap="nowrap">
                        <Stack gap={4}>
                            <Group gap="xs">
                                <PiClockUser size={20} />
                                <Text fw={600} size="md">
                                    {t(
                                        'bulk-user-actions.actions.tab.feature.extend-expiration-date'
                                    )}
                                </Text>
                            </Group>
                            <Text c="dimmed" size="sm">
                                {t(
                                    'bulk-user-actions.actions.tab.feature.extend-expiration-date-description'
                                )}
                            </Text>
                        </Stack>
                    </Group>
                </Stack>

                <Divider mb="md" mt="xs" />

                <Group justify="flex-end">
                    <Button
                        loading={isExtendExpirationDatePending}
                        onClick={handleExtendExpirationDate}
                        size="sm"
                        style={{
                            transition: 'all 0.2s ease'
                        }}
                        variant="light"
                    >
                        {t('bulk-user-actions.actions.tab.feature.extend')}
                    </Button>
                </Group>
            </Paper>

            <Paper bg="dark.6" p="md" shadow="sm" withBorder>
                <Stack gap="md">
                    <Group align="center" justify="space-between" wrap="nowrap">
                        <Stack gap={4}>
                            <Group gap="xs">
                                <PiClockUser size={20} />
                                <Text fw={600} size="md">
                                    {t(
                                        'bulk-all-user-actions-tabs.actions.tab.feature.reset-traffic'
                                    )}
                                </Text>
                            </Group>
                            <Text c="dimmed" size="sm">
                                {t(
                                    'bulk-all-user-actions-tabs.actions.tab.feature.reset-traffic-description'
                                )}
                            </Text>
                        </Stack>
                    </Group>
                </Stack>

                <Divider mb="md" mt="xs" />

                <Group justify="flex-end">
                    <Button
                        color="cyan"
                        loading={isResetTrafficPending}
                        onClick={handleResetTraffic}
                        variant="light"
                    >
                        {t('bulk-all-user-actions-tabs.actions.tab.feature.reset')}
                    </Button>
                </Group>
            </Paper>
        </Stack>
    )
}
