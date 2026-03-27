import { TbCloud, TbCreditCard, TbPlus, TbRefresh, TbServer } from 'react-icons/tb'
import { ActionIcon, Group, Stack, Tabs, Transition } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'

import {
    useGetInfraBillingHistoryRecords,
    useGetInfraBillingNodes,
    useGetInfraProviders
} from '@shared/api/hooks'
import { MODALS, useModalsStoreOpenWithData } from '@entities/dashboard/modal-store'
import { LoadingScreen } from '@shared/ui'

import { MobileProvidersListWidget } from './mobile-providers-list.widget'
import { MobileRecordsListWidget } from './mobile-records-list.widget'
import { MobileNodesListWidget } from './mobile-nodes-list.widget'
import { MobileStatsWidget } from './mobile-stats.widget'
import styles from './mobile-infra-billing.module.css'

type TabValue = 'nodes' | 'providers' | 'records'

export function MobileInfraBillingWidget() {
    const [activeTab, setActiveTab] = useState<TabValue>('nodes')
    const {
        data: infraProviders,
        isLoading: isInfraProvidersLoading,
        refetch: refetchInfraProviders,
        isRefetching: isInfraProvidersRefetching
    } = useGetInfraProviders()
    const {
        data: infraBillingNodes,
        isLoading: isInfraBillingNodesLoading,
        refetch: refetchInfraBillingNodes,
        isRefetching: isInfraBillingNodesRefetching
    } = useGetInfraBillingNodes()
    const {
        data: infraBillingRecords,
        refetch: refetchRecords,
        isLoading: isInfraBillingRecordsLoading,
        isRefetching: isInfraBillingRecordsRefetching
    } = useGetInfraBillingHistoryRecords({
        query: { start: 0, size: 200 }
    })

    const openModalWithData = useModalsStoreOpenWithData()
    const { t } = useTranslation()

    const handleAdd = () => {
        switch (activeTab) {
            case 'nodes':
                openModalWithData(MODALS.CREATE_INFRA_BILLING_NODE_MODAL, undefined)
                break
            case 'providers':
                openModalWithData(MODALS.CREATE_INFRA_PROVIDER_DRAWER, undefined)
                break
            case 'records':
                openModalWithData(MODALS.CREATE_INFRA_BILLING_RECORD_DRAWER, undefined)
                break
            default:
                break
        }
    }

    const handleRefetch = () => {
        refetchRecords()
        refetchInfraBillingNodes()
        refetchInfraProviders()
    }

    if (
        isInfraBillingNodesLoading ||
        isInfraProvidersLoading ||
        isInfraBillingRecordsLoading ||
        !infraBillingNodes ||
        !infraProviders ||
        !infraBillingRecords
    ) {
        return <LoadingScreen />
    }

    return (
        <Stack gap="xs" pos="relative">
            <MobileStatsWidget />

            <Tabs
                classNames={{
                    tab: styles.tab,
                    tabLabel: styles.tabLabel
                }}
                color="cyan"
                onChange={(value) => {
                    if (value) {
                        setActiveTab(value as TabValue)
                    }
                }}
                value={activeTab}
                variant="unstyled"
            >
                <Tabs.List grow mb="md">
                    <Tabs.Tab leftSection={<TbServer size={16} />} value="nodes">
                        {t('constants.nodes')}
                    </Tabs.Tab>
                    <Tabs.Tab leftSection={<TbCreditCard size={16} />} value="records">
                        {t('mobile-infra-billing.widget.history')}
                    </Tabs.Tab>
                    <Tabs.Tab leftSection={<TbCloud size={16} />} value="providers">
                        {t('mobile-infra-billing.widget.providers')}
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="nodes">
                    <Transition
                        duration={200}
                        keepMounted
                        mounted={activeTab === 'nodes'}
                        timingFunction="linear"
                        transition="fade"
                    >
                        {(styles) => (
                            <MobileNodesListWidget
                                nodes={infraBillingNodes.billingNodes}
                                style={styles}
                            />
                        )}
                    </Transition>
                </Tabs.Panel>

                <Tabs.Panel value="records">
                    <Transition
                        duration={200}
                        keepMounted
                        mounted={activeTab === 'records'}
                        timingFunction="linear"
                        transition="fade"
                    >
                        {(styles) => (
                            <MobileRecordsListWidget
                                records={infraBillingRecords.records}
                                refetchRecords={refetchRecords}
                                style={styles}
                            />
                        )}
                    </Transition>
                </Tabs.Panel>

                <Tabs.Panel value="providers">
                    <Transition
                        duration={200}
                        keepMounted
                        mounted={activeTab === 'providers'}
                        timingFunction="linear"
                        transition="fade"
                    >
                        {(styles) => (
                            <MobileProvidersListWidget
                                providers={infraProviders.providers}
                                style={styles}
                            />
                        )}
                    </Transition>
                </Tabs.Panel>
            </Tabs>

            <Group
                bottom={16}
                gap={8}
                pos="fixed"
                right={15}
                style={{
                    zIndex: 100,
                    backgroundColor: 'var(--mantine-color-dark-6)',
                    padding: 6,
                    borderRadius: 'var(--mantine-radius-md)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)'
                }}
            >
                <ActionIcon
                    color="cyan"
                    loading={
                        isInfraProvidersRefetching ||
                        isInfraBillingNodesRefetching ||
                        isInfraBillingRecordsRefetching
                    }
                    onClick={handleRefetch}
                    size={40}
                    variant="soft"
                >
                    <TbRefresh size={22} />
                </ActionIcon>
                <ActionIcon color="teal" onClick={handleAdd} size={40} variant="soft">
                    <TbPlus size={22} />
                </ActionIcon>
            </Group>
        </Stack>
    )
}
