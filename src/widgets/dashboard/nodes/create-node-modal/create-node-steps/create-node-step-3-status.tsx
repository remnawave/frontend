import { Alert, Badge, Button, Code, Group, Paper, Stack, Text } from '@mantine/core'
import { TbAlertCircle, TbCheck, TbLink, TbX } from 'react-icons/tb'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'

import { LottieCheckmarkShared } from '@shared/ui/lotties/checkmark'
import { useNodesStoreActions } from '@entities/dashboard/nodes'
import { LottieStopShared } from '@shared/ui/lotties/stop'
import { LottieLinkShared } from '@shared/ui/lotties'
import { useGetNode } from '@shared/api/hooks'

interface IProps {
    nodeUuid?: string
    onClose: () => void
}

enum STATUS {
    CONNECTED = 'connected',
    CONNECTING = 'connecting',
    ERROR = 'error'
}

export const CreateNodeStep3Status = ({ nodeUuid, onClose }: IProps) => {
    const { t } = useTranslation()
    const [status, setStatus] = useState<STATUS>(STATUS.CONNECTING)
    const [errorMessage, setErrorMessage] = useState<null | string>(null)
    const actions = useNodesStoreActions()

    const { data: node, isLoading } = useGetNode({
        route: {
            uuid: nodeUuid ?? ''
        },
        rQueryParams: {
            enabled: !!nodeUuid,
            refetchInterval: 2_000
        }
    })

    useEffect(() => {
        if (isLoading) {
            setStatus(STATUS.CONNECTING)
            setErrorMessage(null)
            return
        }

        if (!node) {
            setStatus(STATUS.CONNECTING)
            setErrorMessage(null)
            return
        }

        const { isConnected, isXrayRunning, isConnecting, lastStatusMessage } = node

        setErrorMessage(lastStatusMessage)

        if (isConnected && isXrayRunning && !isConnecting) {
            setStatus(STATUS.CONNECTED)

            return
        }

        if (isConnecting) {
            setStatus(STATUS.CONNECTING)

            return
        }

        if (lastStatusMessage && !isXrayRunning) {
            setStatus(STATUS.ERROR)
        }
    }, [node, isLoading])

    const handleClose = () => {
        actions.toggleCreateModal(false)
        onClose()
    }

    const handleOpenNode = () => {
        if (!node) {
            return
        }

        onClose()

        setTimeout(() => {
            actions.setNode(node)
            actions.toggleEditModal(true)
        }, 300)
    }

    return (
        <Stack gap="lg" mih={400}>
            <Paper
                p="xl"
                shadow="sm"
                style={{
                    background:
                        'linear-gradient(to top, var(--mantine-color-dark-6) 0%, var(--mantine-color-dark-7) 100%)'
                }}
                withBorder
            >
                <Stack align="center" gap="xl">
                    <div style={{ height: 120, display: 'flex', alignItems: 'center' }}>
                        {status === STATUS.CONNECTING && <LottieLinkShared />}
                        {status === STATUS.CONNECTED && <LottieCheckmarkShared />}
                        {status === STATUS.ERROR && <LottieStopShared />}
                    </div>

                    <Stack align="center" gap="xs">
                        {status === STATUS.CONNECTING && (
                            <>
                                <Badge color="blue" size="lg" variant="light">
                                    Connecting...
                                </Badge>

                                <Text c="dimmed" fw={600} size="sm" ta="center">
                                    {t('create-node-step-3-status.establishing-mtls-connection')}
                                </Text>
                            </>
                        )}

                        {status === STATUS.CONNECTED && (
                            <>
                                <Badge color="teal" size="lg" variant="light">
                                    {t('create-node-modal.widget.connection-successful')}
                                </Badge>
                                <Text c="dimmed" fw={600} size="sm" ta="center">
                                    {t('create-node-step-3-status.xray-core-is-up-and-running')}
                                </Text>
                            </>
                        )}

                        {status === STATUS.ERROR && (
                            <>
                                <Badge color="red" size="lg" variant="light">
                                    {t('create-node-modal.widget.connection-failed')}
                                </Badge>

                                <Text c="dimmed" fw={600} size="sm" ta="center">
                                    {t(
                                        'create-node-step-3-status.remnawave-will-try-to-reconnect-shortly'
                                    )}
                                </Text>
                            </>
                        )}
                    </Stack>
                </Stack>
            </Paper>

            {!errorMessage && (
                <Alert
                    color="teal"
                    icon={<TbCheck size={20} />}
                    title={t('create-node-step-3-status.no-errros-so-far')}
                    variant="light"
                />
            )}

            {errorMessage && (
                <Alert
                    color="red"
                    icon={<TbAlertCircle size={20} />}
                    title={t('create-node-step-3-status.last-error-message')}
                    variant="light"
                >
                    <Code color="dark.7">{errorMessage}</Code>
                </Alert>
            )}

            <Group gap="md" justify="space-between" mt="auto">
                <Button
                    color="gray"
                    leftSection={<TbX size={18} />}
                    onClick={handleClose}
                    size="md"
                >
                    {t('create-node-modal.widget.close')}
                </Button>

                <Button
                    color={status === STATUS.CONNECTED ? 'teal' : 'blue'}
                    leftSection={
                        status === STATUS.CONNECTED ? <TbCheck size={18} /> : <TbLink size={18} />
                    }
                    onClick={handleOpenNode}
                    size="md"
                >
                    {t('create-node-modal.widget.open-node')}
                </Button>
            </Group>
        </Stack>
    )
}
