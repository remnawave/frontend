import { ActionIcon, HoverCard, Stack, Text } from '@mantine/core'
import { HiQuestionMarkCircle } from 'react-icons/hi'

interface IProps {
    children?: React.ReactNode
    text?: string
}

export const SubpageTooltips = (props: IProps) => {
    const { children, text } = props
    return (
        <HoverCard shadow="md" width={280} withArrow>
            <HoverCard.Target>
                <ActionIcon color="gray" size="xs" variant="subtle">
                    <HiQuestionMarkCircle size={20} />
                </ActionIcon>
            </HoverCard.Target>
            <HoverCard.Dropdown>
                {children && children}
                {text && (
                    <Stack gap="md">
                        <Stack gap="sm">
                            <Text c="dimmed" size="sm">
                                {text}
                            </Text>
                        </Stack>
                    </Stack>
                )}
            </HoverCard.Dropdown>
        </HoverCard>
    )
}
