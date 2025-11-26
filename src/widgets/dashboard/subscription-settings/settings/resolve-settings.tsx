import { ExternalSquadSubscriptionSettingsSchema } from '@remnawave/backend-contract'
import { PiClock, PiIdentificationBadge, PiLink } from 'react-icons/pi'
import { ActionIcon, HoverCard, px, Stack, Text } from '@mantine/core'
import { HiQuestionMarkCircle } from 'react-icons/hi'
import { TFunction } from 'i18next'

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
        case 'happAnnounce':
            return {
                description: t('subscription-settings.widget.happ-announce-description'),
                label: t('subscription-settings.widget.happ-announce'),
                inputType: 'textarea',
                hoverCard: hoverCard(t('subscription-settings.widget.happ-announce-description'))
            }
        case 'happRouting':
            return {
                description: t('subscription-settings.widget.happ-routing-description'),
                label: t('subscription-settings.widget.happ-routing'),
                inputType: 'textarea',
                hoverCard: hoverCard(t('subscription-settings.widget.happ-routing-description'))
            }
        case 'isProfileWebpageUrlEnabled':
            return {
                description: t('subscription-settings.widget.profile-webpage-url-description'),
                label: t('subscription-settings.widget.profile-webpage-url'),
                inputType: 'boolean',
                hoverCard: hoverCard(
                    t('subscription-settings.widget.profile-webpage-url-description')
                )
            }
        case 'isShowCustomRemarks':
            return {
                label: t('subscription-tabs.widget.show-custom-remarks'),
                inputType: 'boolean'
            }
        case 'profileTitle':
            return {
                description: t(
                    'subscription-settings.widget.this-title-will-be-displayed-as-subscription-name'
                ),
                label: t('subscription-settings.widget.profile-title'),
                leftSection: <PiIdentificationBadge size={px('1.2rem')} />,
                inputType: 'string',
                hoverCard: hoverCard(
                    t(
                        'subscription-settings.widget.this-title-will-be-displayed-as-subscription-name'
                    )
                )
            }
        case 'profileUpdateInterval':
            return {
                description: t('subscription-settings.widget.auto-update-description'),
                label: t('subscription-settings.widget.auto-update-interval-hours'),
                inputType: 'number',
                hoverCard: hoverCard(t('subscription-settings.widget.auto-update-description')),
                leftSection: <PiClock size={px('1.2rem')} />
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
        case 'supportLink':
            return {
                description: t('subscription-settings.widget.support-link-description'),
                label: t('subscription-settings.widget.support-link'),
                inputType: 'string',
                hoverCard: hoverCard(t('subscription-settings.widget.support-link-description')),
                leftSection: <PiLink size={px('1.2rem')} />
            }

        default:
            return {
                label: 'Unknown setting'
            }
    }
}
