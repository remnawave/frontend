import { Badge, Button, Container, Group, Text } from '@mantine/core'
import { PiCheck, PiCopy, PiTrash } from 'react-icons/pi'
import { notifications } from '@mantine/notifications'
import { useClipboard } from '@mantine/hooks'
import { motion } from 'framer-motion'
import ColorHash from 'color-hash'
import dayjs from 'dayjs'

import { QueryKeys, useDeleteApiToken } from '@shared/api/hooks'
import { queryClient } from '@shared/api'

import classes from './ApiTokenCard.module.css'
import { IProps } from './interfaces'

export function ApiTokenCardWidget(props: IProps) {
    const { apiToken } = props

    const clipboard = useClipboard({ timeout: 500 })

    const { mutate: deleteApiToken, isPending: isDeletingApiToken } = useDeleteApiToken({
        mutationFns: {
            onSuccess: async () => {
                await queryClient.refetchQueries({
                    queryKey: QueryKeys.apiTokens.getAllApiTokens.queryKey
                })
            }
        }
    })

    const ch = new ColorHash()

    const handleCopy = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        clipboard.copy(`${apiToken.token}`)
        notifications.show({
            message: `${apiToken.tokenName} copied to clipboard`,
            title: 'Copied',
            color: 'teal'
        })
    }

    const handleDelete = () => {
        deleteApiToken({ route: { uuid: apiToken.uuid } })
    }

    return (
        <motion.div
            animate={{ opacity: 1, rotateX: 0, y: 0 }}
            exit={{ opacity: 0, rotateX: 80, y: 100 }}
            initial={{ opacity: 0, rotateX: -80, y: -100 }}
            style={{ perspective: 1000 }}
            transition={{
                duration: 0.4,
                ease: 'easeInOut'
            }}
        >
            <Container className={classes.item} fluid>
                <Group gap="xs">
                    <Badge
                        autoContrast
                        color={ch.hex(apiToken.uuid)}
                        miw={'15ch'}
                        radius="md"
                        size="lg"
                        style={{ cursor: 'pointer' }}
                        variant="light"
                    >
                        {apiToken.tokenName}
                    </Badge>

                    <Text>{dayjs(apiToken.createdAt).format('DD/MM/YYYY HH:mm')}</Text>
                    <Button
                        color={clipboard.copied ? 'teal' : 'gray'}
                        leftSection={
                            clipboard.copied ? (
                                <PiCheck size={'1.25rem'} />
                            ) : (
                                <PiCopy size={'1.25rem'} />
                            )
                        }
                        onClick={handleCopy}
                        size="xs"
                        variant="outline"
                    >
                        Copy token
                    </Button>
                    <Button
                        color="red"
                        leftSection={<PiTrash size={'1.25rem'} />}
                        loading={isDeletingApiToken}
                        onClick={handleDelete}
                        size="xs"
                        variant="outline"
                    >
                        Delete
                    </Button>
                </Group>
            </Container>
        </motion.div>
    )
}
