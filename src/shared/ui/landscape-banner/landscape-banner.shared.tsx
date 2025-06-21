import { MdPhoneAndroid, MdScreenRotation } from 'react-icons/md'
import { Box, Paper, Stack, Text } from '@mantine/core'
import { motion } from 'motion/react'

export const LandscapeBannerShared = () => {
    return (
        <Box
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem'
            }}
        >
            <Paper
                p="xl"
                radius="xl"
                shadow="xl"
                style={{
                    maxWidth: '300px',
                    width: '100%',
                    backgroundColor: 'var(--mantine-color-dark-6)',
                    textAlign: 'center',
                    border: '1px solid var(--mantine-color-dark-4)'
                }}
            >
                <Stack align="center" gap="lg">
                    <Box style={{ position: 'relative' }}>
                        <motion.div
                            animate={{
                                rotate: [0, -15, 0, 15, 0],
                                scale: [1, 1.1, 1.2, 1.1, 1]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: 'easeInOut'
                            }}
                        >
                            <MdPhoneAndroid color="var(--mantine-color-cyan-4)" size={60} />
                        </motion.div>

                        <motion.div
                            animate={{
                                rotate: [0, 360],
                                scale: [0.8, 1.2, 0.8]
                            }}
                            style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)'
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: 'linear'
                            }}
                        >
                            <MdScreenRotation color="var(--mantine-color-orange-4)" size={24} />
                        </motion.div>
                    </Box>

                    <Stack align="center" gap="xs">
                        <Text c="gray.1" fw={700} size="lg">
                            Please rotate your device
                        </Text>

                        <Text c="gray.4" size="sm" style={{ lineHeight: 1.4 }} ta="center">
                            This page works better in landscape orientation.
                        </Text>
                    </Stack>

                    <Box
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            color: 'var(--mantine-color-gray-5)',
                            fontSize: '0.875rem'
                        }}
                    >
                        <Box
                            style={{
                                width: '30px',
                                height: '50px',
                                border: '2px solid var(--mantine-color-dark-3)',
                                borderRadius: '6px',
                                position: 'relative',
                                backgroundColor: 'var(--mantine-color-dark-7)'
                            }}
                        />

                        <motion.div
                            animate={{ x: [0, 10, 0] }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: 'easeInOut'
                            }}
                        >
                            <MdScreenRotation color="var(--mantine-color-cyan-4)" size={20} />
                        </motion.div>

                        <Box
                            style={{
                                width: '50px',
                                height: '30px',
                                border: '2px solid var(--mantine-color-cyan-6)',
                                borderRadius: '6px',
                                backgroundColor: 'var(--mantine-color-dark-5)'
                            }}
                        />
                    </Box>
                </Stack>
            </Paper>
        </Box>
    )
}
