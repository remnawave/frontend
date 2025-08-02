import { Checkbox, Group, Paper, Stack, Text, Title } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { TbLanguage } from 'react-icons/tb'

import { getLocaleFlag } from '../app-form/lib/get-locale-flag'
import { getLocaleName } from '../app-form/lib/get-locale-name'
import { TAdditionalLocales } from '../../../model/types'

interface LanguageSelectorProps {
    additionalLocales: TAdditionalLocales[]
    onChange: (locales: TAdditionalLocales[]) => void
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
