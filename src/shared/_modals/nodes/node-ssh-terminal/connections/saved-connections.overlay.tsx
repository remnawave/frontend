import { Badge, Box, CloseButton, Group, Stack, Text, ThemeIcon } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { TbServer } from 'react-icons/tb'

import { CountryFlag } from '@shared/ui/get-country-flag'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { SectionCard } from '@shared/ui/section-card'

import classes from '../NodeSshTerminal.module.css'
import { TerminalOverlay } from '../window/terminal-overlay'

export interface ISavedConnection {
    countryCode: null | string | undefined
    host: string
    isConnected: boolean
    isCurrent: boolean
    isOpen: boolean
    nodeName: string
    nodeUuid: string
    port: number
    username: string
}

interface INodeOrder {
    countryCode?: null | string
    name: string
    uuid: string
    viewPosition: number
}

interface IProfile {
    host: string
    nodeUuid: string
    port: number
    username: string
}

export const buildSavedConnections = (
    nodes: INodeOrder[],
    profiles: IProfile[],
    currentNodeUuid: string,
    openSessions: Record<string, boolean | undefined>
): ISavedConnection[] => {
    const byUuid = new Map(profiles.map((profile) => [profile.nodeUuid, profile]))

    return nodes
        .filter((node) => byUuid.has(node.uuid))
        .toSorted((left, right) => left.viewPosition - right.viewPosition)
        .map((node) => {
            const profile = byUuid.get(node.uuid)!

            return {
                countryCode: node.countryCode,
                host: profile.host,
                isConnected: openSessions[node.uuid] === true,
                isCurrent: node.uuid === currentNodeUuid,
                isOpen: node.uuid in openSessions,
                nodeName: node.name,
                nodeUuid: node.uuid,
                port: profile.port,
                username: profile.username
            }
        })
}

interface IListProps {
    connections: ISavedConnection[]
    onClose?: () => void
    onSelect: (nodeUuid: string) => void
}

export const SavedConnectionsList = (props: IListProps) => {
    const { connections, onClose, onSelect } = props
    const { t } = useTranslation()

    return (
        <SectionCard.Root>
            <SectionCard.Section>
                <Group gap="sm" wrap="nowrap">
                    <BaseOverlayHeader
                        iconColor="cyan"
                        IconComponent={TbServer}
                        iconVariant="soft"
                        title={t('node-ssh.connections-title')}
                        titleOrder={5}
                    />

                    {onClose && (
                        <CloseButton aria-label={t('common.action.close')} ml="auto" onClick={onClose} />
                    )}
                </Group>
            </SectionCard.Section>

            <SectionCard.Section>
                {connections.length === 0 ? (
                    <Stack align="center" gap={6} py="lg">
                        <ThemeIcon color="gray" radius="md" size={38} variant="soft">
                            <TbServer size={20} />
                        </ThemeIcon>
                        <Text c="dimmed" size="sm" ta="center">
                            {t('node-ssh.connections-empty')}
                        </Text>
                    </Stack>
                ) : (
                    <Box className={classes.snippetList}>
                        <Stack gap={4}>
                            {connections.map((connection) => (
                                <Group
                                    className={classes.snippetRow}
                                    gap="xs"
                                    key={connection.nodeUuid}
                                    onClick={() => onSelect(connection.nodeUuid)}
                                    wrap="nowrap"
                                >
                                    <Box flex={1} miw={0}>
                                        <Group gap={6} wrap="nowrap">
                                            <Box
                                                className={classes.tabDot}
                                                data-absent={!connection.isOpen || undefined}
                                                data-connected={connection.isConnected || undefined}
                                            />
                                            <CountryFlag countryCode={connection.countryCode} />
                                            <Text size="sm" truncate>
                                                {connection.nodeName}
                                            </Text>
                                        </Group>
                                        <Text c="dimmed" ff="monospace" size="xs" truncate>
                                            {connection.username}@{connection.host}:
                                            {connection.port}
                                        </Text>
                                    </Box>
                                    {connection.isCurrent && (
                                        <Badge color="cyan" size="xs" variant="soft">
                                            {t('node-ssh.connections-current')}
                                        </Badge>
                                    )}
                                </Group>
                            ))}
                        </Stack>
                    </Box>
                )}
            </SectionCard.Section>
        </SectionCard.Root>
    )
}

interface IProps {
    connections: ISavedConnection[]
    onClose: () => void
    onSelect: (nodeUuid: string) => void
}

export const SavedConnectionsOverlay = (props: IProps) => {
    const { connections, onClose, onSelect } = props

    return (
        <TerminalOverlay onDismiss={onClose}>
            <SavedConnectionsList connections={connections} onClose={onClose} onSelect={onSelect} />
        </TerminalOverlay>
    )
}
