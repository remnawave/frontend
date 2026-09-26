import { ActionIcon, Box, Group, Menu, Text } from '@mantine/core'
import { modals } from '@mantine/modals'
import { GetApiTokensCommand } from '@remnawave/backend-contract'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { TbCookie, TbDots, TbEye, TbTrash } from 'react-icons/tb'

import { queryClient } from '@shared/api'
import { QueryKeys, useDeleteApiToken } from '@shared/api/hooks'
import { useIsMobile } from '@shared/hooks'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { formatTimeUtil } from '@shared/utils/time-utils'

import classes from './api-token-card.module.css'
import { ViewApiTokenContentWidget } from './modals/view-api-token-modal.widget'

interface IProps {
    apiToken: GetApiTokensCommand.Response['response']['tokens'][number]
}

export const ApiTokenItem = ({ apiToken }: IProps) => {
    const { t, i18n } = useTranslation()
    const isMobile = useIsMobile()

    const { mutate: deleteApiToken, isPending: isDeletingApiToken } = useDeleteApiToken({
        mutationFns: {
            onSuccess: async () => {
                await queryClient.refetchQueries({
                    queryKey: QueryKeys.apiTokens.getAllApiTokens.queryKey
                })
            }
        }
    })

    const isFull = apiToken.scopes.includes('*')
    const hasScopes = isFull || apiToken.scopes.length > 0
    const isExpired = dayjs(apiToken.expireAt).isBefore(dayjs())

    const getDotColor = () => {
        if (isFull) return 'var(--mantine-color-teal-5)'
        if (hasScopes) return 'var(--mantine-color-cyan-5)'
        return 'var(--mantine-color-dark-3)'
    }
    const dotColor = getDotColor()

    return (
        <Box className={classes.tokenRow}>
            <Group gap="sm" style={{ minWidth: 0 }} wrap="nowrap">
                <Box
                    style={{
                        background: dotColor,
                        borderRadius: '50%',
                        flexShrink: 0,
                        height: 8,
                        width: 8
                    }}
                />
                <Text fw={500} size="sm" truncate="end">
                    {apiToken.name}
                </Text>
            </Group>

            <Text c="dimmed" ff="monospace" size="xs" truncate="end">
                {isFull ? t('api-tokens-card.widget.full-access') : apiToken.scopes.length}{' '}
            </Text>

            <Text
                c={isExpired ? 'red.5' : 'dimmed'}
                size="xs"
                truncate="end"
                visibleFrom="sm"
                fw={isExpired ? 600 : 400}
            >
                {isExpired
                    ? t('api-tokens-card.widget.expired')
                    : formatTimeUtil({
                          time: apiToken.expireAt,
                          template: 'TIME_FIRST_DATETIME',
                          language: i18n.language
                      })}
            </Text>

            <Menu position="bottom-end" shadow="lg" trigger="click-hover" width={190}>
                <Menu.Target>
                    <ActionIcon
                        color="gray"
                        onClick={(event) => event.stopPropagation()}
                        size="md"
                        variant="subtle"
                    >
                        <TbDots size={18} />
                    </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown onClick={(event) => event.stopPropagation()}>
                    <Menu.Item
                        leftSection={<TbEye size={15} />}
                        onClick={() => {
                            modals.open({
                                title: (
                                    <BaseOverlayHeader
                                        iconColor="teal"
                                        IconComponent={TbCookie}
                                        iconVariant="soft"
                                        title={apiToken.name}
                                    />
                                ),
                                fullScreen: isMobile,
                                centered: true,
                                size: 'min(800px, 90vw)',
                                children: (
                                    <ViewApiTokenContentWidget
                                        isMobile={isMobile}
                                        token={apiToken}
                                    />
                                )
                            })
                        }}
                    >
                        {t('common.action.view')}
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item
                        color="red"
                        disabled={isDeletingApiToken}
                        leftSection={<TbTrash size={15} />}
                        onClick={() => deleteApiToken({ route: { uuid: apiToken.uuid } })}
                    >
                        {t('common.action.delete')}
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>
        </Box>
    )
}
