import { ActionIcon, Badge, Container, Flex, Group, Stack, Text, Tooltip } from '@mantine/core'
import { PiCheck, PiCopy, PiKey, PiTrash } from 'react-icons/pi'
import { notifications } from '@mantine/notifications'
import { ForwardedRef, forwardRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useClipboard } from '@mantine/hooks'
import { HiCalendar } from 'react-icons/hi'
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

    const ch = new ColorHash({
        hue: [
            { min: 120, max: 125 }, // green (#7EB26D)
            { min: 45, max: 50 }, // yellow (#EAB839)
            { min: 185, max: 190 }, // light blue (#6ED0E0)
            { min: 25, max: 30 }, // orange (#EF843C)
            { min: 0, max: 5 }, // red (#E24D42)
            { min: 210, max: 215 }, // blue (#1F78C1)
            { min: 300, max: 305 }, // purple (#BA43A9)
            { min: 270, max: 275 }, // violet (#705DA0)
            { min: 100, max: 105 }, // dark green (#508642)
            { min: 45, max: 50 }, // dark yellow (#CCA300)
            { min: 210, max: 215 }, // dark blue (#447EBC)
            { min: 25, max: 30 }, // dark orange (#C15C17)
            { min: 0, max: 5 }, // dark red (#890F02)
            { min: 150, max: 155 }, // teal (#2B908F)
            { min: 330, max: 335 }, // pink (#EA6460)
            { min: 240, max: 245 }, // indigo (#5195CE)
            { min: 60, max: 65 }, // lime (#B3DE69)
            { min: 15, max: 20 }, // coral (#FFA07A)
            { min: 285, max: 290 }, // magenta (#C71585)
            { min: 165, max: 170 } // turquoise (#40E0D0)
        ],
        lightness: [0.3, 0.4, 0.5, 0.6, 0.7],
        saturation: [0.4, 0.5, 0.6, 0.7, 0.8]
    })

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
            <Container className={classes.tokenCard} fluid>
                <Flex align="flex-start" gap="md" justify="space-between">
                    <Stack flex={1} gap="xs">
                        <Group align="center" gap="sm">
                            <div className={classes.iconWrapper}>
                                <PiKey className={classes.tokenIcon} size="18px" />
                            </div>
                            <Badge
                                autoContrast
                                className={classes.tokenBadge}
                                color={ch.hex(apiToken.uuid)}
                                radius="md"
                                size="lg"
                                variant="light"
                            >
                                {apiToken.tokenName}
                            </Badge>
                            <Group align="center" className={classes.metaInfo} gap="xs">
                                <HiCalendar className={classes.metaIcon} size="16px" />
                                <Text c="dimmed" className={classes.dateText} size="lg">
                                    {dayjs(apiToken.createdAt).format('MMM DD, YYYY HH:mm')}
                                </Text>
                            </Group>
                        </Group>
                    </Stack>

                    <Group className={classes.actionButtons} gap="xs">
                        <Tooltip
                            label={
                                clipboard.copied
                                    ? t('api-token-card.widget.copied')
                                    : t('api-token-card.widget.copy-token')
                            }
                        >
                            <ActionIcon
                                className={classes.actionButton}
                                color={clipboard.copied ? 'teal' : 'blue'}
                                onClick={handleCopy}
                                size="lg"
                                variant={clipboard.copied ? 'filled' : 'light'}
                            >
                                {clipboard.copied ? (
                                    <PiCheck size="16px" />
                                ) : (
                                    <PiCopy size="16px" />
                                )}
                            </ActionIcon>
                        </Tooltip>

                        <Tooltip label={t('api-token-card.widget.delete')}>
                            <ActionIcon
                                className={classes.actionButton}
                                color="red"
                                loading={isDeletingApiToken}
                                onClick={handleDelete}
                                size="lg"
                                variant="light"
                            >
                                <PiTrash size="16px" />
                            </ActionIcon>
                        </Tooltip>
                    </Group>
                </Flex>

                <div className={classes.gradientBorder} />
            </Container>
        </motion.div>
    )
})
