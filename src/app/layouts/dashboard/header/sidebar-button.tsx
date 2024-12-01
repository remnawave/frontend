import { useDisclosure } from '@mantine/hooks'
import { useLocation } from 'react-router-dom'
import { Drawer } from '@mantine/core'
import { useEffect } from 'react'

import { HamburgerButton } from '@shared/ui/hamburger-button'
import { Logo } from '@shared/ui/logo'

import { Sidebar } from '../sidebar'

export function SidebarButton() {
    const location = useLocation()
    const [opened, { open, close }] = useDisclosure(false)

    useEffect(() => {
        close()
    }, [location.pathname])

    return (
        <>
            <Drawer.Root onClose={close} opened={opened} size="270px">
                <Drawer.Overlay />
                <Drawer.Content>
                    <Drawer.Header mb="md" px="1.725rem">
                        <Logo c="red" color="red" w="3rem" />
                    </Drawer.Header>
                    <Drawer.Body>
                        <Sidebar />
                    </Drawer.Body>
                </Drawer.Content>
            </Drawer.Root>
            <HamburgerButton display={{ xl: 'none' }} onClick={open} />
        </>
    )
}
