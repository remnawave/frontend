import { useSortable } from '@dnd-kit/react/sortable'
import {
    ActionIcon,
    CopyButton,
    Group,
    MantineSize,
    Menu,
    Text,
    TextInput,
    Tooltip
} from '@mantine/core'
import { TNodeIpStatus } from '@remnawave/backend-contract'
import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { PiCheck, PiCopy } from 'react-icons/pi'
import { RiDraggable } from 'react-icons/ri'
import { TbExternalLink, TbTrash } from 'react-icons/tb'

import {
    NODE_IP_STATUS_META,
    NODE_IP_STATUSES_ORDER,
    resolveNodeIpStatusMeta
} from './node-ip-status.constants'
import { isValidNodeIp } from './validate-node-ips'

interface IProps {
    autoFocus?: boolean
    error?: ReactNode
    id: string
    index: number
    ip: string
    onChangeIp: (ip: string) => void
    onChangeStatus: (status: TNodeIpStatus) => void
    onRemove: () => void
    size: MantineSize
    status: TNodeIpStatus
}

export const NodeIpRow = (props: IProps) => {
    const { autoFocus, id, index, ip, status, error, size, onChangeIp, onChangeStatus, onRemove } =
        props

    const { t } = useTranslation()

    const { ref, handleRef } = useSortable({ id, index, transition: { idle: true } })

    const meta = resolveNodeIpStatusMeta(status)
    const isIpResolvable = ip.trim() !== '' && isValidNodeIp(ip)

    const renderStatusItem = (statusKey: TNodeIpStatus) => {
        const itemMeta = NODE_IP_STATUS_META[statusKey]

        return (
            <Menu.Item
                key={statusKey}
                leftSection={
                    <itemMeta.Icon
                        size={16}
                        style={{ color: `var(--mantine-color-${itemMeta.color.split('.')[0]}-5)` }}
                    />
                }
                onClick={() => onChangeStatus(statusKey)}
            >
                <Text fw={statusKey === status ? 700 : 400} size="sm">
                    {t(itemMeta.labelKey)}
                </Text>
            </Menu.Item>
        )
    }

    return (
        <Group align="flex-start" gap={6} ref={ref} wrap="nowrap">
            <Menu
                position="bottom-start"
                shadow="md"
                width={220}
                withinPortal
                middlewares={{ flip: true, shift: true, size: true }}
            >
                <Menu.Target>
                    <Tooltip label={t(meta.labelKey)}>
                        <ActionIcon
                            aria-label={t('node-ips.status')}
                            color={meta.color}
                            size={`input-${size}`}
                            variant="soft"
                        >
                            <meta.Icon size={20} />
                        </ActionIcon>
                    </Tooltip>
                </Menu.Target>

                <Menu.Dropdown style={{ overflowY: 'auto' }}>
                    {NODE_IP_STATUSES_ORDER.map(renderStatusItem)}

                    <Menu.Divider />

                    <Menu.Item color="red" leftSection={<TbTrash size={16} />} onClick={onRemove}>
                        {t('node-ips.remove-ip')}
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>

            <TextInput
                autoFocus={autoFocus}
                error={error}
                leftSection={
                    <CopyButton timeout={2000} value={ip.trim()}>
                        {({ copied, copy }) => (
                            <ActionIcon
                                c={copied ? 'teal' : 'dimmed'}
                                disabled={ip.trim() === ''}
                                onClick={copy}
                                size="sm"
                                variant="transparent"
                            >
                                {copied ? <PiCheck size="16px" /> : <PiCopy size="16px" />}
                            </ActionIcon>
                        )}
                    </CopyButton>
                }
                leftSectionPointerEvents="all"
                onChange={(event) => onChangeIp(event.currentTarget.value)}
                placeholder="1.1.1.1"
                rightSection={
                    <ActionIcon
                        c={isIpResolvable ? 'cyan' : 'dimmed'}
                        component="a"
                        href={isIpResolvable ? `https://ipinfo.io/${ip.trim()}` : undefined}
                        onClick={(event) => {
                            if (!isIpResolvable) event.preventDefault()
                        }}
                        rel="noopener noreferrer"
                        size="sm"
                        target="_blank"
                        variant="transparent"
                    >
                        <TbExternalLink size={16} />
                    </ActionIcon>
                }
                rightSectionPointerEvents="all"
                size={size}
                style={{ flex: 1, minWidth: 0 }}
                styles={{
                    input: { fontFamily: 'var(--mantine-font-family-monospace)' }
                }}
                value={ip}
            />

            <ActionIcon
                c="dimmed"
                miw={22}
                ref={handleRef}
                size={`input-${size}`}
                style={{ cursor: 'grab' }}
                variant="transparent"
                w={22}
            >
                <RiDraggable size={18} />
            </ActionIcon>
        </Group>
    )
}
