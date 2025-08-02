import { Checkbox, Group, Paper, Stack, Text, Title } from '@mantine/core'
import ReactCountryFlag from 'react-country-flag'
import { useTranslation } from 'react-i18next'
import { TbLanguage } from 'react-icons/tb'
import { TFunction } from 'i18next'
import { ReactNode } from 'react'

import { TAdditionalLocales } from '../../../model/types'

interface LanguageSelectorProps {
    additionalLocales: TAdditionalLocales[]
    onChange: (locales: TAdditionalLocales[]) => void
}

const getLocaleFlag = (locale: string): ReactNode => {
    switch (locale) {
        case 'fa':
            return (
                <ReactCountryFlag
                    countryCode="IR"
                    style={{
                        fontSize: '1.1em',
                        borderRadius: '2px'
                    }}
                />
            )
        case 'ru':
            return (
                <ReactCountryFlag
                    countryCode="RU"
                    style={{
                        fontSize: '1.1em',
                        borderRadius: '2px'
                    }}
                />
            )
        case 'zh':
            return (
                <ReactCountryFlag
                    countryCode="CN"
                    style={{
                        fontSize: '1.1em',
                        borderRadius: '2px'
                    }}
                />
            )
        default:
            return null
    }
}

const getLocaleName = (locale: string, t: TFunction): string => {
    switch (locale) {
        case 'fa':
            return t('language-selector.component.persian')
        case 'ru':
            return t('language-selector.component.russian')
        case 'zh':
            return t('language-selector.component.chinese')
        default:
            return locale
    }
}

export const LanguageSelector = (props: LanguageSelectorProps) => {
    const { t } = useTranslation()
    const { additionalLocales, onChange } = props

    const availableLocales: TAdditionalLocales[] = ['ru', 'fa', 'zh']

    const handleLocaleChange = (locale: TAdditionalLocales, checked: boolean) => {
        if (checked) {
            onChange([...additionalLocales, locale])
        } else {
            onChange(additionalLocales.filter((l) => l !== locale))
        }
    }

    return (
        <Paper p="md" radius="md" shadow="sm" withBorder>
            <Group align="center" gap="xs" mb="xs">
                <TbLanguage size={20} />
                <Title order={4}>{t('language-selector.component.additional-languages')}</Title>
            </Group>
            <Text c="dimmed" mb="md" size="sm">
                {t('language-selector.component.english-is-always-enabled')}
            </Text>
            <Stack gap="xs">
                {availableLocales.map((locale) => (
                    <Checkbox
                        checked={additionalLocales.includes(locale)}
                        key={locale}
                        label={
                            <Group gap="xs">
                                <span>{getLocaleFlag(locale)}</span>
                                <span>{getLocaleName(locale, t)}</span>
                            </Group>
                        }
                        onChange={(e) => handleLocaleChange(locale, e.target.checked)}
                    />
                ))}
            </Stack>
        </Paper>
    )
}
