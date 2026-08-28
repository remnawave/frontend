import { Drawer, DrawerProps, Group, useProps } from '@mantine/core'
import { ReactNode } from 'react'

import classes from '@shared/constants/theme/overrides/drawer/drawer.module.css'

interface IProps {
    drawerProps: Omit<DrawerProps, 'children' | 'title'>
    children: ReactNode
    title: ReactNode
    buttons?: ReactNode
}

export const CompoundDrawerShared = (props: IProps) => {
    const { drawerProps, children, title, buttons } = props

    const rootProps = useProps('Drawer', {}, drawerProps)

    return (
        <Drawer.Root {...rootProps}>
            <Drawer.Overlay />
            <Drawer.Content className={classes.drawerContent}>
                <Drawer.Header className={classes.drawerHeader}>
                    <Drawer.Title>{title}</Drawer.Title>
                    <Group gap="xs" justify="flex-end" wrap="nowrap">
                        {buttons}
                        <Drawer.CloseButton />
                    </Group>
                </Drawer.Header>
                <Drawer.Body className={classes.drawerBody}>{children}</Drawer.Body>
            </Drawer.Content>
        </Drawer.Root>
    )
}
