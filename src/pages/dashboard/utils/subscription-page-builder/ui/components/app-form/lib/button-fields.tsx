import {
    ActionIcon,
    ActionIconGroup,
    Box,
    Button,
    Card,
    Divider,
    Flex,
    Tabs,
    TextInput,
    Title,
    Tooltip
} from '@mantine/core'
import { PiLink, PiPlus, PiTrash } from 'react-icons/pi'
import { useTranslation } from 'react-i18next'

import { addButton, removeButton, updateButtonField, updateButtonText } from './button-fields.utils'
import { ButtonFieldsProps } from '../interfaces'

export const ButtonFields = (props: ButtonFieldsProps) => {
    const { buttons, localApp, section, updateApp } = props
    const { t } = useTranslation()

    return (
        <Box>
            {buttons.map((button, index) => (
                <Card key={index} mb="lg" padding="md" radius="md" withBorder>
                    <Card.Section p="md" withBorder>
                        <Flex align="center" justify="space-between">
                            <Title order={5}>
                                {t('button-fields.button')} {index + 1}
                            </Title>
                            <ActionIconGroup>
                                <Tooltip label={t('button-fields.add-button')} withArrow>
                                    <ActionIcon
                                        color="teal"
                                        onClick={() => addButton(localApp, section, updateApp)}
                                        size="input-sm"
                                        variant="light"
                                    >
                                        <PiPlus size="1.2rem" />
                                    </ActionIcon>
                                </Tooltip>
                                <Tooltip label={t('button-fields.remove-button')} withArrow>
                                    <ActionIcon
                                        color="red"
                                        onClick={() =>
                                            removeButton(localApp, section, index, updateApp)
                                        }
                                        size="input-sm"
                                        variant="light"
                                    >
                                        <PiTrash size="1.2rem" />
                                    </ActionIcon>
                                </Tooltip>
                            </ActionIconGroup>
                        </Flex>
                    </Card.Section>

                    <Box p="md">
                        <TextInput
                            label={t('button-fields.button-link')}
                            leftSection={<PiLink />}
                            mb="md"
                            onChange={(e) =>
                                updateButtonField(
                                    localApp,
                                    section,
                                    index,
                                    'buttonLink',
                                    e.target.value,
                                    updateApp
                                )
                            }
                            placeholder="https://example.com"
                            value={button.buttonLink}
                        />

                        <Divider
                            label={t('button-fields.button-text')}
                            labelPosition="center"
                            my="md"
                        />

                        <Tabs defaultValue="en" variant="default">
                            <Tabs.List grow>
                                <Tabs.Tab value="en">🇬🇧 English</Tabs.Tab>
                                <Tabs.Tab value="ru">🇷🇺 Russian</Tabs.Tab>
                                <Tabs.Tab value="fa">🇮🇷 Persian</Tabs.Tab>
                            </Tabs.List>

                            <Tabs.Panel pt="md" value="en">
                                <TextInput
                                    onChange={(e) =>
                                        updateButtonText(
                                            localApp,
                                            section,
                                            index,
                                            'en',
                                            e.target.value,
                                            updateApp
                                        )
                                    }
                                    placeholder="Button text in English"
                                    value={button.buttonText.en}
                                />
                            </Tabs.Panel>

                            <Tabs.Panel pt="md" value="ru">
                                <TextInput
                                    dir="auto"
                                    onChange={(e) =>
                                        updateButtonText(
                                            localApp,
                                            section,
                                            index,
                                            'ru',
                                            e.target.value,
                                            updateApp
                                        )
                                    }
                                    placeholder="Текст кнопки на русском"
                                    value={button.buttonText.ru}
                                />
                            </Tabs.Panel>

                            <Tabs.Panel pt="md" value="fa">
                                <TextInput
                                    dir="rtl"
                                    onChange={(e) =>
                                        updateButtonText(
                                            localApp,
                                            section,
                                            index,
                                            'fa',
                                            e.target.value,
                                            updateApp
                                        )
                                    }
                                    placeholder="متن دکمه به فارسی"
                                    value={button.buttonText.fa}
                                />
                            </Tabs.Panel>
                        </Tabs>
                    </Box>
                </Card>
            ))}

            {buttons.length === 0 && (
                <Flex justify="center" mb="xl" mt="xl">
                    <Button
                        leftSection={<PiPlus size="1.5rem" />}
                        onClick={() => addButton(localApp, section, updateApp)}
                        variant="outline"
                    >
                        {t('button-fields.add-button')}
                    </Button>
                </Flex>
            )}
        </Box>
    )
}
