import { Tabs, Textarea, TextInput } from '@mantine/core'
import { useTranslation } from 'react-i18next'

import { IAppConfig, TAdditionalLocales } from '../../../../model/types'
import { LocalizedFieldsProps } from '../interfaces'
import { getLocaleFlag } from './get-locale-flag'
import { getLocaleName } from './get-locale-name'

const getLocaleDir = (locale: string): 'auto' | 'ltr' | 'rtl' => {
    switch (locale) {
        case 'en':
            return 'ltr'
        case 'fa':
            return 'rtl'
        default:
            return 'auto'
    }
}

export const LocalizedFields = (props: LocalizedFieldsProps) => {
    const { t } = useTranslation()
    const { field, isDescription, section, updateField, value, additionalLocales } = props

    const enabledLocales = ['en', ...additionalLocales]

    return (
        <Tabs defaultValue="en">
            <Tabs.List grow>
                {enabledLocales.map((locale) => (
                    <Tabs.Tab key={locale} value={locale}>
                        {getLocaleFlag(locale)} {getLocaleName(locale, t)}
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
                                    locale as TAdditionalLocales,
                                    e.target.value
                                )
                            }
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            value={(value as any)[locale] || ''}
                        />
                    ) : (
                        <TextInput
                            dir={getLocaleDir(locale)}
                            onChange={(e) =>
                                updateField(
                                    section as keyof IAppConfig,
                                    field,
                                    locale as TAdditionalLocales,
                                    e.target.value
                                )
                            }
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            value={(value as any)[locale] || ''}
                        />
                    )}
                </Tabs.Panel>
            ))}
        </Tabs>
    )
}
