import { Group, Stack, Text, ThemeIcon, ThemeIconProps, Title, TitleProps } from '@mantine/core'
import ReactCountryFlag from 'react-country-flag'
import { useClipboard } from '@mantine/hooks'

type IProps = {
    actionIconProps?: ThemeIconProps
    countryCode?: string
    IconComponent: React.ComponentType<{ size: number }>
    iconSize?: number
    iconVariant: ThemeIconProps['variant']
    subtitle?: string
    title: string
    titleOrder?: TitleProps['order']
    withCopy?: boolean
}

export const BaseOverlayHeader = (props: IProps) => {
    const {
        actionIconProps,
        IconComponent,
        countryCode,
        iconSize = 20,
        iconVariant,
        subtitle,
        title,
        titleOrder = 4,
        withCopy = false
    } = props

    const { copy } = useClipboard()

    return (
        <Group gap="sm" wrap="nowrap">
            <ThemeIcon size="lg" variant={iconVariant} {...actionIconProps}>
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
