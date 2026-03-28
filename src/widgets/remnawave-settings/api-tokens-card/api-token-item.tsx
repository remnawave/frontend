import { ActionIcon, Box, CopyButton, Group, Text } from '@mantine/core'
import { FindAllApiTokensCommand } from '@remnawave/backend-contract'
import { PiCheck, PiCopy, PiTrash } from 'react-icons/pi'
import { useTranslation } from 'react-i18next'

import { QueryKeys, useDeleteApiToken } from '@shared/api/hooks'
import { formatTimeUtil } from '@shared/utils/time-utils'
import { queryClient } from '@shared/api'

import classes from './api-token-card.module.css'

interface IProps {
    apiToken: FindAllApiTokensCommand.Response['response']['apiKeys'][number]
}

export const ApiTokenItem = ({ apiToken }: IProps) => {
    const { i18n } = useTranslation()
    const { mutate: deleteApiToken, isPending: isDeletingApiToken } = useDeleteApiToken({
        mutationFns: {
            onSuccess: async () => {
                await queryClient.refetchQueries({
                    queryKey: QueryKeys.apiTokens.getAllApiTokens.queryKey
                })
            }
        }
    })

    const handleDelete = () => {
        deleteApiToken({ route: { uuid: apiToken.uuid } })
    }

    return (
        <Box className={classes.itemContainer} p="sm">
            <Group justify="space-between">
                <Text
                    fw={600}
                    size="sm"
                    style={{ flex: 1, minWidth: 0 }}
                    truncate="end"
                    tt="capitalize"
                >
                    {apiToken.tokenName}
                </Text>

                <Group gap="xs" style={{ flexShrink: 0 }} wrap="nowrap">
                    <Text c="dimmed" size="xs" style={{ whiteSpace: 'nowrap' }}>
                        {formatTimeUtil({
                            time: apiToken.createdAt,
                            template: 'TIME_FIRST_DATETIME',
                            language: i18n.language
                        })}
                    </Text>

                    <CopyButton timeout={2000} value={apiToken.token}>
                        {({ copied, copy }) => (
                            <ActionIcon
                                color={copied ? 'teal' : 'gray'}
                                onClick={copy}
                                size="md"
                                variant={copied ? 'light' : 'default'}
                            >
                                {copied ? <PiCheck size="16px" /> : <PiCopy size="16px" />}
                            </ActionIcon>
                        )}
                    </CopyButton>

                    <ActionIcon
                        color="red"
                        loading={isDeletingApiToken}
                        onClick={handleDelete}
                        size="md"
                        variant="light"
                    >
                        <PiTrash size={16} />
                    </ActionIcon>
                </Group>
            </Group>
        </Box>
    )
}
