import { Tabs, Textarea, TextInput } from '@mantine/core'

import { LocalizedFieldsProps } from '../interfaces'
import { IAppConfig, TAdditionalLocales } from '../../../../model/types'

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

export const LocalizedFields = (props: LocalizedFieldsProps) => {
    const { field, isDescription, section, updateField, value, additionalLocales } = props

    const enabledLocales = ['en', ...additionalLocales]

    return (
        <Tabs defaultValue="en">
            <Tabs.List grow>
                {enabledLocales.map((locale) => (
                    <Tabs.Tab key={locale} value={locale}>
                        {getLocaleFlag(locale)} {getLocaleName(locale)}
                    </Tabs.Tab>
                ))}
            </Tabs.List>

            {enabledLocales.map((locale) => (
                <Tabs.Panel key={locale} pt="xs" value={locale}>
                    {isDescription ? (
                        <Textarea
                            autosize
                            dir={getLocaleDir(locale)}
                            maxRows={10}
                            minRows={3}
                            onChange={(e) =>
                                updateField(
                                    section as keyof IAppConfig,
                                    field,
                                    locale as any,
                                    e.target.value
                                )
                            }
                            value={(value as any)[locale] || ''}
                        />
                    ) : (
                        <TextInput
                            dir={getLocaleDir(locale)}
                            onChange={(e) =>
                                updateField(
                                    section as keyof IAppConfig,
                                    field,
                                    locale as any,
                                    e.target.value
                                )
                            }
                            value={(value as any)[locale] || ''}
                        />
                    )}
                </Tabs.Panel>
            ))}
        </Tabs>
    )
}
