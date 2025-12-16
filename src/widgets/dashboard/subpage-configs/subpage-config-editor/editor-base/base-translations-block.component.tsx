import {
    BASE_TRANSLATION_LABELS,
    TSubscriptionPageBaseTranslationKeys,
    TSubscriptionPageLanguageCode,
    TSubscriptionPageRawConfig
} from '@remnawave/subscription-page-types'
import { Badge, Button, Card, Group } from '@mantine/core'
import { IconLanguage } from '@tabler/icons-react'
import { UseFormReturnType } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'

import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'

import { BaseTranslationsDrawer } from '../editor-components/base-translations-drawer.component'
import styles from '../subpage-config-visual-editor.module.css'

const TRANSLATION_KEYS = Object.keys(
    BASE_TRANSLATION_LABELS
) as TSubscriptionPageBaseTranslationKeys[]

interface IProps {
    form: UseFormReturnType<TSubscriptionPageRawConfig>
}

export function BaseTranslationsBlockComponent({ form }: IProps) {
    const values = form.getValues()

    const [drawerOpened, { close: closeDrawer, open: openDrawer }] = useDisclosure(false)

    const enabledLocales: TSubscriptionPageLanguageCode[] = values.locales

    const getFilledCount = () => {
        let count = 0
        for (const key of TRANSLATION_KEYS) {
            const translations = values.baseTranslations[key]
            const allFilled = enabledLocales.every((locale) => translations[locale]?.trim())
            if (allFilled) count++
        }
        return count
    }

    const filledCount = getFilledCount()
    const totalKeys = TRANSLATION_KEYS.length

    return (
        <>
            <Card className={styles.sectionCard} p="md" radius="lg">
                <Group justify="space-between">
                    <Group gap="sm" wrap="nowrap">
                        <BaseOverlayHeader
                            IconComponent={IconLanguage}
                            iconSize={20}
                            iconVariant="gradient-violet"
                            title="Base Translations"
                            titleOrder={5}
                        />
                        <Badge
                            color={filledCount === totalKeys ? 'green' : 'yellow'}
                            size="sm"
                            variant="light"
                        >
                            {filledCount}/{totalKeys}
                        </Badge>
                    </Group>

                    <Button
                        className={styles.saveButton}
                        leftSection={<IconLanguage size={16} />}
                        onClick={openDrawer}
                    >
                        Configure
                    </Button>
                </Group>
            </Card>

            <BaseTranslationsDrawer
                baseTranslations={values.baseTranslations}
                enabledLocales={enabledLocales}
                onChange={(key, value) => form.setFieldValue(`baseTranslations.${key}`, value)}
                onClose={closeDrawer}
                opened={drawerOpened}
            />
        </>
    )
}
