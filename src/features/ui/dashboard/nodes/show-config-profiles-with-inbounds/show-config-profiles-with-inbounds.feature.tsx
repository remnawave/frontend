import { Badge, Button, Flex, Group, Paper, Stack, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { TbFile } from 'react-icons/tb'
import { useMemo } from 'react'
import clsx from 'clsx'

import { ConfigProfilesDrawer } from '@widgets/dashboard/nodes/config-profiles-drawer/config-profiles.drawer.widget'
import { XtlsLogo } from '@shared/ui/logos/xtls-logo'

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
        <Stack gap="md" mt={10}>
            <Stack gap="xs">
                <Group gap="xs">
                    <XtlsLogo size={16} />
                    <Text fw={600} size="sm">
                        Config Profile
                    </Text>
                </Group>
                <Text c="dimmed" size="xs">
                    Select the config profile that will be applied to this node
                </Text>
            </Stack>

            <Paper
                p="md"
                radius="md"
                style={{
                    borderColor: clsx(
                        !activeProfile && !errors && 'var(--mantine-color-gray-4)',
                        activeProfile && 'var(--mantine-color-cyan-filled)',
                        errors && 'var(--mantine-color-red-4)'
                    )
                }}
                withBorder
            >
                {activeProfile ? (
                    <Stack gap="xs">
                        <Group align="flex-start" justify="space-between">
                            <Stack gap={4}>
                                <Group gap="xs">
                                    <Text fw={700} size="sm">
                                        {activeProfile.name}
                                    </Text>

                                    <Badge color="blue" size="xs" variant="outline">
                                        {activeConfigProfileInbounds?.length || 0} inbounds
                                    </Badge>
                                </Group>

                                <Group>
                                    <Flex
                                        direction="row"
                                        gap="0.25rem"
                                        justify={'flex-start'}
                                        wrap="wrap"
                                    >
                                        {activeProfileInboundsPorts?.map((port, index) => (
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
                                </Group>
                            </Stack>
                        </Group>
                    </Stack>
                ) : (
                    <Stack align="center" gap="xs" py="sm">
                        <TbFile opacity={0.5} size={24} />
                        <Text c="dimmed" fw={500} size="sm">
                            No config profile selected
                        </Text>
                        <Text c="dimmed" size="xs" ta="center">
                            Choose a profile to configure inbounds for this node
                        </Text>
                    </Stack>
                )}
            </Paper>

            <Button
                color="blue"
                fullWidth
                leftSection={<TbFile size="1rem" />}
                onClick={handlers.open}
                size="sm"
                variant="default"
            >
                {activeProfile ? 'Change Profile' : 'Select Config Profile'}
            </Button>

            <ConfigProfilesDrawer
                activeConfigProfileInbounds={activeConfigProfileInbounds || []}
                activeConfigProfileUuid={activeConfigProfileUuid || null}
                onClose={handlers.close}
                onSaveInbounds={onSaveInbounds}
                opened={opened}
            />
        </Stack>
    )
}
