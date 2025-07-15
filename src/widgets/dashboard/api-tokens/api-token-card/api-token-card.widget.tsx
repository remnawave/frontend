import { Badge, Button, Container, Group, Text } from '@mantine/core'
import { PiCheck, PiCopy, PiTrash } from 'react-icons/pi'
import { notifications } from '@mantine/notifications'
import { ForwardedRef, forwardRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useClipboard } from '@mantine/hooks'
import { motion } from 'framer-motion'
import ColorHash from 'color-hash'
import dayjs from 'dayjs'

import { QueryKeys, useDeleteApiToken } from '@shared/api/hooks'
import { queryClient } from '@shared/api'

import classes from './ApiTokenCard.module.css'
import { IProps } from './interfaces'

export const ApiTokenCardWidget = forwardRef((props: IProps, ref: ForwardedRef<HTMLDivElement>) => {
    const { t } = useTranslation()

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
            message: t('api-token-card.widget.apitoken-tokenname-copied-to-clipboard', {
                apiTokenName: apiToken.tokenName
            }),
            title: t('api-token-card.widget.copied'),
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
            ref={ref}
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
                            clipboard.copied ? <PiCheck size="20px" /> : <PiCopy size="20px" />
                        }
                        onClick={handleCopy}
                        size="xs"
                        variant="outline"
                    >
                        {t('api-token-card.widget.copy-token')}
                    </Button>
                    <Button
                        color="red"
                        leftSection={<PiTrash size="20px" />}
                        loading={isDeletingApiToken}
                        onClick={handleDelete}
                        size="xs"
                        variant="outline"
                    >
                        {t('api-token-card.widget.delete')}
                    </Button>
                </Group>
            </Container>
        </motion.div>
    )
})
