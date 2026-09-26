import { ActionIcon, Box, Group, Stack, Text } from '@mantine/core'
import cx from 'clsx'
import { useTranslation } from 'react-i18next'
import { TbAlertTriangle, TbChevronRight } from 'react-icons/tb'

import { showModal } from '@shared/_modals/show-modal'
import { XrayLogo } from '@shared/ui/logos'

import classes from './host-select-inbound.module.css'
import { IProps } from './interfaces'

export function HostSelectInboundFeature(props: IProps) {
    const {
        activeConfigProfileInbound,
        activeConfigProfileUuid,
        configProfiles,
        error,
        onSaveInbound
    } = props

    const { t } = useTranslation()

    const activeProfile = configProfiles.find((profile) => profile.uuid === activeConfigProfileUuid)
    const activeInbound = activeProfile?.inbounds.find(
        (inbound) => inbound.uuid === activeConfigProfileInbound
    )

    const hasInbound = !!(activeProfile && activeInbound)

    const openPicker = () =>
        showModal('hosts_hostsConfigProfilesDrawer', {
            activeConfigProfileInbound: activeConfigProfileInbound || null,
            activeConfigProfileUuid: activeConfigProfileUuid || null,
            onSaveInbound
        })

    return (
        <Stack gap={6}>
            <Box
                aria-label={
                    hasInbound
                        ? t('common.action.change')
                        : t('host-select-inbound.feature.choose-an-inbound-to-apply-to-the-host')
                }
                className={cx(classes.card, { [classes.cardEmpty]: !!error })}
                onClick={openPicker}
                onKeyDown={(event) => {
                    if (event.key !== 'Enter' && event.key !== ' ') return

                    event.preventDefault()
                    openPicker()
                }}
                role="button"
                tabIndex={0}
            >
                <Group gap="sm" justify="space-between" wrap="nowrap">
                    <Group gap="sm" miw={0} wrap="nowrap">
                        <ActionIcon
                            color={hasInbound ? 'teal' : 'gray'}
                            component="div"
                            size="lg"
                            variant="light"
                        >
                            {hasInbound ? <XrayLogo size={22} /> : <TbAlertTriangle size={20} />}
                        </ActionIcon>

                        <Stack gap={0} miw={0}>
                            <Text
                                ff={hasInbound ? 'monospace' : undefined}
                                fw={600}
                                size="sm"
                                truncate
                            >
                                {hasInbound
                                    ? activeProfile.name
                                    : t('common.message.no-inbound-selected')}
                            </Text>

                            <Text c="dimmed" fw={500} size="xs" truncate>
                                {hasInbound
                                    ? activeInbound.tag
                                    : t(
                                          'host-select-inbound.feature.choose-an-inbound-to-apply-to-the-host'
                                      )}
                            </Text>
                        </Stack>
                    </Group>

                    <TbChevronRight className={classes.affordance} size={18} />
                </Group>
            </Box>
        </Stack>
    )
}
