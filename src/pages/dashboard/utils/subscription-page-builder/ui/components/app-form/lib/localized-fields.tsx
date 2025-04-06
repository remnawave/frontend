import { Tabs, Textarea, TextInput } from '@mantine/core'

import { LocalizedFieldsProps } from '../interfaces'
import { AppConfig } from '../../../../model/types'

export const LocalizedFields = (props: LocalizedFieldsProps) => {
    const { field, isDescription, section, updateField, value } = props

    return (
        <Tabs defaultValue="en">
            <Tabs.List grow>
                <Tabs.Tab value="en">🇬🇧 English</Tabs.Tab>
                <Tabs.Tab value="ru">🇷🇺 Russian</Tabs.Tab>
                <Tabs.Tab value="fa">🇮🇷 Persian</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel pt="xs" value="en">
                {isDescription ? (
                    <Textarea
                        autosize
                        maxRows={10}
                        minRows={3}
                        onChange={(e) =>
                            updateField(section as keyof AppConfig, field, 'en', e.target.value)
                        }
                        value={value.en}
                    />
                ) : (
                    <TextInput
                        onChange={(e) =>
                            updateField(section as keyof AppConfig, field, 'en', e.target.value)
                        }
                        value={value.en}
                    />
                )}
            </Tabs.Panel>

            <Tabs.Panel pt="xs" value="ru">
                {isDescription ? (
                    <Textarea
                        autosize
                        dir="auto"
                        maxRows={10}
                        minRows={3}
                        onChange={(e) =>
                            updateField(section as keyof AppConfig, field, 'ru', e.target.value)
                        }
                        value={value.ru}
                    />
                ) : (
                    <TextInput
                        dir="auto"
                        onChange={(e) =>
                            updateField(section as keyof AppConfig, field, 'ru', e.target.value)
                        }
                        value={value.ru}
                    />
                )}
            </Tabs.Panel>

            <Tabs.Panel pt="xs" value="fa">
                {isDescription ? (
                    <Textarea
                        autosize
                        dir="rtl"
                        maxRows={10}
                        minRows={3}
                        onChange={(e) =>
                            updateField(section as keyof AppConfig, field, 'fa', e.target.value)
                        }
                        value={value.fa}
                    />
                ) : (
                    <TextInput
                        dir="rtl"
                        onChange={(e) =>
                            updateField(section as keyof AppConfig, field, 'fa', e.target.value)
                        }
                        value={value.fa}
                    />
                )}
            </Tabs.Panel>
        </Tabs>
    )
}
