import { ActionIcon, ActionIconProps, ElementProps } from '@mantine/core'
import clsx from 'clsx'
import classes from './hamburger-button.module.css'

type HamburgerButtonProps = ElementProps<'button', keyof ActionIconProps> &
    Omit<ActionIconProps, 'children' | 'variant'>

export function HamburgerButton({ className, ...props }: HamburgerButtonProps) {
    return (
        <ActionIcon variant="transparent" className={clsx(classes.root, className)} {...props}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className={classes.icon}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12H12m-8.25 5.25h16.5"
                />
            </svg>
        </ActionIcon>
    )
}
