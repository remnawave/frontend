import {
    ActionIcon,
    ActionIconGroup,
    Box,
    Button,
    Card,
    Divider,
    Flex,
    px,
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
    const { buttons, localApp, section, updateApp, additionalLocales } = props
    const { t } = useTranslation()

    const enabledLocales = ['en', ...additionalLocales]

    const getLocaleFlag = (locale: string): string => {
        switch (locale) {
            case 'en':
                return '🇬🇧'
            case 'ru':
                return '🇷🇺'
            case 'fa':
                return '🇮🇷'
            case 'zh':
                return '🇨🇳'
            default:
                return '🌐'
        }
    }

    const getLocaleName = (locale: string): string => {
        switch (locale) {
            case 'en':
                return 'English'
            case 'ru':
                return 'Russian'
            case 'fa':
                return 'Persian'
            case 'zh':
                return 'Chinese'
            default:
                return locale
        }
    }

    const getLocaleDir = (locale: string): 'ltr' | 'rtl' | 'auto' => {
        switch (locale) {
            case 'fa':
                return 'rtl'
            case 'en':
                return 'ltr'
            default:
                return 'auto'
        }
    }

    const getLocalePlaceholder = (locale: string): string => {
        switch (locale) {
            case 'en':
                return 'Button text in English'
            case 'ru':
                return 'Текст кнопки на русском'
            case 'fa':
                return 'متن دکمه به فارسی'
            case 'zh':
                return '按钮文本'
            default:
                return `Button text in ${locale}`
        }
    }

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
                                        onClick={() =>
                                            addButton(
                                                localApp,
                                                section,
                                                updateApp,
                                                additionalLocales
                                            )
                                        }
                                        size="input-sm"
                                        variant="light"
                                    >
                                        <PiPlus size={px('1.2rem')} />
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
                                        <PiTrash size={px('1.2rem')} />
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
                                {enabledLocales.map((locale) => (
                                    <Tabs.Tab key={locale} value={locale}>
                                        {getLocaleFlag(locale)} {getLocaleName(locale)}
                                    </Tabs.Tab>
                                ))}
                            </Tabs.List>

                            {enabledLocales.map((locale) => (
                                <Tabs.Panel key={locale} pt="md" value={locale}>
                                    <TextInput
                                        dir={getLocaleDir(locale)}
                                        onChange={(e) =>
                                            updateButtonText(
                                                localApp,
                                                section,
                                                index,
                                                locale as any,
                                                e.target.value,
                                                updateApp
                                            )
                                        }
                                        placeholder={getLocalePlaceholder(locale)}
                                        value={(button.buttonText as any)[locale] || ''}
                                    />
                                </Tabs.Panel>
                            ))}
                        </Tabs>
                    </Box>
                </Card>
            ))}

            {buttons.length === 0 && (
                <Flex justify="center" mb="xl" mt="xl">
                    <Button
                        leftSection={<PiPlus size="24px" />}
                        onClick={() => addButton(localApp, section, updateApp, additionalLocales)}
                        variant="outline"
                    >
                        {t('button-fields.add-button')}
                    </Button>
                </Flex>
            )}
        </Box>
    )
}
