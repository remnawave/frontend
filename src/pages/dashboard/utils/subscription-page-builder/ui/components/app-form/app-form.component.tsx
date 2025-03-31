import {
    PiCheckBold,
    PiCloudArrowDownBold,
    PiDownloadBold,
    PiInfoBold,
    PiMinus,
    PiPlus,
    PiStarBold
} from 'react-icons/pi'
import {
    Accordion,
    Box,
    Button,
    Checkbox,
    Flex,
    Group,
    Stack,
    TextInput,
    Title
} from '@mantine/core'
import { useEffect, useState } from 'react'

import { updateLocalizedField } from './lib/localized-fields.utils'
import { emptyLocalizedText } from '../../../model/config'
import { LocalizedFields } from './lib/localized-fields'
import { ButtonFields } from './lib/button-fields'
import { AppConfig } from '../../../model/types'
import { AppFormProps } from './interfaces'

export const AppForm = (props: AppFormProps) => {
    const { app, onChange, onDelete } = props
    const [localApp, setLocalApp] = useState<AppConfig>(app)

    useEffect(() => {
        setLocalApp(app)
    }, [app])

    const updateApp = (newData: Partial<AppConfig>) => {
        const updated = { ...localApp, ...newData }
        setLocalApp(updated)
        onChange(updated)
    }

    const handleUpdateLocalizedField = (
        section: keyof AppConfig,
        field: string,
        lang: 'en' | 'fa' | 'ru',
        value: string
    ) => {
        updateLocalizedField(localApp, section, field, lang, value, setLocalApp, onChange)
    }

    return (
        <Box mb={30}>
            <Group mb="lg" style={{ justifyContent: 'space-between' }}>
                <Title order={3}>{localApp.name}</Title>
                {onDelete && (
                    <Button color="red" onClick={onDelete} variant="outline">
                        Delete App
                    </Button>
                )}
            </Group>

            <Stack gap="sm">
                <TextInput
                    label="App ID"
                    onChange={(e) => updateApp({ id: e.target.value as `${Lowercase<string>}` })}
                    value={localApp.id}
                />

                <TextInput
                    label="App Name"
                    onChange={(e) => updateApp({ name: e.target.value })}
                    value={localApp.name}
                />

                <TextInput
                    label="URL Scheme"
                    onChange={(e) => updateApp({ urlScheme: e.target.value })}
                    value={localApp.urlScheme}
                />

                <Group>
                    <Checkbox
                        checked={localApp.isFeatured}
                        label="Featured App"
                        onChange={(e) => updateApp({ isFeatured: e.target.checked })}
                    />

                    <Checkbox
                        checked={!!localApp.isNeedBase64Encoding}
                        label="Need Base64 Encoding"
                        onChange={(e) => updateApp({ isNeedBase64Encoding: e.target.checked })}
                    />
                </Group>
            </Stack>

            <Accordion defaultValue="installation" mt="xl" variant="separated">
                <Accordion.Item value="installation">
                    <Accordion.Control>
                        <Flex align="center" gap="xs">
                            <PiDownloadBold size="1.5rem" />
                            Installation Step
                        </Flex>
                    </Accordion.Control>
                    <Accordion.Panel>
                        <Title mb="md" order={4}>
                            Description
                        </Title>
                        <LocalizedFields
                            field="description"
                            isDescription={true}
                            section="installationStep"
                            updateField={handleUpdateLocalizedField}
                            value={localApp.installationStep.description}
                        />

                        <Title mb="md" mt="lg" order={4}>
                            Buttons
                        </Title>
                        <ButtonFields
                            buttons={localApp.installationStep.buttons}
                            localApp={localApp}
                            section="installationStep"
                            updateApp={updateApp}
                        />
                    </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="before-subscription">
                    <Accordion.Control>
                        <Flex align="center" gap="xs">
                            <PiInfoBold size="1.5rem" />
                            Additional Before Subscription Step
                            {localApp.additionalBeforeAddSubscriptionStep && (
                                <Button
                                    color="red"
                                    leftSection={<PiMinus size="1.25rem" />}
                                    ml={'xs'}
                                    onClick={() =>
                                        updateApp({
                                            additionalBeforeAddSubscriptionStep: undefined
                                        })
                                    }
                                    size="xs"
                                    variant="outline"
                                >
                                    Remove Step
                                </Button>
                            )}
                            {!localApp.additionalBeforeAddSubscriptionStep && (
                                <Button
                                    leftSection={<PiPlus size="1.25rem" />}
                                    ml={'xs'}
                                    onClick={() =>
                                        updateApp({
                                            additionalBeforeAddSubscriptionStep: {
                                                title: { ...emptyLocalizedText },
                                                description: { ...emptyLocalizedText },
                                                buttons: []
                                            }
                                        })
                                    }
                                    size="xs"
                                    variant="outline"
                                >
                                    Add Step
                                </Button>
                            )}
                        </Flex>
                    </Accordion.Control>
                    <Accordion.Panel>
                        {localApp.additionalBeforeAddSubscriptionStep && (
                            <>
                                <Title mb="md" order={4}>
                                    Title
                                </Title>
                                <LocalizedFields
                                    field="title"
                                    section="additionalBeforeAddSubscriptionStep"
                                    updateField={handleUpdateLocalizedField}
                                    value={localApp.additionalBeforeAddSubscriptionStep.title}
                                />

                                <Title mb="md" mt="lg" order={4}>
                                    Description
                                </Title>
                                <LocalizedFields
                                    field="description"
                                    isDescription={true}
                                    section="additionalBeforeAddSubscriptionStep"
                                    updateField={handleUpdateLocalizedField}
                                    value={localApp.additionalBeforeAddSubscriptionStep.description}
                                />

                                <Title mb="md" mt="lg" order={4}>
                                    Buttons
                                </Title>
                                <ButtonFields
                                    buttons={localApp.additionalBeforeAddSubscriptionStep.buttons}
                                    localApp={localApp}
                                    section="additionalBeforeAddSubscriptionStep"
                                    updateApp={updateApp}
                                />
                            </>
                        )}
                    </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="subscription">
                    <Accordion.Control>
                        <Flex align="center" gap="xs">
                            <PiCloudArrowDownBold size="1.5rem" />
                            Add Subscription Step
                        </Flex>
                    </Accordion.Control>
                    <Accordion.Panel>
                        <Title mb="md" order={4}>
                            Description
                        </Title>
                        <LocalizedFields
                            field="description"
                            isDescription={true}
                            section="addSubscriptionStep"
                            updateField={handleUpdateLocalizedField}
                            value={localApp.addSubscriptionStep.description}
                        />
                    </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="after-subscription">
                    <Accordion.Control>
                        <Flex align="center" gap="xs">
                            <PiStarBold size="1.5rem" />
                            Additional After Subscription Step
                            {localApp.additionalAfterAddSubscriptionStep && (
                                <Button
                                    color="red"
                                    leftSection={<PiMinus size="1.25rem" />}
                                    ml={'xs'}
                                    onClick={() =>
                                        updateApp({
                                            additionalAfterAddSubscriptionStep: undefined
                                        })
                                    }
                                    size="xs"
                                    variant="outline"
                                >
                                    Remove Step
                                </Button>
                            )}
                            {!localApp.additionalAfterAddSubscriptionStep && (
                                <Button
                                    leftSection={<PiPlus size="1.25rem" />}
                                    ml={'xs'}
                                    onClick={() =>
                                        updateApp({
                                            additionalAfterAddSubscriptionStep: {
                                                title: { ...emptyLocalizedText },
                                                description: { ...emptyLocalizedText },
                                                buttons: []
                                            }
                                        })
                                    }
                                    size="xs"
                                    variant="outline"
                                >
                                    Add Step
                                </Button>
                            )}
                        </Flex>
                    </Accordion.Control>
                    <Accordion.Panel>
                        {localApp.additionalAfterAddSubscriptionStep && (
                            <>
                                <Title mb="md" order={4}>
                                    Title
                                </Title>
                                <LocalizedFields
                                    field="title"
                                    section="additionalAfterAddSubscriptionStep"
                                    updateField={handleUpdateLocalizedField}
                                    value={localApp.additionalAfterAddSubscriptionStep.title}
                                />

                                <Title mb="md" mt="lg" order={4}>
                                    Description
                                </Title>
                                <LocalizedFields
                                    field="description"
                                    isDescription={true}
                                    section="additionalAfterAddSubscriptionStep"
                                    updateField={handleUpdateLocalizedField}
                                    value={localApp.additionalAfterAddSubscriptionStep.description}
                                />

                                <Title mb="md" mt="lg" order={4}>
                                    Buttons
                                </Title>
                                <ButtonFields
                                    buttons={localApp.additionalAfterAddSubscriptionStep.buttons}
                                    localApp={localApp}
                                    section="additionalAfterAddSubscriptionStep"
                                    updateApp={updateApp}
                                />
                            </>
                        )}
                    </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="connect">
                    <Accordion.Control>
                        <Flex align="center" gap="xs">
                            <PiCheckBold size="1.5rem" />
                            Connect and Use Step
                        </Flex>
                    </Accordion.Control>
                    <Accordion.Panel>
                        <Title mb="md" order={4}>
                            Description
                        </Title>
                        <LocalizedFields
                            field="description"
                            isDescription={true}
                            section="connectAndUseStep"
                            updateField={handleUpdateLocalizedField}
                            value={localApp.connectAndUseStep.description}
                        />
                    </Accordion.Panel>
                </Accordion.Item>
            </Accordion>
        </Box>
    )
}
