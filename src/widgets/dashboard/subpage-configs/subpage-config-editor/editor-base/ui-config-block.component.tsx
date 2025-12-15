import {
    INSTALLATION_GUIDE_BLOCKS_VARIANTS_VALUES,
    SUBSCRIPTION_INFO_BLOCK_VARIANTS_VALUES,
    TSubscriptionPageLocales,
    TSubscriptionPageRawConfig
} from '@remnawave/subscription-page-types'
import { Card, Divider, Select, SimpleGrid, Stack } from '@mantine/core'
import { IconPalette } from '@tabler/icons-react'
import { UseFormReturnType } from '@mantine/form'
import { useTranslation } from 'react-i18next'

import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'

import { LocalizedTextEditor } from '../editor-components/localized-text-editor.component'
import styles from '../subpage-config-visual-editor.module.css'

interface IProps {
    form: UseFormReturnType<TSubscriptionPageRawConfig>
}

export function UiConfigBlockComponent({ form }: IProps) {
    const { t } = useTranslation()
    const values = form.getValues()

    const enabledLocales: TSubscriptionPageLocales[] = ['en', ...values.additionalLocales]

    return (
        <Card className={styles.sectionCard} p="lg" radius="lg">
            <Stack gap="md">
                <BaseOverlayHeader
                    IconComponent={IconPalette}
                    iconSize={20}
                    iconVariant="gradient-yellow"
                    title={t('subpage-config-visual-editor.widget.ui-configuration')}
                    titleOrder={5}
                />

                <Divider className={styles.divider} />

                <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
                    <Select
                        allowDeselect={false}
                        classNames={{ input: styles.selectDark }}
                        data={SUBSCRIPTION_INFO_BLOCK_VARIANTS_VALUES}
                        key={form.key('uiConfig.subscriptionInfo.block')}
                        label={t(
                            'subpage-config-visual-editor.widget.subscription-info-block-design'
                        )}
                        required
                        {...form.getInputProps('uiConfig.subscriptionInfo.block')}
                    />

                    <Select
                        allowDeselect={false}
                        classNames={{ input: styles.selectDark }}
                        data={INSTALLATION_GUIDE_BLOCKS_VARIANTS_VALUES}
                        key={form.key('uiConfig.installationGuides.block')}
                        label={t('subpage-config-visual-editor.widget.installation-guides-design')}
                        required
                        {...form.getInputProps('uiConfig.installationGuides.block')}
                    />

                    <LocalizedTextEditor
                        enabledLocales={enabledLocales}
                        label={t('subpage-config-visual-editor.widget.connection-keys-header')}
                        onChange={(value) =>
                            form.setFieldValue('uiConfig.connectionKeys.headerText', value)
                        }
                        value={values.uiConfig.connectionKeys.headerText}
                    />

                    <LocalizedTextEditor
                        enabledLocales={enabledLocales}
                        label={t('subpage-config-visual-editor.widget.installation-guides-header')}
                        onChange={(value) =>
                            form.setFieldValue('uiConfig.installationGuides.headerText', value)
                        }
                        value={values.uiConfig.installationGuides.headerText}
                    />
                </SimpleGrid>
            </Stack>
        </Card>
    )
}
