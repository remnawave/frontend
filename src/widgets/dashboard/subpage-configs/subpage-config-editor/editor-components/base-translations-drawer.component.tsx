import {
    BASE_TRANSLATION_KEYS,
    BASE_TRANSLATION_LABELS,
    TSubscriptionPageBaseTranslationKeys,
    TSubscriptionPageLanguageCode,
    TSubscriptionPageTranslateKeys
} from '@remnawave/subscription-page-types'
import { IconLanguage } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { Drawer, Stack } from '@mantine/core'

import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'

import { LocalizedTextEditor } from './localized-text-editor.component'

interface IProps {
    baseTranslations: TSubscriptionPageTranslateKeys
    enabledLocales: TSubscriptionPageLanguageCode[]
    onChange: (key: TSubscriptionPageBaseTranslationKeys, value: Record<string, string>) => void
    onClose: () => void
    opened: boolean
}

export function BaseTranslationsDrawer(props: IProps) {
    const { baseTranslations, enabledLocales, onChange, onClose, opened } = props
    const { t } = useTranslation()

    const getFilledCount = () => {
        let count = 0
        for (const key of BASE_TRANSLATION_KEYS) {
            const translations = baseTranslations[key]
            const allFilled = enabledLocales.every((locale) => translations[locale]?.trim())
            if (allFilled) count++
        }
        return count
    }

    const filledCount = getFilledCount()
    const totalKeys = BASE_TRANSLATION_KEYS.length

    return (
        <Drawer
            keepMounted={false}
            onClose={onClose}
            opened={opened}
            position="right"
            size="md"
            title={
                <BaseOverlayHeader
                    IconComponent={IconLanguage}
                    iconVariant="gradient-violet"
                    subtitle={t('base-translations-drawer.component.completed', {
                        count: filledCount,
                        total: totalKeys
                    })}
                    title={t('base-translations-drawer.component.base-translations')}
                />
            }
        >
            <Stack gap="sm">
                {BASE_TRANSLATION_KEYS.map((key) => (
                    <LocalizedTextEditor
                        enabledLocales={enabledLocales}
                        key={key}
                        label={BASE_TRANSLATION_LABELS[key]}
                        onChange={(value) => onChange(key, value)}
                        value={baseTranslations[key]}
                    />
                ))}
            </Stack>
        </Drawer>
    )
}
