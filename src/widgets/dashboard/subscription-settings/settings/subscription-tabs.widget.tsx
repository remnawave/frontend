import { px, Tabs } from '@mantine/core'
import { UpdateSubscriptionSettingsCommand } from '@remnawave/backend-contract'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PiInfo } from 'react-icons/pi'
import { TbListLetters, TbPrescription } from 'react-icons/tb'
import Masonry from 'react-layout-masonry'

import { SubscriptionAdditionalOptionsWidget } from './cards/subscription-additional-options.widget'
import { SubscriptionHwidSettingsWidget } from './cards/subscription-hwid-settings.widget'
import { SubscriptionResponseHeadersCardWidget } from './cards/subscription-response-headers-card.widget'
import { SubscriptionUserRemarksCardWidget } from './cards/subscription-user-remarks-card.widget'

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
            color="cyan"
            defaultValue={TABS.general}
            keepMountedMode="display-none"
            onChange={(value) => {
                if (value) {
                    setActiveTab(value as TabKey)
                }
            }}
            value={activeTab}
        >
            <Tabs.List>
                <Tabs.Tab leftSection={<PiInfo size={px('1.2rem')} />} value={TABS.general}>
                    {t('subscription-settings.widget.main-settings')}
                </Tabs.Tab>
                <Tabs.Tab leftSection={<TbListLetters size={px('1.2rem')} />} value={TABS.remarks}>
                    {t('subscription-settings.widget.custom-remarks')}
                </Tabs.Tab>
                <Tabs.Tab
                    leftSection={<TbPrescription size={px('1.2rem')} />}
                    value={TABS.additionalResponseHeaders}
                >
                    {t('subscription-tabs.widget.additional-response-headers')}
                </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel pt="xl" value={TABS.general}>
                <Masonry columns={{ 300: 1, 1400: 2, 2000: 3, 3000: 4 }} gap={16}>
                    <SubscriptionAdditionalOptionsWidget
                        subscriptionSettings={subscriptionSettings}
                    />
                    <SubscriptionHwidSettingsWidget subscriptionSettings={subscriptionSettings} />
                </Masonry>
            </Tabs.Panel>

            <Tabs.Panel pt="xl" value={TABS.remarks}>
                <SubscriptionUserRemarksCardWidget subscriptionSettings={subscriptionSettings} />
            </Tabs.Panel>

            <Tabs.Panel pt="xl" value={TABS.additionalResponseHeaders}>
                <SubscriptionResponseHeadersCardWidget
                    subscriptionSettings={subscriptionSettings}
                />
            </Tabs.Panel>
        </Tabs>
    )
}
