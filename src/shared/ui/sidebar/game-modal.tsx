import { Button, Group, Text } from '@mantine/core'
import { PiGameController } from 'react-icons/pi'
import { useNavigate } from 'react-router-dom'

import { useEasterEggStore } from '@entities/dashboard/easter-egg-store'
import { ROUTES } from '@shared/constants'

export const GameModalShared = () => {
    const navigate = useNavigate()

    const { closeGameModal, isGameModalOpen } = useEasterEggStore()

    if (!isGameModalOpen) {
        return null
    }

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: 'var(--mantine-color-dark-8)',
                    border: '1px solid var(--mantine-color-gray-6)',
                    padding: '2rem',
                    borderRadius: '8px',
                    textAlign: 'center',
                    maxWidth: '400px',
                    width: '90%',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
                }}
            >
                <Text fw={700} mb="md" size="xl">
                    🎉 Easter Egg Found
                </Text>
                <Text mb="md">You've discovered the hidden Proxy Defense game!</Text>
                <Group gap="md" justify="center">
                    <Button onClick={closeGameModal} size="md" variant="light">
                        Close
                    </Button>
                    <Button
                        leftSection={<PiGameController size={22} />}
                        onClick={() => {
                            closeGameModal()
                            navigate(ROUTES.DASHBOARD.EASTER_EGG.PROXY_DEFENSE)
                        }}
                        size="md"
                    >
                        Play Game
                    </Button>
                </Group>
            </div>
        </div>
    )
}
