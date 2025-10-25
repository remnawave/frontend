import { Accordion, Code, Text } from '@mantine/core'
import { PiNetworkSlash } from 'react-icons/pi'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'

import { IProps } from './interfaces'

export const ModalAccordionWidget = (props: IProps) => {
    const { t } = useTranslation()

    const { node, fetchedNode } = props

    const [localStatusMessage, setLocalStatusMessage] = useState<null | string>(null)

    useEffect(() => {
        if (fetchedNode) {
            setLocalStatusMessage(fetchedNode.lastStatusMessage)
        } else if (node?.lastStatusMessage) {
            setLocalStatusMessage(node.lastStatusMessage)
        }
    }, [fetchedNode])

    if (!localStatusMessage) {
        return null
    }

    return (
        <Accordion key={node?.uuid} radius="md" variant="separated">
            <Accordion.Item value="error">
                <Accordion.Control icon={<PiNetworkSlash color="#FF8787" size="24px" />}>
                    <Text fw={600}>{t('error-accordeon.widget.last-error-message')}</Text>
                </Accordion.Control>
                <Accordion.Panel>
                    <Code color="var(--mantine-color-red-light)">{localStatusMessage}</Code>
                </Accordion.Panel>
            </Accordion.Item>
        </Accordion>
    )
}
