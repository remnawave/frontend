import {
    Avatar,
    Box,
    Container,
    Group,
    Paper,
    rgba,
    Stack,
    Text,
    Title,
    useMantineTheme
} from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { PiBarcode } from 'react-icons/pi'

import { SubscriptionSettingsWidget } from '@widgets/dashboard/subscription-settings/settings/subscription-settings.widget'
import { LoadingScreen, PageHeader } from '@shared/ui'
import { ROUTES } from '@shared/constants'
import { Page } from '@shared/ui/page'

import { IProps } from './interfaces'

export const SubscriptionSettingsPageComponent = (props: IProps) => {
    const { t } = useTranslation()

    const theme = useMantineTheme()
    const primaryColor = theme.colors[theme.primaryColor][6]

    const { subscriptionSettings } = props

    if (!subscriptionSettings) {
        return <LoadingScreen />
    }

    return (
        <Page title={t('constants.subscription-settings')}>
            <PageHeader
                breadcrumbs={[
                    { label: t('constants.dashboard'), href: ROUTES.DASHBOARD.HOME },
                    { label: t('constants.management') },
                    { label: t('constants.subscription-settings') }
                ]}
                title={t('constants.subscription-settings')}
            />

            <Container fluid p={0} size="xl">
                <Paper mb="xl" p="md" radius="md" shadow="sm" withBorder>
                    <Group align="flex-start" wrap="nowrap">
                        <Avatar
                            color="white"
                            radius="md"
                            size="lg"
                            style={{
                                backgroundColor: 'var(--mantine-color-gray-7)',
                                borderRadius: 'var(--mantine-radius-md)',
                                alignItems: 'center',
                                background: rgba(primaryColor, 0.15),
                                backdropFilter: 'blur(8px)',
                                boxShadow: `0 4px 12px ${rgba(primaryColor, 0.1)}`
                            }}
                        >
                            <PiBarcode size={34} />
                        </Avatar>

                        <Stack gap="xs">
                            <Title fw={600} order={4}>
                                {t(
                                    'subscription-settings.page.component.what-is-subscription-settings'
                                )}
                            </Title>

                            <Text c="dimmed" lh={1.6} size="sm">
                                {t(
                                    'subscription-settings.page.component.subscription-settings-description'
                                )}{' '}
                                <br />
                                {t(
                                    'subscription-settings.page.component.subscription-settings-description-line-2'
                                )}
                            </Text>
                        </Stack>
                    </Group>
                </Paper>

                <Box mb="xl">
                    <SubscriptionSettingsWidget subscriptionSettings={subscriptionSettings} />
                </Box>
            </Container>
        </Page>
    )
}
