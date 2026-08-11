import { ActionIcon, Badge, Box, Flex, Menu, Progress, Text, Tooltip } from '@mantine/core'
import { useClipboard } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { memo } from 'react'
import { PiGlobeSimple, PiPencil, PiTrashDuotone } from 'react-icons/pi'
import {
    TbDotsVertical,
    TbFileUpload,
    TbKey,
    TbListDetails,
    TbRefresh,
    TbServer
} from 'react-icons/tb'
import { z } from 'zod'

import {
    ACME_CERTIFICATE_SOURCE,
    ACME_CERTIFICATE_STATUS,
    AcmeCertificateSchema,
    TAcmeCertificateStatus
} from '@shared/api/contracts/acme.contract'
import { useIsMobile } from '@shared/hooks'

import classes from './CertificateCard.module.css'

type Certificate = z.infer<typeof AcmeCertificateSchema>

interface IProps {
    certificate: Certificate
    onDelete: (certificate: Certificate) => void
    onDetails: (certificate: Certificate) => void
    onEdit: (certificate: Certificate) => void
    onIssue: (certificate: Certificate) => void
    onReplace: (certificate: Certificate) => void
}

const STATUS_COLORS: Record<TAcmeCertificateStatus, string> = {
    [ACME_CERTIFICATE_STATUS.ACTIVE]: 'teal',
    [ACME_CERTIFICATE_STATUS.AWAITING_DNS]: 'yellow',
    [ACME_CERTIFICATE_STATUS.ERROR]: 'red',
    [ACME_CERTIFICATE_STATUS.ISSUING]: 'blue',
    [ACME_CERTIFICATE_STATUS.PENDING]: 'gray'
}

const getCertificateColors = (certificate: Certificate) => {
    if (!certificate.isEnabled) {
        return {
            backgroundColor: 'rgba(107, 114, 128, 0.15)',
            borderColor: 'rgba(107, 114, 128, 0.3)',
            boxShadow: 'rgba(107, 114, 128, 0.2)'
        }
    }
    switch (certificate.status) {
        case ACME_CERTIFICATE_STATUS.ACTIVE:
            return {
                backgroundColor: 'rgba(45, 212, 191, 0.15)',
                borderColor: 'rgba(45, 212, 191, 0.3)',
                boxShadow: 'rgba(45, 212, 191, 0.2)'
            }
        case ACME_CERTIFICATE_STATUS.AWAITING_DNS:
        case ACME_CERTIFICATE_STATUS.ISSUING:
            return {
                backgroundColor: 'rgba(245, 158, 11, 0.15)',
                borderColor: 'rgba(245, 158, 11, 0.3)',
                boxShadow: 'rgba(245, 158, 11, 0.2)'
            }
        case ACME_CERTIFICATE_STATUS.ERROR:
            return {
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                borderColor: 'rgba(239, 68, 68, 0.3)',
                boxShadow: 'rgba(239, 68, 68, 0.2)'
            }
        default:
            return {
                backgroundColor: 'rgba(107, 114, 128, 0.15)',
                borderColor: 'rgba(107, 114, 128, 0.3)',
                boxShadow: 'rgba(107, 114, 128, 0.2)'
            }
    }
}

/** Days left, or null when the certificate has never been issued. */
function daysLeft(expiresAt: Date | null): null | number {
    if (!expiresAt) {
        return null
    }

    return Math.floor((new Date(expiresAt).getTime() - Date.now()) / 86_400_000)
}

/** Elapsed share of the certificate lifetime, 0-100. */
function lifetimeElapsedPercent(issuedAt: Date | null, expiresAt: Date | null): null | number {
    if (!issuedAt || !expiresAt) {
        return null
    }

    const start = new Date(issuedAt).getTime()
    const end = new Date(expiresAt).getTime()
    if (end <= start) {
        return 100
    }

    return Math.min(100, Math.max(0, Math.round(((Date.now() - start) / (end - start)) * 100)))
}

export const AcmeCertificateCardWidget = memo((props: IProps) => {
    const { certificate, onDelete, onDetails, onEdit, onIssue, onReplace } = props

    const isMobile = useIsMobile()
    const clipboard = useClipboard({ timeout: 500 })

    const isImported = certificate.source === ACME_CERTIFICATE_SOURCE.IMPORTED
    const left = daysLeft(certificate.expiresAt)
    const elapsed = lifetimeElapsedPercent(certificate.issuedAt, certificate.expiresAt)
    const { backgroundColor, borderColor, boxShadow } = getCertificateColors(certificate)

    const expiryColor =
        left === null || left <= 0
            ? 'red.6'
            : left <= certificate.renewBeforeDays
              ? 'yellow.6'
              : 'teal.6'

    const domainsLine = certificate.domains.join(', ')

    const handleCopyDomains = (e: React.MouseEvent) => {
        e.stopPropagation()
        clipboard.copy(domainsLine)
        notifications.show({
            message: domainsLine,
            title: 'Copied',
            color: 'teal'
        })
    }

    const statusBadge = (
        <Tooltip
            disabled={
                certificate.status !== ACME_CERTIFICATE_STATUS.ERROR || !certificate.lastError
            }
            label={certificate.lastError}
            multiline
            w={360}
        >
            <Badge color={STATUS_COLORS[certificate.status]} size="lg" variant="light">
                {certificate.status}
            </Badge>
        </Tooltip>
    )

    const nodesBadge = (
        <Tooltip
            label={
                certificate.nodes.length === 0
                    ? 'Not bound to any node'
                    : certificate.nodes
                          .map((binding) => binding.nodeName ?? binding.nodeUuid)
                          .join(', ')
            }
        >
            <Badge
                color={certificate.nodes.length > 0 ? 'blue' : 'gray'}
                leftSection={<TbServer size={14} />}
                miw="6ch"
                size="lg"
                variant="outline"
            >
                {certificate.nodes.length}
            </Badge>
        </Tooltip>
    )

    const secondaryBadges = (
        <>
            {isImported && (
                <Tooltip label="Uploaded material, never renewed by the panel">
                    <Badge color="grape" size="lg" variant="light">
                        imported
                    </Badge>
                </Tooltip>
            )}

            {!certificate.isEnabled && (
                <Badge color="gray" size="lg" variant="light">
                    disabled
                </Badge>
            )}
        </>
    )

    const expiryBlock =
        left === null ? (
            <Text c="dimmed" size="sm">
                not issued yet
            </Text>
        ) : (
            <Flex direction="column" gap={4}>
                <Flex align="center" justify="space-between">
                    <Text c="dimmed" ff="monospace" fw={600} size="sm" truncate>
                        {left > 0 ? `${left} d left` : left === 0 ? 'expires today' : 'expired'}
                    </Text>
                    <Text c="dimmed" size="xs" truncate>
                        {certificate.expiresAt
                            ? new Date(certificate.expiresAt).toLocaleDateString()
                            : ''}
                    </Text>
                </Flex>
                <Progress color={expiryColor} radius="sm" size="sm" value={elapsed ?? 0} />
            </Flex>
        )

    const credentialBadge = certificate.credentialName && (
        <Tooltip label="DNS credential">
            <Badge
                color="gray"
                leftSection={<TbKey size={14} />}
                size="lg"
                style={{
                    maxWidth: '18ch',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                }}
                variant="light"
            >
                {certificate.credentialName}
            </Badge>
        </Tooltip>
    )

    const actionsMenu = (
        <Box className={classes.menuButton} onClick={(e) => e.stopPropagation()}>
            <Menu position="bottom-end" shadow="md" width={220}>
                <Menu.Target>
                    <ActionIcon color="gray" size="lg" variant="subtle">
                        <TbDotsVertical size={20} />
                    </ActionIcon>
                </Menu.Target>

                <Menu.Dropdown>
                    <Menu.Item
                        leftSection={<PiPencil size={18} />}
                        onClick={() => onEdit(certificate)}
                    >
                        Edit
                    </Menu.Item>

                    {isImported ? (
                        <Menu.Item
                            leftSection={<TbFileUpload size={18} />}
                            onClick={() => onReplace(certificate)}
                        >
                            Upload new material
                        </Menu.Item>
                    ) : (
                        <Menu.Item
                            leftSection={<TbRefresh size={18} />}
                            onClick={() => onIssue(certificate)}
                        >
                            Issue now
                        </Menu.Item>
                    )}

                    <Menu.Item
                        leftSection={<TbListDetails size={18} />}
                        onClick={() => onDetails(certificate)}
                    >
                        Details
                    </Menu.Item>

                    <Menu.Divider />

                    <Menu.Item
                        color="red"
                        leftSection={<PiTrashDuotone size={18} />}
                        onClick={() => onDelete(certificate)}
                    >
                        Delete
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>
        </Box>
    )

    return (
        <Box
            className={classes.certRow}
            onClick={() => onEdit(certificate)}
            style={{
                background: `linear-gradient(
                    135deg,
                    ${backgroundColor} 0%,
                    var(--mantine-color-dark-7) 100%
                )`,
                borderColor,
                boxShadow
            }}
        >
            {actionsMenu}

            {!isMobile && (
                <div className={classes.desktopGrid}>
                    <div>
                        <Flex align="center" gap="sm">
                            {statusBadge}

                            <Flex align="center" className={classes.nameContainer} gap="xs">
                                <Text className={classes.certName} fw={600} size="md">
                                    {certificate.name}
                                </Text>
                            </Flex>

                            <Flex align="center" gap="xs">
                                {secondaryBadges}
                            </Flex>
                        </Flex>
                    </div>

                    <div>
                        <Flex align="center" gap="xs">
                            <PiGlobeSimple className={classes.icon} size={14} />
                            <Tooltip label={domainsLine}>
                                <Text
                                    c="dimmed"
                                    className={classes.domainsText}
                                    onClick={handleCopyDomains}
                                    size="sm"
                                >
                                    {domainsLine}
                                </Text>
                            </Tooltip>
                        </Flex>
                    </div>

                    <div>{expiryBlock}</div>

                    <div>
                        <Flex align="center" gap="xs" justify="flex-end">
                            {credentialBadge}
                            {nodesBadge}
                        </Flex>
                    </div>
                </div>
            )}

            {isMobile && (
                <Box>
                    <Flex align="center" gap="sm" mb="xs">
                        {statusBadge}

                        <Flex align="center" gap="xs" style={{ flex: 1, minWidth: 0 }}>
                            <Text className={classes.certName} fw={600} size="sm">
                                {certificate.name}
                            </Text>
                        </Flex>
                    </Flex>

                    <Flex align="center" gap="xs" mb="xs">
                        <PiGlobeSimple className={classes.icon} size={14} />
                        <Text
                            c="dimmed"
                            className={classes.domainsText}
                            onClick={handleCopyDomains}
                            size="sm"
                        >
                            {domainsLine}
                        </Text>
                    </Flex>

                    <Box mb="xs">{expiryBlock}</Box>

                    <Flex align="center" gap="xs" wrap="wrap">
                        {credentialBadge}
                        {nodesBadge}
                        {secondaryBadges}
                    </Flex>
                </Box>
            )}
        </Box>
    )
})
