import { TbBrandAppstore, TbBuildingStore, TbLifebuoy, TbLink } from 'react-icons/tb'
import { Box, Group, Stack, TextInput, Title } from '@mantine/core'
import { useTranslation } from 'react-i18next'

interface BrandingSettingsProps {
    branding?: {
        logoUrl?: string
        name?: string
        supportUrl?: string
    }
    onChange: (branding: { logoUrl?: string; name?: string; supportUrl?: string }) => void
}

export const BrandingSettings = (props: BrandingSettingsProps) => {
    const { branding = {}, onChange } = props
    const { t } = useTranslation()

    const handleChange = (field: 'logoUrl' | 'name' | 'supportUrl', value: string) => {
        onChange({
            ...branding,
            [field]: value || undefined
        })
    }

    return (
        <Box>
            <Group align="center" gap="xs" mb="xs">
                <TbBrandAppstore size={16} />
                <Title order={6}>{t('branding-settings.component.branding-settings')}</Title>
            </Group>

            <Stack gap="xs">
                <TextInput
                    description={t(
                        'branding-settings.component.the-name-that-will-be-displayed-on-the-subscription-page'
                    )}
                    label={t('branding-settings.component.brand-name')}
                    leftSection={<TbBuildingStore size={14} />}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Subscription"
                    size="sm"
                    value={branding.name || ''}
                />

                <TextInput
                    description={t('branding-settings.component.url-to-your-brand-logo-image')}
                    label={t('branding-settings.component.logo-url')}
                    leftSection={<TbLink size={14} />}
                    onChange={(e) => handleChange('logoUrl', e.target.value)}
                    placeholder="https://example.com/logo.png"
                    size="sm"
                    value={branding.logoUrl || ''}
                />

                <TextInput
                    description={t('branding-settings.component.link-to-your-support-or-help-page')}
                    label={t('branding-settings.component.support-url')}
                    leftSection={<TbLifebuoy size={14} />}
                    onChange={(e) => handleChange('supportUrl', e.target.value)}
                    placeholder="https://example.com/support"
                    size="sm"
                    value={branding.supportUrl || ''}
                />
            </Stack>
        </Box>
    )
}
