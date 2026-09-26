import { Text } from '@mantine/core'
import { ReactNode } from 'react'

import classes from './entity-card.module.css'
import { EntityCardTags } from './entity-card.tags'

type MetaProps =
    | { badges: ReactNode; subtitle?: never }
    | { badges?: never; subtitle: ReactNode }
    | { badges?: never; subtitle?: never }

type ContentProps = { tags?: string[]; title: string } & MetaProps

export function EntityCardContent(props: ContentProps) {
    const { title, subtitle, badges, tags } = props

    return (
        <div className={classes.content}>
            <Text className={classes.title} ff="monospace" fw={600} title={title}>
                {title}
            </Text>

            {tags && tags.length > 0 && (
                <div className={classes.tags}>
                    <EntityCardTags tags={tags} />
                </div>
            )}

            <div className={classes.meta}>
                {subtitle ? <span className={classes.subtitle}>{subtitle}</span> : badges}
            </div>
        </div>
    )
}
