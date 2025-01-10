import { Button, Group, Paper, Stack, Text, Title } from '@mantine/core'
import { PiBookOpenTextDuotone, PiCodeDuotone } from 'react-icons/pi'
import { Link } from 'react-router-dom'

import { IProps } from './interfaces'

export function ApiTokensDocumentationWidget(props: IProps) {
    const { docs } = props

    if (!docs || !docs.isDocsEnabled) {
        return null
    }

    return (
        <Paper mb="lg" p="md" radius="md" withBorder>
            <Stack gap="md">
                <Title order={4}>API Documentation</Title>

                <Text c="dimmed" size="sm">
                    Explore API documentation using either Scalar or Swagger UI. <br />
                    Both provide comprehensive details about available endpoints, request/response
                    formats, and authentication methods.
                </Text>

                <Group>
                    <Button
                        component={Link}
                        leftSection={<PiBookOpenTextDuotone size="1.2rem" />}
                        rel="noopener noreferrer"
                        target="_blank"
                        to={docs.scalarPath!}
                        variant="light"
                    >
                        Open Scalar
                    </Button>

                    <Button
                        color="blue"
                        component={Link}
                        leftSection={<PiCodeDuotone size="1.2rem" />}
                        rel="noopener noreferrer"
                        target="_blank"
                        to={docs.swaggerPath!}
                        variant="light"
                    >
                        Open Swagger
                    </Button>
                </Group>
            </Stack>
        </Paper>
    )
}
