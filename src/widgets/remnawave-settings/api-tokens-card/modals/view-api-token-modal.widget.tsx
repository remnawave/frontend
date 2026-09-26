import {
    ActionIcon,
    ActionIconGroup,
    Box,
    Button,
    CopyButton,
    Stack,
    Text,
    Tooltip
} from '@mantine/core'
import { modals } from '@mantine/modals'
import { CreateApiTokenCommand, GetApiTokensCommand } from '@remnawave/backend-contract'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TbCheck, TbCopy } from 'react-icons/tb'

import { useGetScopes } from '@shared/api/hooks'
import { CopyableCodeBlock } from '@shared/ui/copyable-code-block'
import { ModalFooter } from '@shared/ui/modal-footer'
import { formatTimeUtil } from '@shared/utils/time-utils'

import classes from '../api-token-card.module.css'
import { ScopeResourceRow } from './scope-resource-row'
import { countSelected, expandScopesToKeys } from './scopes.utils'

interface IProps {
    isMobile: boolean
    token:
        | CreateApiTokenCommand.Response['response']
        | GetApiTokensCommand.Response['response']['tokens'][number]
}

export const ViewApiTokenContentWidget = ({ isMobile, token }: IProps) => {
    const { t, i18n } = useTranslation()

    const { data: scopesData } = useGetScopes()
    const resources = scopesData?.resources ?? []

    const isExpired = dayjs(token.expireAt).isBefore(dayjs())

    const [expanded, setExpanded] = useState<Set<string>>(new Set())

    const selectedEndpoints = useMemo(
        () => new Set(expandScopesToKeys(resources, token.scopes)),
        [resources, token.scopes]
    )

    const grantedResources = resources.filter(
        (resource) => countSelected(resource.endpoints, selectedEndpoints) > 0
    )

    const toggleExpand = (name: string) => {
        setExpanded((prev) => {
            const next = new Set(prev)
            if (next.has(name)) next.delete(name)
            else next.add(name)
            return next
        })
    }

    return (
        <Stack>
            <Stack gap="md" pb="xs">
                <Box className={classes.metaGrid}>
                    <div className={classes.metaCell}>
                        <Text className={classes.tokenColLabel}>
                            {t('api-tokens-card.widget.col-created')}
                        </Text>
                        <Text c="gray.2" className={classes.metaValue}>
                            {formatTimeUtil({
                                time: token.createdAt,
                                template: 'TIME_FIRST_DATETIME',
                                language: i18n.language
                            })}
                        </Text>
                    </div>
                    <div className={classes.metaCell}>
                        <Text className={classes.tokenColLabel}>
                            {t('api-tokens-card.widget.col-expires')}
                        </Text>
                        <Text c={isExpired ? 'red.5' : 'gray.2'} className={classes.metaValue}>
                            {formatTimeUtil({
                                time: token.expireAt,
                                template: 'TIME_FIRST_DATETIME',
                                language: i18n.language
                            })}
                        </Text>
                    </div>
                    <div className={classes.metaCell}>
                        <Text className={classes.tokenColLabel}>UUID</Text>
                        <div className={classes.metaUuid}>
                            <Text className={classes.metaUuidText} truncate="end">
                                {token.uuid}
                            </Text>
                            <CopyButton timeout={1600} value={token.uuid}>
                                {({ copied, copy }) => (
                                    <Tooltip label={t('common.action.copy')}>
                                        <ActionIcon
                                            color={copied ? 'teal' : 'gray'}
                                            onClick={copy}
                                            size="xs"
                                            variant="subtle"
                                        >
                                            {copied ? <TbCheck size={14} /> : <TbCopy size={14} />}
                                        </ActionIcon>
                                    </Tooltip>
                                )}
                            </CopyButton>
                        </div>
                    </div>
                </Box>

                {'token' in token && <CopyableCodeBlock value={token.token} />}

                <Stack gap={6}>
                    {grantedResources.map((resource) => (
                        <ScopeResourceRow
                            endpoints={resource.endpoints}
                            expanded={expanded.has(resource.resource)}
                            key={resource.resource}
                            onToggleExpand={() => toggleExpand(resource.resource)}
                            readOnly
                            resource={resource}
                            selectedEndpoints={selectedEndpoints}
                        />
                    ))}
                </Stack>
            </Stack>

            <ModalFooter isMobile={isMobile}>
                <ActionIconGroup ml="auto">
                    <CopyButton timeout={1600} value={JSON.stringify(token.scopes, null, 2)}>
                        {({ copied, copy }) => (
                            <Tooltip label={t('common.action.copy')}>
                                <ActionIcon
                                    color={copied ? 'teal' : 'gray'}
                                    onClick={copy}
                                    size="input-md"
                                    variant="soft"
                                >
                                    {copied ? <TbCheck size={24} /> : <TbCopy size={24} />}
                                </ActionIcon>
                            </Tooltip>
                        )}
                    </CopyButton>
                </ActionIconGroup>

                <Button color="teal" onClick={() => modals.closeAll()} size="md" variant="light">
                    {t('common.action.close')}
                </Button>
            </ModalFooter>
        </Stack>
    )
}
