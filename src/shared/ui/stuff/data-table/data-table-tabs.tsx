/* eslint-disable no-use-before-define */
import {
    Badge,
    Box,
    CardSection,
    CardSectionProps,
    Indicator,
    type IndicatorProps,
    type TabsTabProps as MantineTabsTabProps,
    Tabs
} from '@mantine/core'
import { forwardRef, useState } from 'react'

export interface DataTableTabsProps extends Omit<CardSectionProps, 'c' | 'fw' | 'size' | 'tt'> {
    onChange?: (value: string) => void
    tabs: TabsTabProps[]
}

interface TabsTabProps extends Omit<MantineTabsTabProps, 'children'> {
    counter?: number
    hasIndicator?: boolean
    label: string
}

function IndicatorWrapper({ children, color }: Pick<IndicatorProps, 'children' | 'color'>) {
    return (
        <Indicator color={color} offset={-8} position="middle-end" processing size={6}>
            {children}
        </Indicator>
    )
}

export const DataTableTabs = forwardRef<HTMLDivElement, DataTableTabsProps>(
    ({ tabs, onChange, ...props }, ref) => {
        const [activeTab, setActiveTab] = useState<null | string>(tabs[0].value)

        const handleTabChange = (value: null | string) => {
            setActiveTab(value)
            if (value) onChange?.(value)
        }

        return (
            <CardSection ref={ref} {...props}>
                <Tabs onChange={handleTabChange} value={activeTab}>
                    <Tabs.List>
                        {tabs.map(({ counter, hasIndicator, rightSection, color, ...tab }) => {
                            const BadgeWrapper = hasIndicator ? IndicatorWrapper : Box

                            const badge =
                                counter !== undefined ? (
                                    <BadgeWrapper color={color}>
                                        <Badge
                                            color={color}
                                            radius="md"
                                            variant={activeTab === tab.value ? 'filled' : 'light'}
                                        >
                                            {counter}
                                        </Badge>
                                    </BadgeWrapper>
                                ) : null

                            return (
                                <Tabs.Tab
                                    {...tab}
                                    color={color}
                                    key={tab.value}
                                    rightSection={badge ?? rightSection}
                                >
                                    {tab.label}
                                </Tabs.Tab>
                            )
                        })}
                    </Tabs.List>
                </Tabs>
            </CardSection>
        )
    }
)
