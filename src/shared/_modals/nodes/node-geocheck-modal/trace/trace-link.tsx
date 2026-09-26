import { Anchor } from '@mantine/core'
import { ReactNode } from 'react'

import { resolveIpInfoUrl } from './ipinfo'
import classes from './Trace.module.css'

interface IProps {
    children: ReactNode
    kind: 'as' | 'ip'
    value: number | string
}

export const TraceLink = (props: IProps) => {
    const { children, kind, value } = props

    return (
        <Anchor
            className={classes.link}
            href={resolveIpInfoUrl(value, kind)}
            inherit
            rel="noopener noreferrer"
            target="_blank"
            underline="never"
        >
            {children}
        </Anchor>
    )
}
