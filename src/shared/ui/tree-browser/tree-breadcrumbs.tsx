import { Breadcrumbs, UnstyledButton } from '@mantine/core'
import cx from 'clsx'
import { ReactNode } from 'react'
import { TbChevronRight } from 'react-icons/tb'

import classes from './TreeBrowser.module.css'

interface IProps {
    onNavigate: (path: string[]) => void
    path: string[]
    rootLabel: ReactNode
}

export function TreeBreadcrumbs(props: IProps) {
    const { onNavigate, path, rootLabel } = props

    return (
        <Breadcrumbs
            separator={<TbChevronRight className={classes.crumbSeparator} size={13} />}
            separatorMargin={6}
        >
            <UnstyledButton
                className={cx(classes.crumb, { [classes.crumbCurrent]: path.length === 0 })}
                onClick={() => onNavigate([])}
            >
                {rootLabel}
            </UnstyledButton>

            {path.map((segment, index) => (
                <UnstyledButton
                    className={cx(classes.crumb, {
                        [classes.crumbCurrent]: index === path.length - 1
                    })}
                    key={path.slice(0, index + 1).join('/')}
                    onClick={() => onNavigate(path.slice(0, index + 1))}
                >
                    {segment}
                </UnstyledButton>
            ))}
        </Breadcrumbs>
    )
}
