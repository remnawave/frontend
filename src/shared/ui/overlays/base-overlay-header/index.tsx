import { Group, Stack, Text, ThemeIcon, ThemeIconProps, Title, TitleProps } from '@mantine/core'
import { useClipboard } from '@mantine/hooks'
import { ReactNode } from 'react'
import ReactCountryFlag from 'react-country-flag'

import { TOpenEntity } from '@shared/constants'
import { CopyEntityLinkButton } from '@shared/ui/copy-entity-link-button'

type IProps = {
    countryCode?: string
    hideIcon?: boolean
    icon?: ReactNode
    iconColor?: ThemeIconProps['color']
    IconComponent: React.ComponentType<{ size: number }>
    iconSize?: number
    iconVariant: ThemeIconProps['variant']
    openEntity?: { entity: TOpenEntity; id: number | string }
    subtitle?: ReactNode | string
    themeIconProps?: ThemeIconProps
    title: string
    titleOrder?: TitleProps['order']
    truncateTitle?: boolean
    withCopy?: boolean
}

export const BaseOverlayHeader = (props: IProps) => {
    const {
        themeIconProps,
        IconComponent,
        countryCode,
        iconSize = 20,
        iconVariant,
        iconColor = 'cyan',
        openEntity,
        subtitle,
        title,
        titleOrder = 4,
        withCopy = false,
        hideIcon = false,
        icon,
        truncateTitle = false
    } = props

    const { copy } = useClipboard()

    return (
        <Group gap="sm" style={truncateTitle ? { minWidth: 0 } : undefined} wrap="nowrap">
            {!hideIcon && (
                <ThemeIcon color={iconColor} size="lg" variant={iconVariant} {...themeIconProps}>
                    <IconComponent size={iconSize} />
                </ThemeIcon>
            )}

            {icon ?? icon}

            {countryCode && countryCode !== 'XX' && (
                <ReactCountryFlag countryCode={countryCode} style={{ fontSize: '1.5em' }} />
            )}

            <Stack gap="0" style={truncateTitle ? { overflow: 'hidden' } : undefined}>
                <Title
                    c="white"
                    onClick={() => withCopy && copy(title)}
                    order={titleOrder}
                    style={{
                        cursor: withCopy ? 'copy' : 'default',
                        ...(truncateTitle && {
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        })
                    }}
                >
                    {title}
                </Title>
                <Text
                    c="dimmed"
                    onClick={() => withCopy && copy(subtitle)}
                    size="xs"
                    style={{ cursor: withCopy ? 'copy' : 'default' }}
                >
                    {subtitle}
                </Text>
            </Stack>

            {openEntity && <CopyEntityLinkButton entity={openEntity.entity} id={openEntity.id} />}
        </Group>
    )
}
