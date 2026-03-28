import { Accordion, Code, Text } from '@mantine/core'
import { PiNetworkSlash } from 'react-icons/pi'
import { useTranslation } from 'react-i18next'

import { IProps } from './interfaces'

export const ModalAccordionWidget = (props: IProps) => {
    const { t } = useTranslation()

    const { node } = props

    if (!node || !node.lastStatusMessage) {
        return null
    }

    return (
        <Accordion key={node.uuid} radius="md" variant="separated">
            <Accordion.Item value="error">
                <Accordion.Control icon={<PiNetworkSlash color="#FF8787" size="24px" />}>
                    <Text fw={600}>{t('error-accordeon.widget.last-error-message')}</Text>
                </Accordion.Control>
                <Accordion.Panel>
                    <Code color="var(--mantine-color-red-light)">{node.lastStatusMessage}</Code>
                </Accordion.Panel>
            </Accordion.Item>
        </Accordion>
    )
}
