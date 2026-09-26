import { ActionIcon, Badge, Button, Group, Stack, Text, ThemeIcon, Tooltip } from '@mantine/core'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { TbEdit, TbFilePlus, TbTag } from 'react-icons/tb'

import { showModal } from '@shared/_modals/show-modal'
import { XrayLogo } from '@shared/ui/logos'
import { SectionCard } from '@shared/ui/section-card'

import { IProps } from './interfaces'

export function ShowConfigProfilesWithInboundsFeature(props: IProps) {
    const {
        activeConfigProfileInbounds,
        activeConfigProfileUuid,
        configProfiles,
        onSaveInbounds,
        errors
    } = props

    const { t } = useTranslation()

    const activeProfile = configProfiles.find((profile) => profile.uuid === activeConfigProfileUuid)

    const activeProfileInboundsPorts = useMemo(() => {
        const ports = activeConfigProfileInbounds
            ?.map((inbound) => {
                const inboundConfig = activeProfile?.inbounds.find((i) => i.uuid === inbound)
                return inboundConfig?.port ?? null
            })
            .filter((port) => port !== null)

        return [...new Set(ports)]
    }, [activeConfigProfileInbounds, activeProfile])

    const inboundsCount = activeConfigProfileInbounds?.length ?? 0
    const hasError = Boolean(errors)

    return (
        <SectionCard.Root
            style={hasError ? { borderColor: 'var(--mantine-color-red-5)' } : undefined}
        >
            {activeProfile ? (
                <SectionCard.Section>
                    <Stack gap="sm">
                        <Group gap="sm" justify="space-between" wrap="nowrap">
                            <Group gap="sm" style={{ flex: 1, minWidth: 0 }} wrap="nowrap">
                                <ThemeIcon color="cyan" size="lg" variant="soft">
                                    <XrayLogo size={20} />
                                </ThemeIcon>
                                <Text ff="monospace" fw={600} size="sm" truncate>
                                    {activeProfile.name}
                                </Text>
                            </Group>

                            <Group gap="xs" style={{ flexShrink: 0 }} wrap="nowrap">
                                <Badge
                                    color="cyan"
                                    leftSection={<TbTag size={12} />}
                                    size="lg"
                                    variant="light"
                                >
                                    {inboundsCount}
                                </Badge>

                                <Tooltip label={t('common.action.edit')}>
                                    <ActionIcon
                                        onClick={() =>
                                            showModal('nodes_nodesConfigProfilesDrawer', {
                                                activeConfigProfileInbounds:
                                                    activeConfigProfileInbounds,
                                                activeConfigProfileUuid: activeConfigProfileUuid,
                                                onSaveInbounds: onSaveInbounds
                                            })
                                        }
                                        size="lg"
                                        variant="default"
                                    >
                                        <TbEdit size={18} />
                                    </ActionIcon>
                                </Tooltip>
                            </Group>
                        </Group>

                        {activeProfileInboundsPorts.length > 0 && (
                            <Group gap={4}>
                                {activeProfileInboundsPorts.map((port, index) => (
                                    <Badge
                                        color="gray"
                                        key={`${port}-${index}`}
                                        radius="sm"
                                        size="sm"
                                        variant="default"
                                    >
                                        {port}
                                    </Badge>
                                ))}
                            </Group>
                        )}
                    </Stack>
                </SectionCard.Section>
            ) : (
                <>
                    <SectionCard.Section>
                        <Group gap="sm" wrap="nowrap">
                            <ThemeIcon color="gray" size="lg" variant="default">
                                <XrayLogo size={20} />
                            </ThemeIcon>
                            <Stack gap={2}>
                                <Text fw={500} size="sm">
                                    {t(
                                        'show-config-profiles-with-inbounds.feature.no-config-profile-selected'
                                    )}
                                </Text>
                                <Text c="dimmed" size="xs">
                                    {t(
                                        'show-config-profiles-with-inbounds.feature.choose-a-profile-to-configure-inbounds-for-this-node'
                                    )}
                                </Text>
                            </Stack>
                        </Group>
                    </SectionCard.Section>

                    <SectionCard.Section>
                        <Button
                            color="cyan"
                            fullWidth
                            leftSection={<TbFilePlus size={16} />}
                            onClick={() =>
                                showModal('nodes_nodesConfigProfilesDrawer', {
                                    activeConfigProfileInbounds: [],
                                    activeConfigProfileUuid: undefined,
                                    onSaveInbounds: onSaveInbounds
                                })
                            }
                            size="sm"
                            variant="light"
                        >
                            {t('common.action.select')}
                        </Button>
                    </SectionCard.Section>
                </>
            )}
        </SectionCard.Root>
    )
}
