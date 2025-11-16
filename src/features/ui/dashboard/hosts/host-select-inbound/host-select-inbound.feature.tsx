import { ActionIcon, Box, Button, Group, Stack, Text } from '@mantine/core'
import { TbFile, TbSettings } from 'react-icons/tb'
import { useDisclosure } from '@mantine/hooks'
import { useTranslation } from 'react-i18next'
import cx from 'clsx'

import { HostsConfigProfilesDrawer } from '@widgets/dashboard/hosts/hosts-config-profiles-drawer/hosts-config-profiles.drawer.widget'
import { XrayLogo } from '@shared/ui/logos'

import classes from './host-select-inbound.module.css'
import { IProps } from './interfaces'

export function HostSelectInboundFeature(props: IProps) {
    const { activeConfigProfileInbound, activeConfigProfileUuid, configProfiles, onSaveInbound } =
        props

    const [opened, handlers] = useDisclosure(false)
    const { t } = useTranslation()

    const activeProfile = configProfiles.find((profile) => profile.uuid === activeConfigProfileUuid)
    const activeInbound = activeProfile?.inbounds.find(
        (inbound) => inbound.uuid === activeConfigProfileInbound
    )

    const hasInbound = !!(activeProfile && activeInbound)

    return (
        <Box
            className={cx(classes.cardWrapper, {
                [classes.cardWrapperInactive]: !hasInbound
            })}
        >
            <Box className={classes.card}>
                <Box
                    className={cx({
                        [classes.topAccent]: hasInbound,
                        [classes.topAccentInactive]: !hasInbound
                    })}
                />
                <Box className={classes.glowEffect} />

                <Box className={classes.content} onClick={handlers.open}>
                    {activeProfile && activeInbound ? (
                        <Group gap="sm" justify="space-between" w="100%">
                            <Group gap="xs" miw={0} style={{ flex: 1 }}>
                                <Box className={classes.iconWrapper}>
                                    <ActionIcon color="teal" size="lg" variant="light">
                                        <XrayLogo size={24} />
                                    </ActionIcon>
                                </Box>

                                <Stack gap={0} style={{ flex: 1, minWidth: 0 }}>
                                    <Text ff="monospace" fw={600} size="md" truncate>
                                        {activeProfile.name}
                                    </Text>

                                    <Text c="dimmed" fw={600} size="sm" truncate>
                                        {activeInbound.tag}
                                    </Text>
                                </Stack>
                            </Group>

                            <Button
                                leftSection={<TbSettings size={14} />}
                                size="xs"
                                variant="light"
                                visibleFrom="md"
                            >
                                {t('common.change')}
                            </Button>
                        </Group>
                    ) : (
                        <Group gap="sm" justify="space-between" w="100%">
                            <Group gap="xs" style={{ flex: 1 }}>
                                <Box className={classes.iconWrapper}>
                                    <ActionIcon color="gray" size="lg" variant="light">
                                        <TbFile size={20} />
                                    </ActionIcon>
                                </Box>

                                <Stack gap={2} style={{ flex: 1 }}>
                                    <Text c="dimmed" fw={500} size="sm">
                                        {t('host-select-inbound.feature.no-inbound-selected')}
                                    </Text>
                                    <Text c="dimmed" size="xs">
                                        {t(
                                            'host-select-inbound.feature.choose-an-inbound-to-apply-to-the-host'
                                        )}
                                    </Text>
                                </Stack>
                            </Group>

                            <Button leftSection={<TbFile size={14} />} size="xs" variant="light">
                                {t('common.select')}
                            </Button>
                        </Group>
                    )}
                </Box>
            </Box>

            <HostsConfigProfilesDrawer
                activeConfigProfileInbound={activeConfigProfileInbound || null}
                activeConfigProfileUuid={activeConfigProfileUuid || null}
                onClose={handlers.close}
                onSaveInbound={onSaveInbound}
                opened={opened}
            />
        </Box>
    )
}
