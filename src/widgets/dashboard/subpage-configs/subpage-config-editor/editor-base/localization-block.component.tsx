import {
    TSubscriptionPageConfigAdditionalLocales,
    TSubscriptionPageLocales,
    TSubscriptionPageRawConfig
} from '@remnawave/subscription-page-types'
import { Badge, Card, Divider, Group, SimpleGrid, Stack } from '@mantine/core'
import { UseFormReturnType } from '@mantine/form'
import { IconGlobe } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'

import { LocaleCard } from '../editor-components/locale-card.component'
import styles from '../subpage-config-visual-editor.module.css'
import { LOCALE_DATA } from '../subpage-config.constants'

interface IProps {
    form: UseFormReturnType<TSubscriptionPageRawConfig>
}

export function LocalizationBlockComponent({ form }: IProps) {
    const { t } = useTranslation()
    const { additionalLocales } = form.getValues()

    const isLocaleActive = (code: TSubscriptionPageLocales, isDefault?: boolean) =>
        isDefault || additionalLocales.includes(code as TSubscriptionPageConfigAdditionalLocales)

    const toggleLocale = (code: TSubscriptionPageConfigAdditionalLocales) => {
        const has = additionalLocales.includes(code)
        form.setFieldValue(
            'additionalLocales',
            has ? additionalLocales.filter((l) => l !== code) : [...additionalLocales, code]
        )
    }

    return (
        <Card className={styles.sectionCard} p="lg" radius="lg">
            <Stack gap="md" h="100%">
                <Group gap="sm" justify="space-between">
                    <BaseOverlayHeader
                        IconComponent={IconGlobe}
                        iconSize={20}
                        iconVariant="gradient-teal"
                        subtitle={t('subpage-config-visual-editor.widget.additional-languages')}
                        title={t('subpage-config-visual-editor.widget.localization')}
                        titleOrder={5}
                    />

                    <Badge color="teal" size="sm" variant="light">
                        {additionalLocales.length + 1} active
                    </Badge>
                </Group>

                <Divider className={styles.divider} />

                <SimpleGrid cols={2} spacing="xs">
                    {LOCALE_DATA.map((locale) => (
                        <LocaleCard
                            key={locale.code}
                            {...locale}
                            isActive={isLocaleActive(locale.code, locale.isDefault)}
                            onToggle={() =>
                                toggleLocale(
                                    locale.code as TSubscriptionPageConfigAdditionalLocales
                                )
                            }
                        />
                    ))}
                </SimpleGrid>
            </Stack>
        </Card>
    )
}
