import { ActionIcon, Center, Code, Drawer, Group, Stack } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useLocation } from 'react-router-dom'
import { PiSquareHalf } from 'react-icons/pi'
import { useEffect, useState } from 'react'

import { TelegramIconShared } from '@shared/ui/telegram-icon/telegram-icon.shared'
import { GithubStarsShared } from '@shared/ui/github-stars/github-stars.shared'
import { BuildInfoModal } from '@shared/ui/build-info-modal/build-info-modal'
import { Logo } from '@shared/ui/logo'

import { SidebarLayout } from '../sidebar/sidebar.layout'
import packageJson from '../../../../../package.json'

export function MobileSidebarLayout() {
    const location = useLocation()
    const [opened, { open, close }] = useDisclosure(false)
    const [buildInfoModalOpened, setBuildInfoModalOpened] = useState(false)

    useEffect(() => {
        close()
    }, [location.pathname])

    return (
        <>
            <Drawer.Root onClose={close} opened={opened} size="270px">
                <Drawer.Overlay />
                <Drawer.Content>
                    <Drawer.Header mb="md" px="1.725rem">
                        <Stack gap="md" w="100%">
                            <Group justify="space-between" w="100%">
                                <Logo c="cyan" w="3rem" />
                                <Code
                                    c="cyan"
                                    fw={700}
                                    onClick={() => setBuildInfoModalOpened(true)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {`v${packageJson.version}`}
                                </Code>
                            </Group>
                            <Center>
                                <Group gap="sm">
                                    <TelegramIconShared />
                                    <GithubStarsShared />
                                </Group>
                            </Center>
                        </Stack>
                    </Drawer.Header>
                    <Drawer.Body
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            height: '100%'
                        }}
                    >
                        <SidebarLayout />
                    </Drawer.Body>
                </Drawer.Content>
            </Drawer.Root>
            <ActionIcon display={{ xl: 'none' }} onClick={open} variant="transparent">
                <PiSquareHalf size={'1.8rem'} />
            </ActionIcon>

            <BuildInfoModal
                onClose={() => setBuildInfoModalOpened(false)}
                opened={buildInfoModalOpened}
            />
        </>
    )
}
