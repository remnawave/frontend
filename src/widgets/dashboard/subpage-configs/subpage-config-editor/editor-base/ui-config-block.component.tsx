import {
    INSTALLATION_GUIDE_BLOCKS_VARIANTS_VALUES,
    SUBSCRIPTION_INFO_BLOCK_VARIANTS_VALUES,
    TSubscriptionPageRawConfig
} from '@remnawave/subscription-page-types'
import { Card, Divider, Select, SimpleGrid, Stack } from '@mantine/core'
import { IconPalette } from '@tabler/icons-react'
import { UseFormReturnType } from '@mantine/form'
import { useTranslation } from 'react-i18next'

import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'

import styles from '../subpage-config-visual-editor.module.css'

interface IProps {
    form: UseFormReturnType<TSubscriptionPageRawConfig>
}

export function UiConfigBlockComponent({ form }: IProps) {
    const { t } = useTranslation()

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
                        key={form.key('uiConfig.subscriptionInfoBlockType')}
                        label={t(
                            'subpage-config-visual-editor.widget.subscription-info-block-design'
                        )}
                        required
                        {...form.getInputProps('uiConfig.subscriptionInfoBlockType')}
                    />

                    <Select
                        allowDeselect={false}
                        classNames={{ input: styles.selectDark }}
                        data={INSTALLATION_GUIDE_BLOCKS_VARIANTS_VALUES}
                        key={form.key('uiConfig.installationGuidesBlockType')}
                        label={t('subpage-config-visual-editor.widget.installation-guides-design')}
                        required
                        {...form.getInputProps('uiConfig.installationGuidesBlockType')}
                    />
                </SimpleGrid>
            </Stack>
        </Card>
    )
}
