import { Checkbox, Group, Stack, Text, ThemeIcon, ThemeIconProps } from '@mantine/core'
import { TFunction } from 'i18next'
import { ComponentType } from 'react'
import { useTranslation } from 'react-i18next'
import { TbFlask, TbLayoutSidebar, TbPlugConnected, TbRocket, TbTerminal2 } from 'react-icons/tb'

import { useIsMobile } from '@shared/hooks'
import { SettingsCardShared } from '@shared/ui/settings-card'

import {
    IExperimentalFeatures,
    useExperimentalFeatures,
    useViewPreferencesStoreActions
} from '@entities/dashboard/view-preferences-store'

import classes from './ExperimentalSettingsCard.module.css'

interface IExperimentalFeatureItem {
    color: ThemeIconProps['color']
    desktopOnly?: boolean
    feature: keyof IExperimentalFeatures
    IconComponent: ComponentType<{ size: number }>
    label: string
}

const getExperimentalFeatures = (t: TFunction): IExperimentalFeatureItem[] => [
    {
        color: 'cyan',
        desktopOnly: true,
        feature: 'legacyLayoutStyle',
        IconComponent: TbLayoutSidebar,
        label: t('experimental-settings-card.widget.legacy-layout-style')
    },
    {
        color: 'pink',
        feature: 'nodeIntegrations',
        IconComponent: TbPlugConnected,
        label: t('node-integrations.modal.title')
    },
    {
        color: 'cyan',
        desktopOnly: true,
        feature: 'sshTerminal',
        IconComponent: TbTerminal2,
        label: t('node-ssh.title')
    },
    {
        color: 'teal',
        desktopOnly: true,
        feature: 'quickLauncher',
        IconComponent: TbRocket,
        label: t('constants.quick-launcher')
    }
]

export const ExperimentalSettingsCardWidget = () => {
    const { t } = useTranslation()

    const isMobile = useIsMobile()

    const experimental = useExperimentalFeatures()
    const { setExperimentalFeature } = useViewPreferencesStoreActions()

    return (
        <SettingsCardShared.Container>
            <SettingsCardShared.Header
                description={t('experimental-settings-card.widget.description')}
                icon={<TbFlask size={24} />}
                iconColor="grape"
                iconVariant="soft"
                title={t('experimental-settings-card.widget.experimental-features')}
            />

            <SettingsCardShared.Content>
                <Stack gap="xs">
                    {getExperimentalFeatures(t)
                        .filter(({ desktopOnly }) => !desktopOnly || !isMobile)
                        .map(({ color, feature, IconComponent, label }) => (
                            <Checkbox.Card
                                checked={experimental[feature]}
                                className={classes.feature}
                                key={feature}
                                onClick={() =>
                                    setExperimentalFeature(feature, !experimental[feature])
                                }
                                radius="md"
                            >
                                <Group align="center" gap="sm" wrap="nowrap">
                                    <ThemeIcon color={color} radius="md" size="lg" variant="soft">
                                        <IconComponent size={20} />
                                    </ThemeIcon>

                                    <Text className={classes.label} flex={1} size="sm" truncate>
                                        {label}
                                    </Text>

                                    <Checkbox.Indicator size="sm" />
                                </Group>
                            </Checkbox.Card>
                        ))}
                </Stack>
            </SettingsCardShared.Content>
        </SettingsCardShared.Container>
    )
}
