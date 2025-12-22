import {
    Badge,
    Button,
    Group,
    Modal,
    Stack,
    Text,
    Textarea,
    TextInput,
    UnstyledButton
} from '@mantine/core'
import {
    getLanguageName,
    TSubscriptionPageLanguageCode,
    TSubscriptionPageLocalizedText
} from '@remnawave/subscription-page-types'
import { IconLanguage } from '@tabler/icons-react'
import { useDisclosure } from '@mantine/hooks'
import { useTranslation } from 'react-i18next'

import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'

import styles from '../subpage-config-visual-editor.module.css'

interface IProps {
    enabledLocales: TSubscriptionPageLanguageCode[]
    label: string
    multiline?: boolean
    onChange: (value: TSubscriptionPageLocalizedText) => void
    value: TSubscriptionPageLocalizedText
}

export function LocalizedTextEditor(props: IProps) {
    const { enabledLocales, label, multiline = false, onChange, value } = props
    const { t } = useTranslation()

    const [opened, { close, open }] = useDisclosure(false)

    const handleChange = (locale: TSubscriptionPageLanguageCode, text: string) => {
        onChange({ ...value, [locale]: text })
    }

    const InputComponent = multiline ? Textarea : TextInput

    const filledCount = enabledLocales.filter((locale) => value[locale]?.trim()).length
    const previewLocale = enabledLocales[0]
    const previewText =
        (previewLocale && value[previewLocale]) || t('localized-text-editor.component.not-set')

    return (
        <>
            <UnstyledButton className={styles.localizedTextButton} onClick={open} w="100%">
                <Group gap="sm" justify="space-between" wrap="nowrap">
                    <Group gap="xs" style={{ flex: 1, minWidth: 0 }} wrap="nowrap">
                        <IconLanguage
                            className={styles.localizedTextIcon}
                            size={16}
                            style={{ flexShrink: 0 }}
                        />
                        <div style={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
                            <Text c="dimmed" size="xs" truncate>
                                {label}
                            </Text>
                            <Text
                                c="white"
                                className={styles.localizedTextPreview}
                                size="sm"
                                truncate="end"
                            >
                                {previewText}
                            </Text>
                        </div>
                    </Group>
                    <Badge
                        color={filledCount === enabledLocales.length ? 'green' : 'gray'}
                        size="sm"
                    >
                        {filledCount}/{enabledLocales.length}
                    </Badge>
                </Group>
            </UnstyledButton>

            <Modal
                onClose={close}
                opened={opened}
                size="lg"
                title={
                    <BaseOverlayHeader
                        IconComponent={IconLanguage}
                        iconSize={18}
                        iconVariant="default"
                        title={label}
                        titleOrder={5}
                    />
                }
            >
                <Stack gap="md">
                    {enabledLocales.map((locale, index) => (
                        <InputComponent
                            autosize={!!multiline}
                            classNames={{ input: styles.inputDark }}
                            data-autofocus={index === 0}
                            description={index === 0 ? 'Primary language' : undefined}
                            key={locale}
                            label={getLanguageName(locale)}
                            minRows={multiline ? 3 : undefined}
                            onChange={(e) => handleChange(locale, e.target.value)}
                            placeholder={`Enter ${label.toLowerCase()}...`}
                            resize={multiline ? 'vertical' : undefined}
                            value={value[locale] || ''}
                        />
                    ))}
                    <Button fullWidth onClick={close} variant="light">
                        {t('localized-text-editor.component.done')}
                    </Button>
                </Stack>
            </Modal>
        </>
    )
}
