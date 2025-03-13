import { Button, Group, Paper, Stack, Text, Title } from '@mantine/core'
import { PiBookOpenTextDuotone } from 'react-icons/pi'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { HappRoutingBuilderWidget } from '@widgets/dashboard/utils/happ-routing-builder/happ-routing-builder.widget'
import { ROUTES } from '@shared/constants'
import { PageHeader } from '@shared/ui'
import { Page } from '@shared/ui/page'

export const HappRoutingBuilderPageComponent = () => {
    const { t } = useTranslation()

    const title = t('constants.happ-routing-builder')

    return (
        <Page title={title}>
            <PageHeader
                breadcrumbs={[{ label: t('constants.dashboard'), href: ROUTES.DASHBOARD.HOME }]}
                title={title}
            />
            <Paper mb="lg" p="md" radius="md" withBorder>
                <Stack gap="md">
                    <Title order={4}>{t('happ-routing-builder.page.component.about-happ')}</Title>

                    <Text c="dimmed" size="sm">
                        {t('happ-routing-builder.page.component.happ-is-multiplatform-xray-client')}
                        <br />
                        {t('happ-routing-builder.page.component.about-happ-description-line-2')}
                        <br />
                        <b>
                            {t('happ-routing-builder.page.component.about-happ-description-line-3')}
                        </b>
                    </Text>

                    <Group>
                        <Button
                            component={Link}
                            leftSection={<PiBookOpenTextDuotone size="1.2rem" />}
                            rel="noopener noreferrer"
                            target="_blank"
                            to={'https://www.happ.su/main/developer-documentation/routing'}
                            variant="light"
                        >
                            {t('happ-routing-builder.page.component.check-out-happ-website')}
                        </Button>
                    </Group>
                </Stack>
            </Paper>
            <HappRoutingBuilderWidget />
        </Page>
    )
}
