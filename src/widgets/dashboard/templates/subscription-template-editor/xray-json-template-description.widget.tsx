import { Accordion, Code, Table } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { PiInfoDuotone } from 'react-icons/pi'

export const XrayJsonTemplateDescriptionWidget = () => {
    const { t } = useTranslation()

    const supportedClients = [
        { name: 'v2rayNG', minVersion: '1.8.29' },
        { name: 'V2rayN', minVersion: '6.40' },
        { name: 'Streisand', minVersion: 'Any' },
        { name: 'Happ', minVersion: 'Any' },
        { name: 'V2Box', minVersion: 'Any' },
        { name: 'ktor-client', minVersion: 'Any' }
    ]

    const rows = supportedClients.map((element) => (
        <Table.Tr key={element.name}>
            <Table.Td>{element.name}</Table.Td>
            <Table.Td>{element.minVersion}</Table.Td>
        </Table.Tr>
    ))

    return (
        <Accordion variant="separated">
            <Accordion.Item value="importing-json-subscription">
                <Accordion.Control
                    icon={<PiInfoDuotone color="var(--mantine-color-red-6)" size={20} />}
                >
                    {t('xray-json-template-description.widget.importing-json-subscription')}
                </Accordion.Control>
                <Accordion.Panel>
                    {t('xray-json-template-description.widget.description-line-1')}{' '}
                    <Code>/json</Code>{' '}
                    {t('xray-json-template-description.widget.description-line-2')}
                    <Table highlightOnHover>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Client</Table.Th>
                                <Table.Th>Min. Version</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>{rows}</Table.Tbody>
                    </Table>
                </Accordion.Panel>
            </Accordion.Item>
        </Accordion>
    )
}
