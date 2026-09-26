import { Badge, Stack, Tooltip } from '@mantine/core'
import ColorHash from 'color-hash'
import { TbTag } from 'react-icons/tb'

import { SingleRowOverflowList } from '@shared/ui/single-row-overflow-list'

const ch = new ColorHash({ lightness: [0.65, 0.65, 0.65] })

interface IProps {
    tags: string[]
}

export function EntityCardTags({ tags }: IProps) {
    if (tags.length === 0) return null

    const sorted = [...tags].sort((a, b) => a.localeCompare(b))

    return (
        <SingleRowOverflowList
            data={sorted}
            gap={0}
            maxVisibleItems={2}
            renderItem={(tag) => (
                <Badge
                    autoContrast
                    color={ch.hex(tag)}
                    key={tag}
                    leftSection={<TbTag size={12} />}
                    px={6}
                    size="md"
                    variant="transparent"
                >
                    {tag}
                </Badge>
            )}
            renderOverflow={(hidden) => (
                <Tooltip
                    label={
                        <Stack gap={4}>
                            {hidden.map((tag) => (
                                <Badge
                                    color={ch.hex(tag)}
                                    fullWidth
                                    key={tag}
                                    leftSection={<TbTag size={12} />}
                                    size="md"
                                    variant="transparent"
                                >
                                    {tag}
                                </Badge>
                            ))}
                        </Stack>
                    }
                    multiline
                    position="top"
                >
                    <Badge color="gray" px={6} size="md" variant="transparent">
                        +{hidden.length}
                    </Badge>
                </Tooltip>
            )}
        />
    )
}
