import { Button } from '@mantine/core'

import classes from './entity-card.module.css'

interface ButtonActionProps {
    children: React.ReactNode
    color?: string
    leftSection?: React.ReactNode
    onClick?: (e: React.MouseEvent) => void
}

export function EntityCardButtonAction({
    children,
    leftSection,
    onClick,
    color = 'cyan'
}: ButtonActionProps) {
    return (
        <Button
            className={classes.button}
            color={color}
            fullWidth
            leftSection={leftSection}
            onClick={(e) => {
                e.stopPropagation()
                onClick?.(e)
            }}
            size="sm"
            variant="light"
        >
            {children}
        </Button>
    )
}
