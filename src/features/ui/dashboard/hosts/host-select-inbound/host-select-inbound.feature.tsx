import { ActionIcon, Button, Group, Stack, Text } from '@mantine/core'
import { TbFile, TbSettings } from 'react-icons/tb'
import { useDisclosure } from '@mantine/hooks'
import { useTranslation } from 'react-i18next'
import { PiTag } from 'react-icons/pi'

import { HostsConfigProfilesDrawer } from '@widgets/dashboard/hosts/hosts-config-profiles-drawer/hosts-config-profiles.drawer.widget'
import { XrayLogo } from '@shared/ui/logos'

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

    return (
        <Group
            gap="xs"
            justify="space-between"
            p="sm"
            style={{
                border: '1px solid var(--mantine-color-dark-5)',
                borderRadius: 'var(--mantine-radius-md)',
                backgroundColor: 'var(--mantine-color-dark-7)'
            }}
        >
            {activeProfile && activeInbound ? (
                <Group gap="sm" justify="space-between" w="100%">
                    <Group gap="xs" miw={0} style={{ flex: 1 }}>
                        <ActionIcon color="teal" size="sm" variant="subtle">
                            <XrayLogo size={16} />
                        </ActionIcon>

                        <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
                            <Text fw={500} size="sm" truncate>
                                {activeProfile.name}
                            </Text>
                            <Group gap="xs" wrap="nowrap">
                                <PiTag size={12} style={{ opacity: 0.7 }} />
                                <Text c="dimmed" size="xs" truncate>
                                    {activeInbound.tag}
                                </Text>
                            </Group>
                        </Stack>
                    </Group>

                    <Button
                        leftSection={<TbSettings size={14} />}
                        onClick={handlers.open}
                        size="xs"
                        variant="light"
                    >
                        {t('common.change')}
                    </Button>
                </Group>
            ) : (
                <Group gap="sm" justify="space-between" w="100%">
                    <Group gap="xs" style={{ flex: 1 }}>
                        <ActionIcon color="gray" size="sm" variant="subtle">
                            <TbFile size={14} />
                        </ActionIcon>

                        <Stack gap={2} style={{ flex: 1 }}>
                            <Text c="dimmed" size="sm">
                                {t('host-select-inbound.feature.no-inbound-selected')}
                            </Text>
                            <Text c="dimmed" size="xs">
                                {t(
                                    'host-select-inbound.feature.choose-an-inbound-to-apply-to-the-host'
                                )}
                            </Text>
                        </Stack>
                    </Group>

                    <Button
                        leftSection={<TbFile size={14} />}
                        onClick={handlers.open}
                        size="xs"
                        variant="light"
                    >
                        {t('common.select')}
                    </Button>
                </Group>
            )}

            <HostsConfigProfilesDrawer
                activeConfigProfileInbound={activeConfigProfileInbound || null}
                activeConfigProfileUuid={activeConfigProfileUuid || null}
                onClose={handlers.close}
                onSaveInbound={onSaveInbound}
                opened={opened}
            />
        </Group>
    )
}
