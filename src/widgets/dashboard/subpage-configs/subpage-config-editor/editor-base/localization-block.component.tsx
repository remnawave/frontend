import {
    getLanguagesArray,
    TSubscriptionPageLanguageCode,
    TSubscriptionPageRawConfig
} from '@remnawave/subscription-page-types'
import { Badge, Card, Divider, Group, ScrollArea, SimpleGrid, Stack } from '@mantine/core'
import { UseFormReturnType } from '@mantine/form'
import { IconGlobe } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'

import { LocaleCard } from '../editor-components/locale-card.component'
import styles from '../subpage-config-visual-editor.module.css'

const ALL_LANGUAGES = getLanguagesArray()

interface IProps {
    form: UseFormReturnType<TSubscriptionPageRawConfig>
}

export function LocalizationBlockComponent({ form }: IProps) {
    const { t } = useTranslation()
    const { locales } = form.getValues()

    const toggleLocale = (code: TSubscriptionPageLanguageCode) => {
        if (locales.includes(code)) {
            if (locales.length > 1) {
                form.setFieldValue(
                    'locales',
                    locales.filter((l) => l !== code)
                )
            }
        } else {
            form.setFieldValue('locales', [...locales, code])
        }
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
                        {locales.length} active
                    </Badge>
                </Group>

                <Divider className={styles.divider} />

                <ScrollArea.Autosize mah={200} type="always">
                    <SimpleGrid cols={{ base: 1, md: 2 }} ml="md" mr="md" spacing="xs">
                        {ALL_LANGUAGES.map((lang) => {
                            const isActive = locales.includes(lang.code)
                            return (
                                <LocaleCard
                                    code={lang.code}
                                    isActive={isActive}
                                    isToggleDisabled={isActive && locales.length === 1}
                                    key={lang.code}
                                    onToggle={() => toggleLocale(lang.code)}
                                />
                            )
                        })}
                    </SimpleGrid>
                </ScrollArea.Autosize>
            </Stack>
        </Card>
    )
}
