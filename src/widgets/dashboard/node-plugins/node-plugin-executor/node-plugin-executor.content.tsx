import {
    ActionIcon,
    Box,
    Button,
    Checkbox,
    Code,
    Group,
    ScrollArea,
    Stack,
    Text,
    Textarea,
    ThemeIcon
} from '@mantine/core'
import {
    TbAlertTriangle,
    TbArrowBackUp,
    TbLock,
    TbLockOpen,
    TbRefresh,
    TbSend,
    TbServer2
} from 'react-icons/tb'
import { GetAllNodesCommand } from '@remnawave/backend-contract'
import ReactCountryFlag from 'react-country-flag'
import { useTranslation } from 'react-i18next'
import { useCallback, useState } from 'react'
import { z } from 'zod'

import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { useNodePluginExecutor } from '@shared/api/hooks'
import { ActionCardShared } from '@shared/ui/action-card'
import { SectionCard } from '@shared/ui/section-card'

interface IProps {
    nodes: GetAllNodesCommand.Response['response']
    onClose: () => void
}

type CommandType = 'blockIps' | 'recreateTables' | 'unblockIps'
type Step = 'command' | 'configure' | 'target'

const BLOCK_PLACEHOLDER = `192.168.1.1;0
10.0.0.1;3600
172.16.0.1;60`

const UNBLOCK_PLACEHOLDER = `192.168.1.1
10.0.0.1
172.16.0.1`

const ipSchema = z.string().ip({ message: 'Invalid IP address' })

export const NodePluginExecutorContent = (props: IProps) => {
    const { nodes, onClose } = props
    const { t } = useTranslation()

    const { mutate: executeNodePlugin, isPending } = useNodePluginExecutor({
        mutationFns: {
            onSuccess: () => {
                onClose()
            }
        }
    })

    const [step, setStep] = useState<Step>('command')
    const [command, setCommand] = useState<CommandType | null>(null)
    const [selectedNodeUuids, setSelectedNodeUuids] = useState<Set<string>>(new Set())

    const [blockText, setBlockText] = useState('')
    const [unblockText, setUnblockText] = useState('')
    const [textError, setTextError] = useState<null | string>(null)

    const connectedNodes = nodes.filter((n) => n.isConnected)

    const resetAll = () => {
        setCommand(null)
        setSelectedNodeUuids(new Set())
        setBlockText('')
        setUnblockText('')
        setTextError(null)
    }

    const selectCommand = (cmd: CommandType) => {
        setCommand(cmd)
        if (cmd === 'recreateTables') {
            setStep('target')
        } else {
            setStep('configure')
        }
    }

    const goBack = () => {
        if (step === 'target' && command !== 'recreateTables') {
            setStep('configure')
        } else {
            setStep('command')
            resetAll()
        }
    }

    const toggleNode = useCallback((uuid: string) => {
        setSelectedNodeUuids((prev) => {
            const next = new Set(prev)
            if (next.has(uuid)) {
                next.delete(uuid)
            } else {
                next.add(uuid)
            }
            return next
        })
    }, [])

    const parseBlockText = () => {
        const lines = blockText
            .split('\n')
            .map((l) => l.trim())
            .filter(Boolean)
        const errors: string[] = []
        const entries: { ip: string; timeout: number }[] = []

        lines.forEach((line, i) => {
            const parts = line.split(';')
            const ip = parts[0]?.trim() ?? ''
            const timeout = parseInt(parts[1]?.trim() ?? '0', 10)

            const result = ipSchema.safeParse(ip)
            if (!result.success) {
                errors.push(`Line ${i + 1}: "${ip}" — ${result.error.errors[0].message}`)
            } else {
                entries.push({ ip, timeout: Number.isNaN(timeout) ? 0 : timeout })
            }
        })

        return { entries, errors }
    }

    const parseUnblockText = () => {
        const lines = unblockText
            .split('\n')
            .map((l) => l.trim())
            .filter(Boolean)
        const errors: string[] = []
        const ips: string[] = []

        lines.forEach((line, i) => {
            const result = ipSchema.safeParse(line)
            if (!result.success) {
                errors.push(`Line ${i + 1}: "${line}" — ${result.error.errors[0].message}`)
            } else {
                ips.push(line)
            }
        })

        return { errors, ips }
    }

    const validateAndProceed = (): boolean => {
        if (command === 'blockIps') {
            const { entries, errors } = parseBlockText()
            if (entries.length === 0 && errors.length === 0) {
                setTextError(t('node-plugin-executor.content.enter-at-least-one-ip-address'))
                return false
            }
            if (errors.length > 0) {
                setTextError(errors.join('\n'))
                return false
            }
            setTextError(null)
            return true
        }

        if (command === 'unblockIps') {
            const { errors, ips } = parseUnblockText()
            if (ips.length === 0 && errors.length === 0) {
                setTextError(t('node-plugin-executor.content.enter-at-least-one-ip-address'))
                return false
            }
            if (errors.length > 0) {
                setTextError(errors.join('\n'))
                return false
            }
            setTextError(null)
            return true
        }

        return true
    }

    const handleSubmit = () => {
        const targetNodes = {
            target: 'specificNodes' as const,
            nodeUuids: Array.from(selectedNodeUuids)
        }

        let commandPayload

        switch (command) {
            case 'blockIps': {
                const { entries } = parseBlockText()
                commandPayload = { command: 'blockIps' as const, ips: entries }
                break
            }
            case 'recreateTables':
                commandPayload = { command: 'recreateTables' as const }
                break
            case 'unblockIps': {
                const { ips } = parseUnblockText()
                commandPayload = { command: 'unblockIps' as const, ips }
                break
            }
            default:
                commandPayload = { command: 'recreateTables' as const }
        }

        executeNodePlugin({ variables: { command: commandPayload, targetNodes } })
    }

    const STEP_MIN_HEIGHT = 380

    if (step === 'command') {
        return (
            <Box mih={STEP_MIN_HEIGHT}>
                <Stack gap="md">
                    <SectionCard.Root>
                        <SectionCard.Section>
                            <BaseOverlayHeader
                                IconComponent={TbAlertTriangle}
                                iconVariant="gradient-orange"
                                subtitle={t('node-plugin-executor.content.executor-description')}
                                title={t('node-plugins-grid.widget.warning')}
                                titleOrder={5}
                            />
                        </SectionCard.Section>
                    </SectionCard.Root>

                    <Stack gap="xs">
                        <ActionCardShared
                            description={t(
                                'node-plugin-executor.content.block-specific-ip-addresses-on-selected-nodes'
                            )}
                            icon={<TbLock size={20} />}
                            onClick={() => selectCommand('blockIps')}
                            title={t('node-plugin-executor.content.block-ips')}
                            variant="gradient-red"
                        />
                        <ActionCardShared
                            description={t(
                                'node-plugin-executor.content.remove-ip-blocks-on-selected-nodes'
                            )}
                            icon={<TbLockOpen size={20} />}
                            onClick={() => selectCommand('unblockIps')}
                            title={t('node-plugin-executor.content.unblock-ips')}
                            variant="gradient-teal"
                        />
                        <ActionCardShared
                            description={t(
                                'node-plugin-executor.content.recreate-nftables-rules-on-selected-nodes'
                            )}
                            icon={<TbRefresh size={20} />}
                            onClick={() => selectCommand('recreateTables')}
                            title={t('node-plugin-executor.content.recreate-tables')}
                            variant="gradient-orange"
                        />
                    </Stack>
                </Stack>
            </Box>
        )
    }

    if (step === 'configure') {
        const isBlock = command === 'blockIps'

        return (
            <Box mih={STEP_MIN_HEIGHT}>
                <SectionCard.Root>
                    <SectionCard.Section>
                        <Group align="flex-start" justify="space-between">
                            <BaseOverlayHeader
                                IconComponent={isBlock ? TbLock : TbLockOpen}
                                iconVariant={isBlock ? 'gradient-cyan' : 'gradient-teal'}
                                subtitle={
                                    isBlock
                                        ? t('node-plugin-executor.content.block-ips-decription')
                                        : t('node-plugin-executor.content.unblock-ips-decription')
                                }
                                title={
                                    isBlock
                                        ? t('node-plugin-executor.content.ips-to-block')
                                        : t('node-plugin-executor.content.ips-to-unblock')
                                }
                                titleOrder={5}
                            />
                            <ActionIcon onClick={goBack} size="lg" variant="default">
                                <TbArrowBackUp size={20} />
                            </ActionIcon>
                        </Group>
                    </SectionCard.Section>

                    <SectionCard.Section>
                        <Text c="dimmed" mb="xs" size="xs">
                            {t('node-plugin-executor.content.format-one-per-line')}{' '}
                            <Code>{isBlock ? 'IP;timeout' : 'IP'}</Code>
                        </Text>
                        <Textarea
                            autosize
                            error={textError}
                            maxRows={10}
                            minRows={5}
                            onChange={(e) => {
                                if (isBlock) {
                                    setBlockText(e.currentTarget.value)
                                } else {
                                    setUnblockText(e.currentTarget.value)
                                }
                                if (textError) setTextError(null)
                            }}
                            placeholder={isBlock ? BLOCK_PLACEHOLDER : UNBLOCK_PLACEHOLDER}
                            styles={{
                                input: {
                                    fontFamily: 'var(--mantine-font-family-monospace)'
                                }
                            }}
                            value={isBlock ? blockText : unblockText}
                        />
                    </SectionCard.Section>
                    <SectionCard.Section>
                        <Group justify="flex-end">
                            <Button
                                onClick={() => {
                                    if (validateAndProceed()) setStep('target')
                                }}
                            >
                                {t('node-plugin-executor.content.next')}
                            </Button>
                        </Group>
                    </SectionCard.Section>
                </SectionCard.Root>
            </Box>
        )
    }

    const countryFlag = (countryCode: null | string) => {
        if (!countryCode || countryCode === 'XX') return <TbServer2 size={14} />
        return (
            <ReactCountryFlag
                countryCode={countryCode}
                style={{ fontSize: '1.1em', borderRadius: '2px' }}
            />
        )
    }

    return (
        <Box mih={STEP_MIN_HEIGHT}>
            <SectionCard.Root>
                <SectionCard.Section>
                    <Group align="flex-start" justify="space-between">
                        <BaseOverlayHeader
                            IconComponent={TbServer2}
                            iconVariant="gradient-violet"
                            subtitle={`${selectedNodeUuids.size} selected`}
                            title={t('constants.nodes')}
                            titleOrder={5}
                        />
                        <ActionIcon onClick={goBack} size="lg" variant="default">
                            <TbArrowBackUp size={20} />
                        </ActionIcon>
                    </Group>
                </SectionCard.Section>

                {connectedNodes.length > 0 && (
                    <SectionCard.Section>
                        <ScrollArea.Autosize mah={280} offsetScrollbars>
                            <Stack gap={6}>
                                {connectedNodes.map((node) => {
                                    const isSelected = selectedNodeUuids.has(node.uuid)
                                    return (
                                        <Checkbox.Card
                                            checked={isSelected}
                                            key={node.uuid}
                                            onClick={() => toggleNode(node.uuid)}
                                            p="sm"
                                            radius="md"
                                            style={{
                                                border: isSelected
                                                    ? '1px solid var(--mantine-color-cyan-6)'
                                                    : '1px solid rgba(255,255,255,0.06)',
                                                background: isSelected
                                                    ? 'var(--mantine-color-cyan-light)'
                                                    : 'transparent',
                                                transition: 'all 0.15s ease'
                                            }}
                                        >
                                            <Group gap="sm" wrap="nowrap">
                                                <Checkbox.Indicator size="sm" />
                                                <ThemeIcon
                                                    color={isSelected ? 'cyan' : 'gray'}
                                                    radius="md"
                                                    size="md"
                                                    variant="light"
                                                >
                                                    {countryFlag(node.countryCode)}
                                                </ThemeIcon>
                                                <Stack gap={0} style={{ flex: 1, minWidth: 0 }}>
                                                    <Text fw={600} lineClamp={1} size="sm">
                                                        {node.name}
                                                    </Text>
                                                    {node.address && (
                                                        <Text
                                                            c="dimmed"
                                                            ff="monospace"
                                                            lineClamp={1}
                                                            size="xs"
                                                        >
                                                            {node.address}
                                                        </Text>
                                                    )}
                                                </Stack>
                                            </Group>
                                        </Checkbox.Card>
                                    )
                                })}
                            </Stack>
                        </ScrollArea.Autosize>
                    </SectionCard.Section>
                )}

                {connectedNodes.length === 0 && (
                    <SectionCard.Section>
                        <Text c="dimmed" py="md" size="sm" ta="center">
                            {t('node-plugin-executor.content.no-connected-nodes-available')}
                        </Text>
                    </SectionCard.Section>
                )}

                <SectionCard.Section>
                    <Group justify="flex-end">
                        {connectedNodes.length > 0 && (
                            <Button
                                onClick={() => {
                                    if (selectedNodeUuids.size === connectedNodes.length) {
                                        setSelectedNodeUuids(new Set())
                                    } else {
                                        setSelectedNodeUuids(
                                            new Set(connectedNodes.map((n) => n.uuid))
                                        )
                                    }
                                }}
                                size="compact-xs"
                                variant="subtle"
                            >
                                {selectedNodeUuids.size === connectedNodes.length
                                    ? t('node-plugin-executor.content.deselect-all')
                                    : t('node-plugin-executor.content.select-all')}
                            </Button>
                        )}

                        <Button
                            color="cyan"
                            disabled={selectedNodeUuids.size === 0}
                            loading={isPending}
                            onClick={handleSubmit}
                            rightSection={<TbSend size={16} />}
                        >
                            {t('node-plugin-executor.content.execute')}
                        </Button>
                    </Group>
                </SectionCard.Section>
            </SectionCard.Root>
        </Box>
    )
}
