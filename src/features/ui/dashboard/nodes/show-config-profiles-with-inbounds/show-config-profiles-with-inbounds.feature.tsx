/* eslint-disable @stylistic/indent */

import { Badge, Button, Flex, Group, Paper, Stack, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useTranslation } from 'react-i18next'
import { TbFile, TbTag } from 'react-icons/tb'
import { useMemo } from 'react'
import clsx from 'clsx'

import { ConfigProfilesDrawer } from '@widgets/dashboard/nodes/config-profiles-drawer/config-profiles.drawer.widget'
import { XrayLogo } from '@shared/ui/logos'

import { IProps } from './interfaces'

export function ShowConfigProfilesWithInboundsFeature(props: IProps) {
    const {
        activeConfigProfileInbounds,
        activeConfigProfileUuid,
        configProfiles,
        onSaveInbounds,
        errors
    } = props

    const [opened, handlers] = useDisclosure(false)
    const { t } = useTranslation()

    const activeProfileInboundsPorts = useMemo(() => {
        const activeProfile = configProfiles?.find(
            (profile) => profile.uuid === activeConfigProfileUuid
        )

        const ports = activeConfigProfileInbounds
            ?.map((inbound) => {
                const inboundConfig = activeProfile?.inbounds.find((i) => i.uuid === inbound)
                return inboundConfig?.port ?? null
            })
            .filter((port) => port !== null)

        return [...new Set(ports)]
    }, [activeConfigProfileInbounds, activeConfigProfileUuid])

    const activeProfile = configProfiles.find((profile) => profile.uuid === activeConfigProfileUuid)

    return (
        <Stack gap="md">
            <Stack gap="xs">
                <Group gap="xs">
                    <XrayLogo size={16} />
                    <Text fw={600} size="sm">
                        {t('show-config-profiles-with-inbounds.feature.config-profile')}
                    </Text>
                </Group>
                <Text c="dimmed" size="xs">
                    {t(
                        'show-config-profiles-with-inbounds.feature.select-the-config-profile-that-will-be-applied-to-this-node'
                    )}
                </Text>
            </Stack>

            <Paper
                p="md"
                style={{
                    borderColor: clsx(
                        !activeProfile && !errors && 'var(--mantine-color-gray-6)',
                        activeProfile && 'var(--mantine-color-cyan-filled)',
                        errors && 'var(--mantine-color-red-4)'
                    )
                }}
                withBorder
            >
                <Stack gap="md">
                    {activeProfile ? (
                        <Stack gap="xs">
                            <Group gap="xs" wrap="nowrap">
                                <TbFile size={20} style={{ flexShrink: 0 }} />
                                <Text
                                    ff="monospace"
                                    fw={600}
                                    size="sm"
                                    style={{ flex: 1 }}
                                    truncate
                                >
                                    {activeProfile.name}
                                </Text>
                                <Badge
                                    color="teal"
                                    rightSection={<TbTag size={14} />}
                                    size="md"
                                    style={{ flexShrink: 0 }}
                                    variant="default"
                                >
                                    {activeConfigProfileInbounds?.length || 0}
                                </Badge>
                            </Group>

                            {activeProfileInboundsPorts &&
                                activeProfileInboundsPorts.length > 0 && (
                                    <Flex
                                        direction="row"
                                        gap="0.25rem"
                                        justify="flex-start"
                                        wrap="wrap"
                                    >
                                        {activeProfileInboundsPorts.map((port, index) => (
                                            <Badge
                                                color="gray"
                                                key={`${port}-${index}`}
                                                size="xs"
                                                variant="default"
                                            >
                                                {port}
                                            </Badge>
                                        ))}
                                    </Flex>
                                )}
                        </Stack>
                    ) : (
                        <Stack gap="xs">
                            <Group gap="xs">
                                <TbFile opacity={0.5} size={20} style={{ flexShrink: 0 }} />
                                <Text c="dimmed" fw={500} size="sm">
                                    {t(
                                        'show-config-profiles-with-inbounds.feature.no-config-profile-selected'
                                    )}
                                </Text>
                            </Group>
                            <Text c="dimmed" size="xs">
                                {t(
                                    'show-config-profiles-with-inbounds.feature.choose-a-profile-to-configure-inbounds-for-this-node'
                                )}
                            </Text>
                        </Stack>
                    )}

                    <Button
                        leftSection={<TbFile size={16} />}
                        onClick={handlers.open}
                        size="sm"
                        variant="default"
                    >
                        {t('common.change')}
                    </Button>
                </Stack>
            </Paper>

            <ConfigProfilesDrawer
                activeConfigProfileInbounds={activeConfigProfileInbounds}
                activeConfigProfileUuid={activeConfigProfileUuid}
                onClose={handlers.close}
                onSaveInbounds={onSaveInbounds}
                opened={opened}
            />
        </Stack>
    )
}
