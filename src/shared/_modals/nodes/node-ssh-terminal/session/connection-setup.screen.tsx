import type { ISshTarget } from '../ssh-terminal.types'

import {
    Autocomplete,
    Badge,
    Box,
    Button,
    Group,
    NumberInput,
    Stack,
    Text,
    TextInput
} from '@mantine/core'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TbKey, TbPlugConnected, TbRefresh, TbServer, TbTerminal2 } from 'react-icons/tb'

import { CopyableCodeBlock } from '@shared/ui/copyable-code-block'
import { NodeIpStatusIcon, resolveNodeIpStatusMeta } from '@shared/ui/node-ips'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { SectionCard } from '@shared/ui/section-card'

import { INodeKeyInfo } from '@entities/ssh-vault'

import classes from '../NodeSshTerminal.module.css'

export interface INodeIp {
    ip: string
    status: string
}

interface IProps {
    initial: ISshTarget
    nodeAddress: string
    nodeIps: INodeIp[]
    nodeKey: INodeKeyInfo
    onConnect: (target: ISshTarget) => void
    onOpenKeyImport: () => void
    onRegenerateKey: () => Promise<void>
}

export const ConnectionSetupScreen = (props: IProps) => {
    const { initial, nodeAddress, nodeIps, nodeKey, onConnect, onOpenKeyImport, onRegenerateKey } =
        props
    const { t } = useTranslation()

    const [username, setUsername] = useState(initial.username)
    const [host, setHost] = useState(initial.host === nodeAddress ? '' : initial.host)
    const [port, setPort] = useState<number>(initial.port)

    const [isBusy, setIsBusy] = useState(false)

    const regenerate = async () => {
        setIsBusy(true)
        try {
            await onRegenerateKey()
        } finally {
            setIsBusy(false)
        }
    }

    const ipOptions = useMemo(
        () => Array.from(new Set(nodeIps.map((item) => item.ip).filter(Boolean))),
        [nodeIps]
    )

    const ipStatuses = useMemo(
        () => new Map(nodeIps.map((item) => [item.ip, item.status])),
        [nodeIps]
    )

    const selectedIpStatus = ipStatuses.get(host.trim())

    return (
        <SectionCard.Root w="75%" mx="auto">
            <SectionCard.Section>
                <BaseOverlayHeader
                    iconColor="cyan"
                    IconComponent={TbTerminal2}
                    iconVariant="soft"
                    subtitle={t(
                        nodeKey.imported
                            ? 'node-ssh.key-description-imported'
                            : 'node-ssh.key-description'
                    )}
                    title={t('node-ssh.key-title')}
                    titleOrder={5}
                />
            </SectionCard.Section>
            <SectionCard.Section>
                <Stack gap="sm">
                    <CopyableCodeBlock
                        inputWrapperProps={{
                            label: t('node-ssh.authorized-keys')
                        }}
                        value={nodeKey.publicKey}
                    />

                    <Group gap="xs" wrap="nowrap">
                        <Badge color="gray" size="sm" variant="soft">
                            {nodeKey.algo}
                        </Badge>
                        {nodeKey.imported && (
                            <Badge color="cyan" size="sm" variant="soft">
                                {t('node-ssh.key-imported')}
                            </Badge>
                        )}

                        <Button
                            color="gray"
                            disabled={isBusy}
                            leftSection={<TbKey size={14} />}
                            ml="auto"
                            onClick={onOpenKeyImport}
                            size="compact-xs"
                            variant="subtle"
                        >
                            {t('node-ssh.key-use-own')}
                        </Button>

                        {nodeKey.imported && (
                            <Button
                                color="gray"
                                disabled={isBusy}
                                leftSection={<TbRefresh size={14} />}
                                onClick={() => void regenerate()}
                                size="compact-xs"
                                variant="subtle"
                            >
                                {t('node-ssh.key-generate-new')}
                            </Button>
                        )}
                    </Group>

                    <Box className={classes.targetRow}>
                        <TextInput
                            label={t('common.field.username')}
                            onChange={(event) => setUsername(event.currentTarget.value)}
                            value={username}
                        />
                        <Autocomplete
                            comboboxProps={{ position: 'bottom-start', width: 320, zIndex: 500 }}
                            data={ipOptions}
                            label={t('node-ssh.host')}
                            leftSection={
                                selectedIpStatus ? (
                                    <NodeIpStatusIcon size="sm" status={selectedIpStatus} />
                                ) : (
                                    <TbServer size={18} />
                                )
                            }
                            onChange={setHost}
                            placeholder={nodeAddress}
                            renderOption={({ option }) => {
                                const status = ipStatuses.get(option.value) ?? 'UNKNOWN'

                                return (
                                    <Group gap="xs" w="100%" wrap="nowrap">
                                        <NodeIpStatusIcon size="sm" status={status} />
                                        <Text ff="monospace" miw={0} size="sm" truncate>
                                            {option.value}
                                        </Text>

                                        <Text
                                            c="dimmed"
                                            ml="auto"
                                            size="xs"
                                            style={{ flexShrink: 0 }}
                                        >
                                            {t(resolveNodeIpStatusMeta(status).labelKey)}
                                        </Text>
                                    </Group>
                                )
                            }}
                            value={host}
                        />
                        <NumberInput
                            allowDecimal={false}
                            hideControls
                            label={t('common.field.port')}
                            max={65535}
                            min={1}
                            onChange={(value) => setPort(Number(value) || 22)}
                            value={port}
                        />
                        <Text c="dimmed" className={classes.targetHint} size="xs">
                            {t('node-ssh.host-hint')}
                        </Text>
                    </Box>

                    <Button
                        disabled={!username.trim()}
                        fullWidth
                        size="sm"
                        variant="soft"
                        leftSection={<TbPlugConnected size={16} />}
                        onClick={() =>
                            onConnect({
                                host: host.trim() || nodeAddress,
                                port,
                                username: username.trim()
                            })
                        }
                    >
                        {t('node-ssh.connect')}
                    </Button>
                </Stack>
            </SectionCard.Section>
        </SectionCard.Root>
    )
}
