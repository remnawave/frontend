import { Group, Stack, Text, ThemeIcon, ThemeIconProps, Title, TitleProps } from '@mantine/core'
import ReactCountryFlag from 'react-country-flag'
import { useClipboard } from '@mantine/hooks'

type IProps = {
    countryCode?: string
    iconColor?: ThemeIconProps['color']
    IconComponent: React.ComponentType<{ size: number }>
    iconSize?: number
    iconVariant: ThemeIconProps['variant']
    subtitle?: string
    themeIconProps?: ThemeIconProps
    title: string
    titleOrder?: TitleProps['order']
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
        subtitle,
        title,
        titleOrder = 4,
        withCopy = false
    } = props

    const { copy } = useClipboard()

    return (
        <Group gap="sm" wrap="nowrap">
            <ThemeIcon color={iconColor} size="lg" variant={iconVariant} {...themeIconProps}>
                <IconComponent size={iconSize} />
            </ThemeIcon>

            {countryCode && countryCode !== 'XX' && (
                <ReactCountryFlag countryCode={countryCode} style={{ fontSize: '1.5em' }} />
            )}

            <Stack gap="0">
                <Title
                    c="white"
                    onClick={() => withCopy && copy(title)}
                    order={titleOrder}
                    style={{
                        cursor: withCopy ? 'copy' : 'default'
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
        </Group>
    )
}
