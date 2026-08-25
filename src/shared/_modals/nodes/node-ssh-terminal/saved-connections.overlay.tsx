import { Badge, Box, Button, Group, Stack, Text, ThemeIcon } from '@mantine/core'
import { motion } from 'motion/react'
import { useTranslation } from 'react-i18next'
import { TbServer } from 'react-icons/tb'

import { CountryFlag } from '@shared/ui/get-country-flag'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { SectionCard } from '@shared/ui/section-card'

import classes from './NodeSshTerminal.module.css'

export interface ISavedConnection {
    countryCode: null | string | undefined
    host: string
    isCurrent: boolean
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
    currentNodeUuid: string
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
                isCurrent: node.uuid === currentNodeUuid,
                nodeName: node.name,
                nodeUuid: node.uuid,
                port: profile.port,
                username: profile.username
            }
        })
}

interface IProps {
    connections: ISavedConnection[]
    onClose: () => void
    onSelect: (nodeUuid: string) => void
}

export const SavedConnectionsOverlay = (props: IProps) => {
    const { connections, onClose, onSelect } = props
    const { t } = useTranslation()

    return (
        <motion.div
            animate={{ opacity: 1 }}
            className={classes.overlay}
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
        >
            <motion.div
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 4 }}
                initial={{ opacity: 0, scale: 0.98, y: 8 }}
                style={{ maxWidth: 520, width: '100%' }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
                <SectionCard.Root>
                    <SectionCard.Section>
                        <BaseOverlayHeader
                            iconColor="cyan"
                            IconComponent={TbServer}
                            iconVariant="soft"
                            title={t('node-ssh.connections-title')}
                            titleOrder={5}
                        />
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
                                                    <CountryFlag
                                                        countryCode={connection.countryCode}
                                                    />
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

                    <SectionCard.Section>
                        <Button color="gray" fullWidth onClick={onClose} variant="light">
                            {t('common.close')}
                        </Button>
                    </SectionCard.Section>
                </SectionCard.Root>
            </motion.div>
        </motion.div>
    )
}
