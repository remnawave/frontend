import { ActionIcon, Code, Drawer } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useLocation } from 'react-router-dom'
import { PiSquareHalf } from 'react-icons/pi'
import { useEffect } from 'react'

import { Logo } from '@shared/ui/logo'

import { SidebarLayout } from '../sidebar/sidebar.layout'
import packageJson from '../../../../../package.json'

export function MobileSidebarLayout() {
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
                        <Logo c="cyan" w="3rem" />
                        <Code c="cyan" fw={700}>
                            {`v${packageJson.version}`}
                        </Code>
                    </Drawer.Header>
                    <Drawer.Body>
                        <SidebarLayout />
                    </Drawer.Body>
                </Drawer.Content>
            </Drawer.Root>
            <ActionIcon display={{ xl: 'none' }} onClick={open} variant="transparent">
                <PiSquareHalf size={'1.8rem'} />
            </ActionIcon>
        </>
    )
}
