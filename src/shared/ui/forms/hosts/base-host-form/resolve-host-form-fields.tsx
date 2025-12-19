import { ExternalSquadHostOverridesSchema } from '@remnawave/backend-contract'
import { ActionIcon, HoverCard, px, Stack, Text } from '@mantine/core'
import { PiIdentificationBadge } from 'react-icons/pi'
import { HiQuestionMarkCircle } from 'react-icons/hi'
import { TFunction } from 'i18next'

import { HappLogo } from '@shared/ui/logos'

const hoverCard = (text: string) => {
    return (
        <HoverCard shadow="md" width={280} withArrow>
            <HoverCard.Target>
                <ActionIcon color="gray" size="xs" variant="subtle">
                    <HiQuestionMarkCircle size={20} />
                </ActionIcon>
            </HoverCard.Target>
            <HoverCard.Dropdown>
                <Stack gap="md">
                    <Stack gap="sm">
                        <Text c="dimmed" size="sm">
                            {text}
                        </Text>
                    </Stack>
                </Stack>
            </HoverCard.Dropdown>
        </HoverCard>
    )
}

export function resolveHostFormFields(
    field: keyof typeof ExternalSquadHostOverridesSchema.shape,
    t: TFunction
): {
    description?: string
    hoverCard?: React.ReactNode
    inputType?: 'boolean' | 'number' | 'string' | 'textarea'
    label: string
    leftSection?: React.ReactNode
    rightSection?: React.ReactNode
} {
    switch (field) {
        case 'serverDescription':
            return {
                label: t('base-host-form.server-description-header'),
                leftSection: <HappLogo size={20} />,
                inputType: 'string'
            }

        case 'vlessRouteId':
            return {
                description: t('base-host-form.vless-route-description'),
                label: 'Vless Route ID',
                inputType: 'number',
                hoverCard: hoverCard(t('base-host-form.vless-route-description')),
                leftSection: <PiIdentificationBadge size={px('1.2rem')} />
            }

        default:
            return {
                label: 'Unknown setting'
            }
    }
}
