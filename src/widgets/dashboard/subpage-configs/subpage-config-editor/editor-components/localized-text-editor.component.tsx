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
    TSubscriptionPageLocales,
    TSubscriptionPageLocalizedText
} from '@remnawave/subscription-page-types'
import { IconLanguage } from '@tabler/icons-react'
import { useDisclosure } from '@mantine/hooks'
import { useTranslation } from 'react-i18next'

import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'

import styles from '../subpage-config-visual-editor.module.css'
import { LOCALE_LABELS } from '../subpage-config.constants'

interface IProps {
    enabledLocales: TSubscriptionPageLocales[]
    label: string
    multiline?: boolean
    onChange: (value: TSubscriptionPageLocalizedText) => void
    value: TSubscriptionPageLocalizedText
}

export function LocalizedTextEditor(props: IProps) {
    const { enabledLocales, label, multiline = false, onChange, value } = props
    const { t } = useTranslation()

    const [opened, { close, open }] = useDisclosure(false)
    const allLocales: TSubscriptionPageLocales[] = [
        'en',
        ...enabledLocales.filter((l) => l !== 'en')
    ]

    const handleChange = (locale: TSubscriptionPageLocales, text: string) => {
        onChange({ ...value, [locale]: text })
    }

    const InputComponent = multiline ? Textarea : TextInput

    const filledCount = allLocales.filter((locale) => value[locale]?.trim()).length
    const previewText = value.en || t('localized-text-editor.component.not-set')

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
                    <Badge color={filledCount === allLocales.length ? 'green' : 'gray'} size="sm">
                        {filledCount}/{allLocales.length}
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
                    {allLocales.map((locale) => (
                        <InputComponent
                            classNames={{ input: styles.inputDark }}
                            description={
                                locale === 'en'
                                    ? t('localized-text-editor.component.required-default-language')
                                    : undefined
                            }
                            key={locale}
                            label={LOCALE_LABELS[locale]}
                            minRows={multiline ? 4 : undefined}
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
