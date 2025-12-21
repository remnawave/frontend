import {
    Divider,
    Group,
    Paper,
    Stack,
    Text,
    ThemeIcon,
    ThemeIconProps,
    UnstyledButton
} from '@mantine/core'
import { TbChevronRight, TbDevices, TbIcons, TbLanguage, TbReplace } from 'react-icons/tb'
import { TSubscriptionPageRawConfig } from '@remnawave/subscription-page-types'
import { useTranslation } from 'react-i18next'
import { modals } from '@mantine/modals'

import styles from './import-config-sections.module.css'

export type ImportMode = 'baseTranslations' | 'full' | 'platforms' | 'svgLibrary'

interface ImportOptionCardProps {
    description: string
    icon: React.ReactNode
    onClick: () => void
    title: string
    variant: ThemeIconProps['variant']
}

const ImportOptionCard = (props: ImportOptionCardProps) => {
    const { description, icon, onClick, title, variant } = props

    return (
        <UnstyledButton onClick={onClick} w="100%">
            <Paper className={styles.optionCard} p="md" radius="md" withBorder>
                <Group gap="md" justify="space-between" wrap="nowrap">
                    <Group gap="md" wrap="nowrap">
                        <ThemeIcon radius="md" size="xl" variant={variant}>
                            {icon}
                        </ThemeIcon>
                        <Stack gap={2}>
                            <Text fw={600} size="sm">
                                {title}
                            </Text>
                            <Text c="dimmed" size="xs">
                                {description}
                            </Text>
                        </Stack>
                    </Group>
                    <TbChevronRight color="var(--mantine-color-dimmed)" size={20} />
                </Group>
            </Paper>
        </UnstyledButton>
    )
}

interface ImportConfigSectionsModalProps {
    currentConfig: TSubscriptionPageRawConfig
    importedConfig: TSubscriptionPageRawConfig
    onImport: (mode: ImportMode) => void
}

export const ImportConfigSectionsModalContent = (props: ImportConfigSectionsModalProps) => {
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
                <ImportOptionCard
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
                    <ImportOptionCard
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
                    <ImportOptionCard
                        description={t(
                            'import-config-sections.modal.import-platforms-descriptions'
                        )}
                        icon={<TbDevices size={22} />}
                        onClick={handleImportPlatforms}
                        title={t('import-config-sections.modal.import-platforms')}
                        variant="gradient-cyan"
                    />
                )}

                <ImportOptionCard
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
