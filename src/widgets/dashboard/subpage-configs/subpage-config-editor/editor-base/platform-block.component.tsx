import {
    TSubscriptionPageLocales,
    TSubscriptionPagePlatformKey,
    TSubscriptionPagePlatformSchema,
    TSubscriptionPageRawConfig
} from '@remnawave/subscription-page-types'
import { Accordion, Card, Divider, Group, Select, Stack, Text } from '@mantine/core'
import { IconDeviceDesktop, IconPlus } from '@tabler/icons-react'
import { UseFormReturnType } from '@mantine/form'
import { useTranslation } from 'react-i18next'

import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'

import { AVAILABLE_PLATFORMS, PLATFORM_LABELS } from '../subpage-config.constants'
import { PlatformEditor } from '../editor-components/platform-editor.component'
import styles from '../subpage-config-visual-editor.module.css'

interface IProps {
    form: UseFormReturnType<TSubscriptionPageRawConfig>
}

export function PlatformBlockComponent(props: IProps) {
    const { form } = props
    const { t } = useTranslation()
    const values = form.getValues()

    const enabledLocales: TSubscriptionPageLocales[] = ['en', ...values.additionalLocales]

    const existingPlatforms = Object.keys(values.platforms) as TSubscriptionPagePlatformKey[]
    const availablePlatformsToAdd = AVAILABLE_PLATFORMS.filter(
        (p) => !existingPlatforms.includes(p.value)
    )

    const handleAddPlatform = (platformKey: TSubscriptionPagePlatformKey) => {
        const currentPlatforms = form.getValues().platforms
        if (currentPlatforms[platformKey]) return

        const newPlatform: TSubscriptionPagePlatformSchema = {
            apps: [],
            displayName: { en: PLATFORM_LABELS[platformKey] },
            svgIconKey: ''
        }

        form.setFieldValue(`platforms.${platformKey}`, newPlatform)
    }

    const handlePlatformChange = (
        platformKey: TSubscriptionPagePlatformKey,
        updatedPlatform: TSubscriptionPagePlatformSchema
    ) => {
        form.setFieldValue(`platforms.${platformKey}`, updatedPlatform)
    }

    const handlePlatformDelete = (platformKey: TSubscriptionPagePlatformKey) => {
        const currentPlatforms = form.getValues().platforms
        const { [platformKey]: _, ...rest } = currentPlatforms
        form.setFieldValue('platforms', rest)
    }

    return (
        <Card className={styles.sectionCard} p="lg" radius="lg">
            <Stack gap="md">
                <Group justify="space-between">
                    <BaseOverlayHeader
                        IconComponent={IconDeviceDesktop}
                        iconSize={20}
                        iconVariant="gradient-violet"
                        subtitle={t(
                            'subpage-config-visual-editor.widget.configure-apps-for-each-platform'
                        )}
                        title={t('subpage-config-visual-editor.widget.platforms')}
                        titleOrder={5}
                    />

                    {availablePlatformsToAdd.length > 0 && (
                        <Select
                            allowDeselect={false}
                            classNames={{ input: styles.selectDark }}
                            data={availablePlatformsToAdd}
                            leftSection={<IconPlus size={20} />}
                            onChange={(value) => {
                                if (value) handleAddPlatform(value as TSubscriptionPagePlatformKey)
                            }}
                            placeholder={t('subpage-config-visual-editor.widget.add-platform')}
                            value={null}
                            w={180}
                        />
                    )}
                </Group>

                <Divider className={styles.divider} />

                {existingPlatforms.length === 0 ? (
                    <div className={styles.emptyState}>
                        <IconDeviceDesktop size={32} stroke={1.5} />
                        <Text mt="sm" size="sm">
                            {t('subpage-config-visual-editor.widget.no-platforms-configured')}
                        </Text>
                        <Text c="dimmed" size="xs">
                            {t('subpage-config-visual-editor.widget.add-a-platform-to-get-started')}
                        </Text>
                    </div>
                ) : (
                    <Accordion
                        chevronPosition="right"
                        className={styles.accordion}
                        multiple
                        variant="separated"
                    >
                        {existingPlatforms.map((platformKey) => {
                            const platform = values.platforms[platformKey]
                            if (!platform) return null
                            return (
                                <PlatformEditor
                                    enabledLocales={enabledLocales}
                                    key={platformKey}
                                    onChange={(p) => handlePlatformChange(platformKey, p)}
                                    onDelete={() => handlePlatformDelete(platformKey)}
                                    platform={platform}
                                    platformKey={platformKey}
                                    svgLibrary={values.svgLibrary}
                                />
                            )
                        })}
                    </Accordion>
                )}
            </Stack>
        </Card>
    )
}
