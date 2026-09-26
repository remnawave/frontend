import {
    ActionIcon,
    ActionIconGroup,
    Box,
    Button,
    CopyButton,
    Flex,
    Group,
    NumberInput,
    Stack,
    Text,
    TextInput,
    Tooltip
} from '@mantine/core'
import { useField } from '@mantine/form'
import { modals } from '@mantine/modals'
import { notifications } from '@mantine/notifications'
import { CreateApiTokenCommand } from '@remnawave/backend-contract'
import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import {
    TbAlertTriangle,
    TbCheck,
    TbClearAll,
    TbClipboard,
    TbCookie,
    TbCopy,
    TbEye,
    TbHexagon,
    TbWorld
} from 'react-icons/tb'

import { queryClient } from '@shared/api'
import { QueryKeys, useCreateApiToken, useGetScopes } from '@shared/api/hooks'
import { ModalFooter } from '@shared/ui/modal-footer'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { sleep } from '@shared/utils/misc'

import classes from '../api-token-card.module.css'
import { ScopeResourceRow } from './scope-resource-row'
import {
    buildScopes,
    expandScopesToKeys,
    getKindState,
    getReadKeys,
    getWriteKeys,
    ScopeResource
} from './scopes.utils'
import { ViewApiTokenContentWidget } from './view-api-token-modal.widget'

const DEFAULT_EXPIRES_IN_DAYS = 30

const SUBPAGE_PRESET_KEYS = [
    'subscription-page-configs:list',
    'subscription-page-configs:get',
    'subscriptions:subpage-config',
    'system:metadata',
    'users:by-username'
]

interface IProps {
    isMobile: boolean
}

export const CreateApiTokenContentWidget = ({ isMobile }: IProps) => {
    const { t } = useTranslation()

    const { data: scopesData } = useGetScopes()

    const tokenNameField = useField<CreateApiTokenCommand.RequestBody['name']>({
        initialValue: '',
        validateOnChange: true,
        validate: (value) => {
            const result = CreateApiTokenCommand.RequestBodySchema.shape.name.safeParse(value)
            return result.success ? null : result.error.issues[0]?.message
        }
    })

    const [selectedEndpoints, setSelectedEndpoints] = useState<Set<string>>(new Set())
    const [expanded, setExpanded] = useState<Set<string>>(new Set())
    const [expiresInDays, setExpiresInDays] = useState<number | string>(DEFAULT_EXPIRES_IN_DAYS)

    const resources = scopesData?.resources ?? []

    const { mutate: createApiToken, isPending } = useCreateApiToken({
        mutationFns: {
            onSuccess: async (data) => {
                queryClient.refetchQueries({
                    queryKey: QueryKeys.apiTokens.getAllApiTokens.queryKey
                })
                modals.closeAll()

                await sleep(300)

                modals.open({
                    title: (
                        <BaseOverlayHeader
                            iconColor="teal"
                            IconComponent={TbCookie}
                            iconVariant="soft"
                            title={data.name}
                        />
                    ),
                    fullScreen: isMobile,
                    centered: true,
                    size: 'min(800px, 90vw)',
                    children: <ViewApiTokenContentWidget isMobile={isMobile} token={data} />
                })
            }
        }
    })

    const setKeys = (keys: string[], checked: boolean) => {
        setSelectedEndpoints((prev) => {
            const next = new Set(prev)
            keys.forEach((key) => (checked ? next.add(key) : next.delete(key)))
            return next
        })
    }

    const toggleEndpoint = (key: string) => {
        setSelectedEndpoints((prev) => {
            const next = new Set(prev)
            if (next.has(key)) next.delete(key)
            else next.add(key)
            return next
        })
    }

    const toggleKind = (resource: ScopeResource, kind: 'read' | 'write') => {
        const keys = kind === 'read' ? getReadKeys(resource) : getWriteKeys(resource)
        const state = getKindState(keys, selectedEndpoints)
        setKeys(keys, state !== 'on')
    }

    const toggleExpand = (name: string) => {
        setExpanded((prev) => {
            const next = new Set(prev)
            if (next.has(name)) next.delete(name)
            else next.add(name)
            return next
        })
    }

    const presetRead = () => {
        const next = new Set<string>()
        resources.forEach((resource) => getReadKeys(resource).forEach((key) => next.add(key)))
        setSelectedEndpoints(next)
    }

    const presetFull = () => {
        const next = new Set<string>()
        resources.forEach((resource) =>
            resource.endpoints.forEach((endpoint) => next.add(endpoint.key))
        )
        setSelectedEndpoints(next)
    }

    const presetSubpage = () => {
        setSelectedEndpoints(new Set(SUBPAGE_PRESET_KEYS))
    }

    const handlePasteScopes = async () => {
        try {
            const text = await navigator.clipboard.readText()
            const parsed: unknown = JSON.parse(text)
            if (!Array.isArray(parsed) || !parsed.every((item) => typeof item === 'string')) {
                throw new Error('not a string array')
            }
            setSelectedEndpoints(new Set(expandScopesToKeys(resources, parsed as string[])))
            notifications.show({
                title: 'Scopes pasted',
                message: `Imported ${parsed.length} scope(s) from clipboard`,
                color: 'teal'
            })
        } catch {
            notifications.show({
                title: 'Invalid scopes',
                message: 'Clipboard must contain a JSON array of scope strings',
                color: 'red'
            })
        }
    }

    const handleSubmit = () => {
        createApiToken({
            variables: {
                name: tokenNameField.getValue(),
                expiresInDays: Number(expiresInDays),
                scopes: buildScopes(resources, selectedEndpoints)
            }
        })
    }

    const totalSelected = selectedEndpoints.size
    const isNameInvalid = !!tokenNameField.error || tokenNameField.getValue().trim() === ''
    const isExpiresInvalid = !Number.isInteger(Number(expiresInDays)) || Number(expiresInDays) < 1
    const canCreate = !isNameInvalid && !isExpiresInvalid && totalSelected > 0

    return (
        <Stack gap="md">
            <Box className={classes.oneTimeNotice}>
                <TbAlertTriangle className={classes.oneTimeNoticeIcon} size={20} />
                <Text className={classes.oneTimeNoticeText}>
                    <Trans
                        components={{
                            emphasis: <span className={classes.oneTimeNoticeEmphasis} />
                        }}
                        i18nKey="api-tokens-card.widget.one-time-notice"
                    />
                </Text>
            </Box>

            <Flex
                align={isMobile ? 'stretch' : 'flex-start'}
                direction={isMobile ? 'column' : 'row'}
                gap="xs"
            >
                <TextInput
                    data-autofocus
                    flex={isMobile ? undefined : 1}
                    label={t('api-tokens-card.widget.token-name')}
                    placeholder="Service Bot"
                    required
                    {...tokenNameField.getInputProps()}
                />
                <NumberInput
                    allowDecimal={false}
                    allowNegative={false}
                    clampBehavior="strict"
                    label={t('api-tokens-card.widget.expires-in-days')}
                    max={999999}
                    min={1}
                    onChange={setExpiresInDays}
                    required
                    value={expiresInDays}
                    w={isMobile ? '100%' : 300}
                />
            </Flex>

            <Group gap="xs">
                <Button
                    leftSection={<TbEye size={16} />}
                    onClick={presetRead}
                    size="xs"
                    variant="default"
                >
                    Read only
                </Button>
                <Button
                    leftSection={<TbWorld size={16} />}
                    onClick={presetFull}
                    size="xs"
                    variant="default"
                >
                    {t('api-tokens-card.widget.full-access')}
                </Button>
                <Button
                    leftSection={<TbHexagon size={16} />}
                    onClick={presetSubpage}
                    size="xs"
                    variant="default"
                >
                    Subpage
                </Button>
            </Group>

            <Stack gap={6}>
                {resources.map((resource) => (
                    <ScopeResourceRow
                        endpoints={resource.endpoints}
                        expanded={expanded.has(resource.resource)}
                        key={resource.resource}
                        onToggleEndpoint={toggleEndpoint}
                        onToggleExpand={() => toggleExpand(resource.resource)}
                        onToggleKind={(kind) => toggleKind(resource, kind)}
                        resource={resource}
                        selectedEndpoints={selectedEndpoints}
                    />
                ))}
            </Stack>

            <ModalFooter isMobile={isMobile}>
                <ActionIconGroup ml="auto">
                    <Tooltip label={t('common.action.clear')}>
                        <ActionIcon
                            color="gray"
                            onClick={() => setSelectedEndpoints(new Set())}
                            size="input-md"
                            variant="soft"
                        >
                            <TbClearAll size={24} />
                        </ActionIcon>
                    </Tooltip>

                    <CopyButton
                        timeout={1600}
                        value={JSON.stringify(buildScopes(resources, selectedEndpoints), null, 2)}
                    >
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

                    <Tooltip label={t('common.action.paste')}>
                        <ActionIcon
                            color="gray"
                            onClick={handlePasteScopes}
                            size="input-md"
                            variant="soft"
                        >
                            <TbClipboard size={24} />
                        </ActionIcon>
                    </Tooltip>
                </ActionIconGroup>

                <Button
                    color="teal"
                    disabled={!canCreate}
                    leftSection={<TbCookie size="24px" />}
                    loading={isPending}
                    onClick={handleSubmit}
                    size="md"
                    variant="soft"
                >
                    {t('common.action.create')}
                </Button>
            </ModalFooter>
        </Stack>
    )
}
