import { forwardRef, useState } from 'react';
import {
    Badge,
    Box,
    CardSection,
    CardSectionProps,
    Indicator,
    Tabs,
    type IndicatorProps,
    type TabsTabProps as MantineTabsTabProps,
} from '@mantine/core';

interface TabsTabProps extends Omit<MantineTabsTabProps, 'children'> {
    label: string;
    counter?: number;
    hasIndicator?: boolean;
}

export interface DataTableTabsProps extends Omit<CardSectionProps, 'size' | 'c' | 'fw' | 'tt'> {
    tabs: TabsTabProps[];
    onChange?: (value: string) => void;
}

function IndicatorWrapper({ children, color }: Pick<IndicatorProps, 'children' | 'color'>) {
    return (
        <Indicator processing color={color} size={6} position="middle-end" offset={-8}>
            {children}
        </Indicator>
    );
}

export const DataTableTabs = forwardRef<HTMLDivElement, DataTableTabsProps>(
    ({ tabs, onChange, ...props }, ref) => {
        const [activeTab, setActiveTab] = useState<string | null>(tabs[0].value);

        const handleTabChange = (value: string | null) => {
            setActiveTab(value);
            if (value) onChange?.(value);
        };

        return (
            <CardSection ref={ref} {...props}>
                <Tabs value={activeTab} onChange={handleTabChange}>
                    <Tabs.List>
                        {tabs.map(({ counter, hasIndicator, rightSection, color, ...tab }) => {
                            const BadgeWrapper = hasIndicator ? IndicatorWrapper : Box;

                            const badge =
                                counter !== undefined ? (
                                    <BadgeWrapper color={color}>
                                        <Badge
                                            variant={activeTab === tab.value ? 'filled' : 'light'}
                                            color={color}
                                            radius="md"
                                        >
                                            {counter}
                                        </Badge>
                                    </BadgeWrapper>
                                ) : null;

                            return (
                                <Tabs.Tab
                                    {...tab}
                                    key={tab.value}
                                    rightSection={badge ?? rightSection}
                                    color={color}
                                >
                                    {tab.label}
                                </Tabs.Tab>
                            );
                        })}
                    </Tabs.List>
                </Tabs>
            </CardSection>
        );
    }
);
