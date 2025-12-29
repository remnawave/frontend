import { TSubscriptionPageRawConfig } from '@remnawave/subscription-page-types'
import { TbDevices, TbIcons, TbLanguage, TbReplace } from 'react-icons/tb'
import { Divider, Stack, Text } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { modals } from '@mantine/modals'

import { ActionCardShared } from '@shared/ui'

export type ImportMode = 'baseTranslations' | 'full' | 'platforms' | 'svgLibrary'

interface IProps {
    currentConfig: TSubscriptionPageRawConfig
    importedConfig: TSubscriptionPageRawConfig
    onImport: (mode: ImportMode) => void
}

export const ImportConfigSectionsModalContent = (props: IProps) => {
    const { currentConfig, importedConfig, onImport } = props
    const { t } = useTranslation()

    const hasPlatforms = Object.keys(importedConfig.platforms).length > 0
    const hasSvgLibrary = Object.keys(importedConfig.svgLibrary).length > 0

    const currentSvgCount = Object.keys(currentConfig.svgLibrary).length
    const importedSvgCount = Object.keys(importedConfig.svgLibrary).length

    const handleImportPlatforms = () => {
        onImport('platforms')
        modals.closeAll()
    }

    const handleImportSvgLibrary = () => {
        onImport('svgLibrary')
        modals.closeAll()
    }

    const handleFullImport = () => {
        onImport('full')
        modals.closeAll()
    }

    const handleImportBaseTranslations = () => {
        onImport('baseTranslations')
        modals.closeAll()
    }

    return (
        <Stack gap="md">
            <Text c="dimmed" size="sm">
                {t('import-config-sections.modal.import-options-description')}
            </Text>

            <Stack gap="sm">
                <ActionCardShared
                    description={t(
                        'import-config-sections.modal.replace-entire-config-with-imported-one'
                    )}
                    icon={<TbReplace size={22} />}
                    onClick={handleFullImport}
                    title={t('import-config-sections.modal.full-import')}
                    variant="gradient-red"
                />

                {(hasPlatforms || hasSvgLibrary) && (
                    <Divider
                        label={t('import-config-sections.modal.partial-import')}
                        labelPosition="center"
                        my="xs"
                    />
                )}

                {hasSvgLibrary && (
                    <ActionCardShared
                        description={t('import-config-sections.modal.merge-svg-library', {
                            0: importedSvgCount,
                            1: currentSvgCount
                        })}
                        icon={<TbIcons size={22} />}
                        onClick={handleImportSvgLibrary}
                        title={t('import-config-sections.modal.import-svg-library')}
                        variant="gradient-violet"
                    />
                )}

                {hasPlatforms && (
                    <ActionCardShared
                        description={t(
                            'import-config-sections.modal.import-platforms-descriptions'
                        )}
                        icon={<TbDevices size={22} />}
                        onClick={handleImportPlatforms}
                        title={t('import-config-sections.modal.import-platforms')}
                        variant="gradient-cyan"
                    />
                )}

                <ActionCardShared
                    description={t(
                        'import-config-sections.modal.replace-base-translation-and-locales'
                    )}
                    icon={<TbLanguage size={22} />}
                    onClick={handleImportBaseTranslations}
                    title={t('import-config-sections.modal.import-base-translations')}
                    variant="gradient-yellow"
                />
            </Stack>
        </Stack>
    )
}
