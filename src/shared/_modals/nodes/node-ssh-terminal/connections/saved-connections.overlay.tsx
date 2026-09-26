import {
    Badge,
    Box,
    CloseButton,
    Group,
    Stack,
    Text,
    ThemeIcon,
    UnstyledButton
} from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { TbServer } from 'react-icons/tb'

import { CountryFlag } from '@shared/ui/get-country-flag'
import { Logo } from '@shared/ui/logo'
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
    nodeVersion: null | string
    port: number
    username: string
}

export interface INodeOrder {
    countryCode?: null | string
    name: string
    uuid: string
    versions?: null | { node: string }
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
                nodeVersion: node.versions?.node ?? null,
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

    const renderBody = () => {
        if (connections.length === 0) {
            return (
                <Stack align="center" gap={6} py="lg">
                    <ThemeIcon color="gray" radius="md" size={38} variant="soft">
                        <TbServer size={20} />
                    </ThemeIcon>
                    <Text c="dimmed" size="sm" ta="center">
                        {t('node-ssh.connections-empty')}
                    </Text>
                </Stack>
            )
        }

        return (
            <Box className={classes.connectionsGrid}>
                {connections.map((connection) => (
                    <UnstyledButton
                        className={classes.connectionCard}
                        data-current={connection.isCurrent || undefined}
                        key={connection.nodeUuid}
                        onClick={() => onSelect(connection.nodeUuid)}
                    >
                        <Group gap={6} wrap="nowrap">
                            <Box
                                className={classes.tabDot}
                                data-absent={!connection.isOpen || undefined}
                                data-connected={connection.isConnected || undefined}
                            />
                            <CountryFlag countryCode={connection.countryCode} />
                            <Text fw={500} size="sm" truncate>
                                {connection.nodeName}
                            </Text>
                            {connection.isCurrent && (
                                <Badge color="cyan" ml="auto" size="xs" variant="soft">
                                    {t('node-ssh.connections-current')}
                                </Badge>
                            )}
                        </Group>

                        <Text c="dimmed" ff="monospace" size="xs" truncate>
                            {connection.username}@{connection.host}:{connection.port}
                        </Text>

                        {connection.nodeVersion && (
                            <Group c="dimmed" gap={4} wrap="nowrap">
                                <Logo size={11} />
                                <Text ff="monospace" size="xs" truncate>
                                    {connection.nodeVersion}
                                </Text>
                            </Group>
                        )}
                    </UnstyledButton>
                ))}
            </Box>
        )
    }

    return (
        <SectionCard.Root allDividers={false} className={classes.connectionsCard} pos="relative">
            {onClose && (
                <CloseButton
                    aria-label={t('common.action.close')}
                    className={classes.connectionsClose}
                    onClick={onClose}
                    radius="xl"
                    size="md"
                />
            )}

            <SectionCard.Section className={classes.connectionsScroll}>
                {renderBody()}
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
        <TerminalOverlay fitHeight maxWidth={860} onDismiss={onClose}>
            <SavedConnectionsList connections={connections} onClose={onClose} onSelect={onSelect} />
        </TerminalOverlay>
    )
}
