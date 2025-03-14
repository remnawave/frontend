import { Accordion, ActionIcon, Code, CopyButton, Group, Stack, Text } from '@mantine/core'
import { PiCheck, PiCopy, PiInfo, PiNetworkSlash } from 'react-icons/pi'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'

import { IProps } from './interfaces'

export const ModalAccordionWidget = (props: IProps) => {
    const { t } = useTranslation()

    const { node, fetchedNode, pubKey } = props

    const [localStatusMessage, setLocalStatusMessage] = useState<null | string>(null)

    const accordionValue = localStatusMessage ? 'error' : 'none'

    useEffect(() => {
        if (fetchedNode) {
            setLocalStatusMessage(fetchedNode.lastStatusMessage)
        } else if (node?.lastStatusMessage) {
            setLocalStatusMessage(node.lastStatusMessage)
        }
    }, [fetchedNode])

    return (
        <Accordion defaultValue={accordionValue} key={node?.uuid} radius="md" variant="contained">
            <Accordion.Item value="info">
                <Accordion.Control icon={<PiInfo color="gray" size={'1.50rem'} />}>
                    {t('error-accordeon.widget.important-note')}
                </Accordion.Control>
                <Accordion.Panel>
                    <Stack gap={'0'}>
                        <Text>
                            {t('error-accordeon.widget.important-note-description')}{' '}
                            <Code color="var(--mantine-color-blue-light)">.env</Code> value.
                        </Text>
                        <Group justify="flex-end">
                            <CopyButton value={`SSL_CERT="${pubKey?.pubKey.trimEnd()}"`}>
                                {({ copied, copy }) => (
                                    <ActionIcon
                                        color={copied ? 'teal' : 'blue'}
                                        onClick={copy}
                                        radius="md"
                                        size="lg"
                                        variant="outline"
                                    >
                                        {copied ? <PiCheck size="1rem" /> : <PiCopy size="1rem" />}
                                    </ActionIcon>
                                )}
                            </CopyButton>
                        </Group>
                    </Stack>
                </Accordion.Panel>
            </Accordion.Item>

            {localStatusMessage && (
                <Accordion.Item value="error">
                    <Accordion.Control icon={<PiNetworkSlash color="#FF8787" size={'1.50rem'} />}>
                        <Text fw={600}>{t('error-accordeon.widget.last-error-message')}</Text>
                    </Accordion.Control>
                    <Accordion.Panel>
                        <Code block>{localStatusMessage}</Code>
                    </Accordion.Panel>
                </Accordion.Item>
            )}
        </Accordion>
    )
}
