import { Badge, Button, Group, Scroller } from '@mantine/core'
import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { TbStack2, TbTag, TbTagOff } from 'react-icons/tb'

export const NO_TAG = '__no_tag__'

interface ITaggable {
    tags?: null | string[]
}

interface IProps {
    activeTag: null | string
    items: readonly ITaggable[] | undefined
    onChange: (tag: null | string) => void
}

interface ITabProps {
    count: number
    icon: React.ReactNode
    isActive: boolean
    label: string
    onClick: () => void
}

function FilterTab(props: ITabProps) {
    const { count, icon, isActive, label, onClick } = props
    return (
        <Button
            color={isActive ? 'cyan' : 'gray'}
            leftSection={icon}
            onClick={onClick}
            rightSection={
                <Badge
                    color={isActive ? 'cyan' : 'gray'}
                    radius="sm"
                    size="sm"
                    variant={isActive ? 'soft' : 'light'}
                >
                    {count}
                </Badge>
            }
            size="sm"
            style={{ flexShrink: 0 }}
            variant={isActive ? 'soft' : 'subtle'}
        >
            {label}
        </Button>
    )
}

export function TagFilterBar(props: IProps) {
    const { activeTag, items, onChange } = props
    const { t } = useTranslation()

    const { tags, tagCounts, untaggedCount } = useMemo(() => {
        const countMap = new Map<string, number>()
        let untagged = 0

        ;(items ?? []).forEach((item) => {
            const itemTags = item.tags ?? []
            if (itemTags.length === 0) {
                untagged += 1
                return
            }
            itemTags.forEach((tag) => countMap.set(tag, (countMap.get(tag) ?? 0) + 1))
        })

        return {
            tags: [...countMap.keys()].sort((a, b) => a.localeCompare(b)),
            tagCounts: countMap,
            untaggedCount: untagged
        }
    }, [items])

    useEffect(() => {
        if (activeTag === null) return
        const isStale = activeTag === NO_TAG ? untaggedCount === 0 : !tagCounts.has(activeTag)
        if (isStale) {
            onChange(null)
        }
    }, [activeTag, tagCounts, untaggedCount, onChange])

    if (tags.length === 0) {
        return null
    }

    return (
        <Scroller
            bdrs="md"
            draggable
            mb="xs"
            style={{
                border: '1px solid rgb(255, 255, 255, 0.08)',
                background: '#1b1f26'
            }}
        >
            <Group gap="xs" p="xs" wrap="nowrap">
                <FilterTab
                    count={items?.length ?? 0}
                    icon={<TbStack2 size={16} />}
                    isActive={activeTag === null}
                    label={t('common.field.all')}
                    onClick={() => onChange(null)}
                />

                {tags.map((tag) => (
                    <FilterTab
                        count={tagCounts.get(tag) ?? 0}
                        icon={<TbTag size={16} />}
                        isActive={activeTag === tag}
                        key={tag}
                        label={tag}
                        onClick={() => onChange(tag)}
                    />
                ))}

                {untaggedCount > 0 && (
                    <FilterTab
                        count={untaggedCount}
                        icon={<TbTagOff size={16} />}
                        isActive={activeTag === NO_TAG}
                        label={t('common.field.untagged')}
                        onClick={() => onChange(NO_TAG)}
                    />
                )}
            </Group>
        </Scroller>
    )
}

export function filterByTag<T extends { tags?: null | string[] }>(
    items: T[],
    activeTag: null | string
): T[] {
    if (activeTag === null) return items
    if (activeTag === NO_TAG) return items.filter((item) => (item.tags ?? []).length === 0)

    return items.filter((item) => (item.tags ?? []).includes(activeTag))
}
