import { Text } from '@mantine/core'

interface IProps {
    title?: null | string
}

export const SidebarTitleShared = (props: IProps) => {
    const { title } = props

    return (
        <Text
            ff="Unbounded"
            fw={700}
            size="lg"
            style={{
                userSelect: 'none',
                WebkitUserSelect: 'none'
            }}
        >
            <Text c="cyan" component="span" fw={700}>
                {title || 'Remna'}
            </Text>
            {title ? '' : 'wave'}
        </Text>
    )
}
