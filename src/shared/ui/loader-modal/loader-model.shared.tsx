import { Center, CenterProps, ElementProps, Loader, Stack, Text } from '@mantine/core'

interface IProps extends CenterProps, ElementProps<'div', keyof CenterProps> {
    text?: string
}

export function LoaderModalShared(props: IProps) {
    const { text, ...rest } = props

    return (
        <Center {...rest}>
            <Stack align="center" gap="sm">
                <Loader size="lg" />
                {text && (
                    <Text c="dimmed" size="sm">
                        {text}
                    </Text>
                )}
            </Stack>
        </Center>
    )
}
