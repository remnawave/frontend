import { UpdateSubscriptionSettingsCommand } from '@remnawave/backend-contract'
import { px, Stack, Tabs, Transition } from '@mantine/core'
import { PiChatsCircle, PiInfo } from 'react-icons/pi'
import { TbPrescription } from 'react-icons/tb'
import { useTranslation } from 'react-i18next'
import Masonry from 'react-layout-masonry'
import { useState } from 'react'

import { SubscriptionAnnounceRoutingCardWidget } from './cards/subscription-announce-routing-card.widget'
import { SubscriptionResponseHeadersCardWidget } from './cards/subscription-response-headers-card.widget'
import { SubscriptionAdditionalOptionsWidget } from './cards/subscription-additional-options.widget'
import { SubscriptionUserRemarksCardWidget } from './cards/subscription-user-remarks-card.widget'
import { SubscriptionInfoCardWidget } from './cards/subscription-info-card.widget'
import styles from './subscription-tabs.module.css'

interface SubscriptionTabsProps {
    subscriptionSettings: UpdateSubscriptionSettingsCommand.Response['response']
}

const TABS = {
    general: 'general',
    remarks: 'remarks',
    additionalResponseHeaders: 'additionalResponseHeaders'
} as const

type TabKey = keyof typeof TABS

export const SubscriptionSettingsTabsWidget = ({ subscriptionSettings }: SubscriptionTabsProps) => {
    const { t } = useTranslation()

    const [activeTab, setActiveTab] = useState<TabKey>(TABS.general)

    return (
        <Tabs
            classNames={{
                tab: styles.tab,
                tabLabel: styles.tabLabel
            }}
            color="cyan"
            defaultValue={TABS.general}
            onChange={(value) => {
                if (value) {
                    setActiveTab(value as TabKey)
                }
            }}
            style={{
                width: '100%'
            }}
            value={activeTab}
            variant="unstyled"
        >
            <Tabs.List>
                <Tabs.Tab leftSection={<PiInfo size={px('1.2rem')} />} value={TABS.general}>
                    {t('subscription-settings.widget.subscription-info')}
                </Tabs.Tab>
                <Tabs.Tab leftSection={<PiChatsCircle size={px('1.2rem')} />} value={TABS.remarks}>
                    {t('subscription-settings.widget.user-status-remarks')}
                </Tabs.Tab>
                <Tabs.Tab
                    leftSection={<TbPrescription size={px('1.2rem')} />}
                    value={TABS.additionalResponseHeaders}
                >
                    {t('subscription-tabs.widget.additional-response-headers')}
                </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel pt="xl" value={TABS.general}>
                <Transition
                    duration={200}
                    mounted={activeTab === TABS.general}
                    timingFunction="linear"
                    transition="fade"
                >
                    {(styles) => (
                        <Stack gap="lg" style={styles}>
                            <Masonry columns={{ 300: 1, 1400: 2, 2000: 3, 3000: 4 }} gap={16}>
                                <SubscriptionInfoCardWidget
                                    subscriptionSettings={subscriptionSettings}
                                />
                                <SubscriptionAdditionalOptionsWidget
                                    subscriptionSettings={subscriptionSettings}
                                />
                                <SubscriptionAnnounceRoutingCardWidget
                                    subscriptionSettings={subscriptionSettings}
                                />
                            </Masonry>
                        </Stack>
                    )}
                </Transition>
            </Tabs.Panel>

            <Tabs.Panel pt="xl" value={TABS.remarks}>
                <Transition
                    duration={200}
                    mounted={activeTab === TABS.remarks}
                    timingFunction="linear"
                    transition="fade"
                >
                    {(styles) => (
                        <Stack gap="lg" style={styles}>
                            <SubscriptionUserRemarksCardWidget
                                subscriptionSettings={subscriptionSettings}
                            />
                        </Stack>
                    )}
                </Transition>
            </Tabs.Panel>

            <Tabs.Panel pt="xl" value={TABS.additionalResponseHeaders}>
                <Transition
                    duration={200}
                    mounted={activeTab === TABS.additionalResponseHeaders}
                    timingFunction="linear"
                    transition="fade"
                >
                    {(styles) => (
                        <Stack gap="lg" style={styles}>
                            <SubscriptionResponseHeadersCardWidget
                                subscriptionSettings={subscriptionSettings}
                            />
                        </Stack>
                    )}
                </Transition>
            </Tabs.Panel>
        </Tabs>
    )
}
