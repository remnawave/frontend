import {
    Box,
    Card,
    Group,
    Paper,
    SimpleGrid,
    Stack,
    Text,
    ThemeIcon,
    Title,
    Tooltip
} from '@mantine/core'
import { PiCloudArrowUpDuotone, PiUsersDuotone, PiWarningCircle } from 'react-icons/pi'
import { TbWifi, TbWifiOff } from 'react-icons/tb'
import { HiOutlineServer } from 'react-icons/hi'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { memo, useMemo } from 'react'

import { XtlsLogo } from '@shared/ui/logos/xtls-logo'
import { Logo } from '@shared/ui'

import { IProps } from './interface'

export const NodeDetailsCardWidget = memo(({ node, fetchedNode }: IProps) => {
    const { t } = useTranslation()

    const nodeData = fetchedNode || node

    const { icon, color, backgroundColor, borderColor, boxShadow } = useMemo(() => {
        let icon: React.ReactNode
        let color = 'red'
        let backgroundColor = 'rgba(239, 68, 68, 0.15)'
        let borderColor = 'rgba(239, 68, 68, 0.3)'
        let boxShadow = 'rgba(239, 68, 68, 0.2)'

        if (nodeData.isConnected) {
            icon = <TbWifi size={18} style={{ color: 'var(--mantine-color-teal-6)' }} />
            color = 'teal'
            backgroundColor = 'rgba(45, 212, 191, 0.15)'
            borderColor = 'rgba(45, 212, 191, 0.3)'
            boxShadow = 'rgba(45, 212, 191, 0.2)'
        } else if (nodeData.isConnecting) {
            icon = (
                <PiCloudArrowUpDuotone
                    size={18}
                    style={{ color: 'var(--mantine-color-yellow-6)' }}
                />
            )
            color = 'yellow'
            backgroundColor = 'rgba(245, 158, 11, 0.15)'
            borderColor = 'rgba(245, 158, 11, 0.3)'
            boxShadow = 'rgba(245, 158, 11, 0.2)'
        } else if (nodeData.isDisabled) {
            icon = <TbWifiOff size={18} style={{ color: 'var(--mantine-color-gray-6)' }} />
            color = 'gray'
            backgroundColor = 'rgba(107, 114, 128, 0.15)'
            borderColor = 'rgba(107, 114, 128, 0.3)'
            boxShadow = 'rgba(107, 114, 128, 0.2)'
        } else {
            icon = <PiWarningCircle size={18} style={{ color: 'var(--mantine-color-red-6)' }} />
            color = 'red'
            backgroundColor = 'rgba(239, 68, 68, 0.15)'
            borderColor = 'rgba(239, 68, 68, 0.3)'
            boxShadow = 'rgba(239, 68, 68, 0.2)'
        }

        return { icon, color, backgroundColor, borderColor, boxShadow }
    }, [nodeData.isConnected, nodeData.isConnecting, nodeData.isDisabled, t])

    return (
        <Card
            p="lg"
            radius="lg"
            style={{
                background: `
                    linear-gradient(135deg, 
                        rgba(15, 23, 42, 0.98) 0%,
                        rgba(30, 41, 59, 0.98) 50%,
                        rgba(15, 23, 42, 0.98) 100%
                    )
                `,
                border: '1px solid rgba(148, 163, 184, 0.1)',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            <Box
                style={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    width: 100,
                    height: 100,
                    background: `radial-gradient(circle, ${backgroundColor} 0%, transparent 70%)`,
                    borderRadius: '50%'
                }}
            />

            <Stack gap="md" style={{ position: 'relative', zIndex: 1 }}>
                <Group align="flex-start" justify="space-between">
                    <Group gap="xs" mt={5}>
                        <ThemeIcon
                            gradient={{ from: 'violet.4', to: 'purple.6', deg: 45 }}
                            size="sm"
                            style={{ borderRadius: '8px' }}
                            variant="gradient"
                        >
                            <HiOutlineServer size={14} />
                        </ThemeIcon>
                        <Box>
                            <Title c="white" fw={600} order={5}>
                                Node Details
                            </Title>
                        </Box>
                    </Group>

                    <motion.div
                        animate={{
                            scale: nodeData?.isConnected ? [1, 1.1, 1] : 1,
                            opacity: nodeData?.isConnected ? [1, 0.8, 1] : 0.6
                        }}
                        transition={{
                            duration: nodeData?.isConnected ? 2 : 0,
                            repeat: nodeData?.isConnected ? Infinity : 0
                        }}
                    >
                        <ThemeIcon
                            color={color}
                            size="lg"
                            style={{
                                backgroundColor,
                                border: `1px solid ${borderColor}`,
                                boxShadow: `0 0 15px ${boxShadow}`
                            }}
                            variant="light"
                        >
                            {icon}
                        </ThemeIcon>
                    </motion.div>
                </Group>

                {nodeData.isConnected && (
                    <SimpleGrid
                        cols={{
                            base: 1,
                            sm: 2,
                            md: 3
                        }}
                    >
                        <Paper
                            p="xs"
                            radius="md"
                            style={{
                                background:
                                    nodeData.usersOnline! > 0
                                        ? 'rgba(45, 212, 191, 0.1)'
                                        : 'rgba(107, 114, 128, 0.1)',
                                border: `1px solid ${
                                    nodeData.usersOnline! > 0
                                        ? 'rgba(45, 212, 191, 0.3)'
                                        : 'rgba(107, 114, 128, 0.3)'
                                }`
                            }}
                        >
                            <Group gap="xs" justify="center">
                                <PiUsersDuotone
                                    color={
                                        nodeData.usersOnline! > 0
                                            ? 'var(--mantine-color-teal-4)'
                                            : 'var(--mantine-color-gray-5)'
                                    }
                                    size={18}
                                />
                                <Text
                                    c={nodeData.usersOnline! > 0 ? 'teal.4' : 'gray.5'}
                                    fw={600}
                                    size="sm"
                                >
                                    {nodeData.usersOnline}
                                </Text>
                            </Group>
                        </Paper>

                        {nodeData.xrayVersion && (
                            <Paper
                                p="xs"
                                radius="md"
                                style={{
                                    background: 'rgba(139, 92, 246, 0.1)',
                                    border: '1px solid rgba(139, 92, 246, 0.3)'
                                }}
                            >
                                <Tooltip label="Xray Core Version">
                                    <Group gap="xs" justify="center">
                                        <XtlsLogo color="var(--mantine-color-violet-4)" size={18} />
                                        <Text c="violet.4" fw={600} size="sm">
                                            {nodeData.xrayVersion || 'N/A'}
                                        </Text>
                                    </Group>
                                </Tooltip>
                            </Paper>
                        )}

                        {nodeData.nodeVersion && (
                            <Paper
                                p="xs"
                                radius="md"
                                style={{
                                    background: 'rgba(99, 102, 241, 0.1)',
                                    border: '1px solid rgba(99, 102, 241, 0.3)'
                                }}
                            >
                                <Tooltip label="Node version, @remnawave/node">
                                    <Group gap="xs" justify="center">
                                        <Logo color="var(--mantine-color-indigo-4)" size={18} />
                                        <Text c="indigo.4" fw={600} size="sm">
                                            {nodeData.nodeVersion || 'N/A'}
                                        </Text>
                                    </Group>
                                </Tooltip>
                            </Paper>
                        )}
                    </SimpleGrid>
                )}
            </Stack>
        </Card>
    )
})
