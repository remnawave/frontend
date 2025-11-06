import { Box, Checkbox, Group, Stack, Text, Title } from '@mantine/core'
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

    const availableLocales: TAdditionalLocales[] = ['ru', 'fa', 'fr', 'zh']

    const handleLocaleChange = (locale: TAdditionalLocales, checked: boolean) => {
        if (checked) {
            onChange([...additionalLocales, locale])
        } else {
            onChange(additionalLocales.filter((l) => l !== locale))
        }
    }

    return (
        <Box>
            <Group align="center" gap="xs" mb="xs">
                <TbLanguage size={16} />
                <Title order={6}>{t('language-selector.component.additional-languages')}</Title>
            </Group>
            <Text c="dimmed" mb="sm" size="xs">
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
                        size="sm"
                    />
                ))}
            </Stack>
        </Box>
    )
}
