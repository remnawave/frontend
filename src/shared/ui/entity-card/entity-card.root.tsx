import { Box, Card } from '@mantine/core'
import clsx from 'clsx'

import classes from './entity-card.module.css'

interface EntityCardProps {
    children: React.ReactNode
    isActive?: boolean
    onClick?: () => void
}

export function EntityCardRoot(props: EntityCardProps) {
    const { children, isActive = true, onClick } = props

    return (
        <Card
            className={classes.card}
            data-clickable={onClick ? true : undefined}
            data-layout="row"
            onClick={onClick}
            onKeyDown={
                onClick
                    ? (event) => {
                          if (event.key !== 'Enter' && event.key !== ' ') return
                          if (event.target !== event.currentTarget) return

                          event.preventDefault()
                          onClick()
                      }
                    : undefined
            }
            pb={6}
            pl={12}
            pr={10}
            pt={6}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : undefined}
        >
            <Box className={clsx(classes.rail, { [classes.railInactive]: !isActive })} />
            {children}
        </Card>
    )
}
