import { ActionIcon, Code, Divider, Drawer, Image, Stack } from '@mantine/core'
import { PiLink, PiSquareHalf } from 'react-icons/pi'
import { useDisclosure } from '@mantine/hooks'
import { useLocation } from 'react-router-dom'
import { useEffect } from 'react'

import { LanguagePicker } from '@shared/ui/language-picker/language-picker.shared'
import { Logo } from '@shared/ui/logo'
import { app } from 'src/config'

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
                    <Drawer.Body
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            height: '100%'
                        }}
                    >
                        <SidebarLayout />

                        <Stack gap={0}>
                            {' '}
                            {/* Группируем divider и нижние элементы */}
                            <Divider
                                label={
                                    <PiLink color={'var(--mantine-color-cyan-6)'} size={'1.4rem'} />
                                }
                                labelPosition="center"
                                mb="xs"
                                variant="dashed"
                            />
                            <Stack align="center" gap="xs">
                                <Image
                                    h="auto"
                                    onClick={() => window.open(app.githubOrg, '_blank')}
                                    radius="lg"
                                    src="https://badges.remna.st/remnawave"
                                    style={{ cursor: 'pointer' }}
                                    w="10rem"
                                />

                                <LanguagePicker />
                            </Stack>
                        </Stack>
                    </Drawer.Body>
                </Drawer.Content>
            </Drawer.Root>
            <ActionIcon display={{ xl: 'none' }} onClick={open} variant="transparent">
                <PiSquareHalf size={'1.8rem'} />
            </ActionIcon>
        </>
    )
}
