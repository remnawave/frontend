import { Text } from '@mantine/core'

export function RequiredAsterisk() {
    return (
        <Text c="red" component="span" fz="inherit" inherit ml={4}>
            *
        </Text>
    )
}
