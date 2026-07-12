import { Code, Divider, Group, List, Stack, Text, ThemeIcon, Title } from '@mantine/core'
import { ReactNode } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { TbAlertTriangle, TbServer, TbStack2 } from 'react-icons/tb'

const rich = {
    b: <Text component="span" fw={700} inherit />,
    code: <Code />,
    hl: <Text component="span" c="teal.4" fw={600} inherit />
}

interface InfoSectionProps {
    children: ReactNode
    color: string
    icon: ReactNode
    title: string
}

function InfoSection({ children, color, icon, title }: InfoSectionProps) {
    return (
        <Stack gap="sm">
            <Group gap="sm" wrap="nowrap">
                <ThemeIcon color={color} radius="md" size="lg" variant="soft">
                    {icon}
                </ThemeIcon>
                <Title order={5}>{title}</Title>
            </Group>

            <Stack gap="xs">{children}</Stack>
        </Stack>
    )
}

export function InternalSquadsUsageInfoModalContent() {
    const { t } = useTranslation()

    return (
        <Stack gap="lg">
            <Text c="dimmed" size="sm">
                <Trans components={rich} i18nKey="internal-squads-usage-drawer.info.summary" />
            </Text>

            <Divider />

            <InfoSection
                color="blue"
                icon={<TbServer size={20} />}
                title={t('internal-squads-usage-drawer.info.nodes-title')}
            >
                <Text c="dimmed" size="sm">
                    <Trans
                        components={rich}
                        i18nKey="internal-squads-usage-drawer.info.nodes-intro"
                    />
                </Text>

                <List c="dimmed" size="sm" spacing={6} type="ordered">
                    <List.Item>
                        <Trans
                            components={rich}
                            i18nKey="internal-squads-usage-drawer.info.nodes-step-1"
                        />
                    </List.Item>
                    <List.Item>
                        <Trans
                            components={rich}
                            i18nKey="internal-squads-usage-drawer.info.nodes-step-2"
                        />
                    </List.Item>
                    <List.Item>
                        <Trans
                            components={rich}
                            i18nKey="internal-squads-usage-drawer.info.nodes-step-3"
                        />
                    </List.Item>
                </List>

                <Text c="dimmed" size="sm">
                    <Trans
                        components={rich}
                        i18nKey="internal-squads-usage-drawer.info.nodes-outro"
                    />
                </Text>
            </InfoSection>

            <InfoSection
                color="grape"
                icon={<TbStack2 size={20} />}
                title={t('internal-squads-usage-drawer.info.traffic-title')}
            >
                <Text c="dimmed" size="sm">
                    <Trans
                        components={rich}
                        i18nKey="internal-squads-usage-drawer.info.traffic-granularity"
                    />
                </Text>
                <Text c="dimmed" size="sm">
                    <Trans
                        components={rich}
                        i18nKey="internal-squads-usage-drawer.info.traffic-sum"
                    />
                </Text>
                <Text c="dimmed" size="sm">
                    <Trans
                        components={rich}
                        i18nKey="internal-squads-usage-drawer.info.traffic-threshold"
                    />
                </Text>
            </InfoSection>

            <InfoSection
                color="yellow"
                icon={<TbAlertTriangle size={20} />}
                title={t('internal-squads-usage-drawer.info.caveats-title')}
            >
                <List
                    c="dimmed"
                    icon={
                        <ThemeIcon color="yellow" size="md" variant="light">
                            <TbAlertTriangle size={18} />
                        </ThemeIcon>
                    }
                    size="sm"
                    spacing="sm"
                >
                    <List.Item>
                        <Trans
                            components={rich}
                            i18nKey="internal-squads-usage-drawer.info.caveats-per-node"
                        />
                    </List.Item>
                    <List.Item>
                        <Trans
                            components={rich}
                            i18nKey="internal-squads-usage-drawer.info.caveats-membership"
                        />
                    </List.Item>
                    <List.Item>
                        <Trans
                            components={rich}
                            i18nKey="internal-squads-usage-drawer.info.caveats-sorting"
                        />
                    </List.Item>
                </List>
            </InfoSection>
        </Stack>
    )
}
