import { Group, Loader, rem, Text } from '@mantine/core'
import { TbBrandGithub, TbStar } from 'react-icons/tb'

import { HeaderControl } from './HeaderControl'

interface GithubControlProps {
    isLoading?: boolean
    link: string
    stars?: number
}

export function GithubControl({
    link,
    stars,
    isLoading,

    ...others
}: GithubControlProps) {
    return (
        <HeaderControl
            component="a"
            href={link}
            rel="noopener noreferrer"
            target="_blank"
            w="auto"
            {...others}
        >
            <Group gap={8} ml={10} mr={10} wrap="nowrap">
                <TbBrandGithub style={{ width: rem(22), height: rem(22) }} />
                {isLoading ? (
                    <Group gap={8} wrap="nowrap">
                        <TbStar style={{ width: rem(16), height: rem(16), color: 'gold' }} />
                        <Loader color="white" size="xs" />
                    </Group>
                ) : (
                    stars !== undefined && (
                        <Group gap={4} wrap="nowrap">
                            <TbStar style={{ width: rem(16), height: rem(16), color: 'gold' }} />
                            <Text fw={600} size="sm">
                                {stars}
                            </Text>
                        </Group>
                    )
                )}
            </Group>
        </HeaderControl>
    )
}
