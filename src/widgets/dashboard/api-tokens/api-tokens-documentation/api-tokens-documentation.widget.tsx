import { Button, Group, Paper, px, Stack, Text, Title } from '@mantine/core'
import { PiBookOpenTextDuotone, PiCodeDuotone } from 'react-icons/pi'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { IProps } from './interfaces'

export function ApiTokensDocumentationWidget(props: IProps) {
    const { t } = useTranslation()

    const { docs } = props

    if (!docs || !docs.isDocsEnabled) {
        return null
    }

    return (
        <Paper mb="lg" p="md" radius="md" withBorder>
            <Stack gap="md">
                <Title order={4}>{t('api-tokens-documentation.widget.api-documentation')}</Title>

                <Text c="dimmed" size="sm">
                    {t('api-tokens-documentation.widget.doc-description-line-1')} <br />
                    {t('api-tokens-documentation.widget.doc-description-line-2')}
                </Text>

                <Group>
                    <Button
                        component={Link}
                        leftSection={<PiBookOpenTextDuotone size={px('1.2rem')} />}
                        rel="noopener noreferrer"
                        target="_blank"
                        to={docs.scalarPath!}
                        variant="light"
                    >
                        {t('api-tokens-documentation.widget.open-scalar')}
                    </Button>

                    <Button
                        color="blue"
                        component={Link}
                        leftSection={<PiCodeDuotone size={px('1.2rem')} />}
                        rel="noopener noreferrer"
                        target="_blank"
                        to={docs.swaggerPath!}
                        variant="light"
                    >
                        {t('api-tokens-documentation.widget.open-swagger')}
                    </Button>
                </Group>
            </Stack>
        </Paper>
    )
}
