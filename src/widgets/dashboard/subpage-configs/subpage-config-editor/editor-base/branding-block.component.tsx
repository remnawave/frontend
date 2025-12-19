import { TSubscriptionPageRawConfig } from '@remnawave/subscription-page-types'
import { Card, Divider, Stack, TextInput } from '@mantine/core'
import { IconPalette } from '@tabler/icons-react'
import { UseFormReturnType } from '@mantine/form'
import { useTranslation } from 'react-i18next'

import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'

import styles from '../subpage-config-visual-editor.module.css'

interface IProps {
    form: UseFormReturnType<TSubscriptionPageRawConfig>
}

export function BrandingBlockComponent({ form }: IProps) {
    const { t } = useTranslation()

    return (
        <Card className={styles.sectionCard} p="lg" radius="lg">
            <Stack gap="md" h="100%">
                <BaseOverlayHeader
                    IconComponent={IconPalette}
                    iconSize={20}
                    iconVariant="gradient-cyan"
                    subtitle={t('subpage-config-visual-editor.widget.brand-appearance')}
                    title={t('subpage-config-visual-editor.widget.branding')}
                    titleOrder={5}
                />

                <Divider className={styles.divider} />

                <TextInput
                    classNames={{ input: styles.inputDark }}
                    key={form.key('brandingSettings.title')}
                    label={t('subpage-config-visual-editor.widget.brand-title')}
                    placeholder={t('subpage-config-visual-editor.widget.your-brand-name')}
                    required
                    {...form.getInputProps('brandingSettings.title')}
                />

                <TextInput
                    classNames={{ input: styles.inputDark }}
                    key={form.key('brandingSettings.logoUrl')}
                    label={t('subpage-config-visual-editor.widget.logo-url')}
                    placeholder="https://example.com/logo.png"
                    required
                    {...form.getInputProps('brandingSettings.logoUrl')}
                />

                <TextInput
                    classNames={{ input: styles.inputDark }}
                    key={form.key('brandingSettings.supportUrl')}
                    label={t('subpage-config-visual-editor.widget.support-url')}
                    placeholder="https://t.me/support"
                    required
                    {...form.getInputProps('brandingSettings.supportUrl')}
                />
            </Stack>
        </Card>
    )
}
