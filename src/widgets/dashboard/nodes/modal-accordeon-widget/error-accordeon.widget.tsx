import { Accordion, ActionIcon, Code, CopyButton, Group, Stack, Text } from '@mantine/core'
import { PiCheck, PiCopy, PiInfo, PiNetworkSlash } from 'react-icons/pi'
import { useEffect, useState } from 'react'

import { IProps } from './interfaces'

export const ModalAccordionWidget = (props: IProps) => {
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
                    Important note
                </Accordion.Control>
                <Accordion.Panel>
                    <Stack gap={'0'}>
                        <Text>
                            In order to connect node, you need to run Remnawave Node with the
                            following <Code color="var(--mantine-color-blue-light)">.env</Code>{' '}
                            value.
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
                        <Text fw={600}>Last error message</Text>
                    </Accordion.Control>
                    <Accordion.Panel>
                        <Code block>{localStatusMessage}</Code>
                    </Accordion.Panel>
                </Accordion.Item>
            )}
        </Accordion>
    )
}
