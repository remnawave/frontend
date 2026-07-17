import { ActionIcon, HoverCard, Stack, Text } from '@mantine/core'
import { ExternalSquadSubscriptionSettingsSchema } from '@remnawave/backend-contract'
import { TFunction } from 'i18next'
import { HiQuestionMarkCircle } from 'react-icons/hi'

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

export function resolveSubscriptionSetting(
    field: keyof typeof ExternalSquadSubscriptionSettingsSchema.shape,
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
        case 'isShowCustomRemarks':
            return {
                label: t('subscription-tabs.widget.show-custom-remarks'),
                inputType: 'boolean'
            }
        case 'randomizeHosts':
            return {
                description: t('subscription-tabs.widget.randomize-hosts-description'),
                label: t('subscription-tabs.widget.randomize-hosts'),
                inputType: 'boolean',
                hoverCard: hoverCard(t('subscription-tabs.widget.randomize-hosts-description'))
            }
        case 'serveJsonAtBaseSubscription':
            return {
                description: t('subscription-settings.widget.serve-json-description'),
                label: t('subscription-settings.widget.serve-json-at-base-subscription'),
                inputType: 'boolean',
                hoverCard: hoverCard(t('subscription-settings.widget.serve-json-description'))
            }

        default:
            return {
                label: 'Unknown setting'
            }
    }
}
