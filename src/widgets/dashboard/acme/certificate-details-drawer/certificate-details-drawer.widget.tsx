import {
    Alert,
    Badge,
    Button,
    Code,
    CopyButton,
    Drawer,
    Group,
    Loader,
    Paper,
    ScrollArea,
    Stack,
    Text,
    Timeline
} from '@mantine/core'
import { TbAlertTriangle, TbCertificate, TbCheck, TbCopy, TbUpload } from 'react-icons/tb'
import { z } from 'zod'

import { queryClient } from '@shared/api'
import { ACME_CHALLENGE_TYPE, AcmeCertificateSchema } from '@shared/api/contracts/acme.contract'
import {
    QueryKeys,
    useGetAcmeCertificateEvents,
    useGetAcmePersistRecord,
    usePublishAcmePersistRecord
} from '@shared/api/hooks'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'

type Certificate = z.infer<typeof AcmeCertificateSchema>

interface IProps {
    certificate: Certificate | null
    onClose: () => void
}

export const AcmeCertificateDetailsDrawerWidget = ({ certificate, onClose }: IProps) => {
    const isPersist = certificate?.challengeType === ACME_CHALLENGE_TYPE.DNS_PERSIST_01

    const { data: events, isLoading: isEventsLoading } = useGetAcmeCertificateEvents({
        query: {},
        route: { uuid: certificate?.uuid ?? '' },
        rQueryParams: { enabled: Boolean(certificate) }
    })

    const { data: persistRecord, isLoading: isRecordLoading } = useGetAcmePersistRecord({
        query: {},
        route: { uuid: certificate?.uuid ?? '' },
        rQueryParams: { enabled: Boolean(certificate) && isPersist }
    })

    const publishRecord = usePublishAcmePersistRecord({})

    const handlePublish = async () => {
        if (!certificate) {
            return
        }

        await publishRecord.mutateAsync({ route: { uuid: certificate.uuid } })
        await queryClient.invalidateQueries({
            queryKey: QueryKeys.acme.getPersistRecord({ uuid: certificate.uuid }).queryKey
        })
    }

    return (
        <Drawer
            onClose={onClose}
            opened={Boolean(certificate)}
            position="right"
            size="lg"
            title={
                <BaseOverlayHeader
                    iconColor="teal"
                    IconComponent={TbCertificate}
                    iconVariant="soft"
                    subtitle={certificate?.domains.join(', ')}
                    title={certificate?.name ?? ''}
                    titleOrder={5}
                />
            }
        >
            <Stack gap="lg">
                {certificate?.lastError && (
                    <Alert color="red" icon={<TbAlertTriangle size={18} />} variant="light">
                        {certificate.lastError}
                    </Alert>
                )}

                {isPersist && (
                    <Paper p="md" withBorder>
                        <Stack gap="sm">
                            <Group justify="space-between">
                                <Text fw={600}>Persistent authorization record</Text>

                                {persistRecord?.isPublished ? (
                                    <Badge color="teal" variant="light">
                                        found in DNS
                                    </Badge>
                                ) : (
                                    <Badge color="yellow" variant="light">
                                        not visible yet
                                    </Badge>
                                )}
                            </Group>

                            {isRecordLoading && <Loader size="sm" />}

                            {persistRecord && (
                                <>
                                    <Text c="dimmed" size="xs">
                                        Publish this TXT record once. Every issuance and renewal
                                        afterwards needs no DNS access at all.
                                    </Text>

                                    <Code block>{persistRecord.name}</Code>
                                    <Code block>{persistRecord.value}</Code>

                                    <Group>
                                        <CopyButton
                                            value={`${persistRecord.name} IN TXT "${persistRecord.value}"`}
                                        >
                                            {({ copied, copy }) => (
                                                <Button
                                                    leftSection={
                                                        copied ? (
                                                            <TbCheck size={16} />
                                                        ) : (
                                                            <TbCopy size={16} />
                                                        )
                                                    }
                                                    onClick={copy}
                                                    variant="default"
                                                >
                                                    {copied ? 'Copied' : 'Copy record'}
                                                </Button>
                                            )}
                                        </CopyButton>

                                        {persistRecord.canPublish && (
                                            <Button
                                                leftSection={<TbUpload size={16} />}
                                                loading={publishRecord.isPending}
                                                onClick={handlePublish}
                                            >
                                                Publish via credential
                                            </Button>
                                        )}
                                    </Group>
                                </>
                            )}
                        </Stack>
                    </Paper>
                )}

                <Stack gap="sm">
                    <Text fw={600}>Log</Text>

                    {isEventsLoading && <Loader size="sm" />}

                    <ScrollArea.Autosize mah={480}>
                        <Timeline active={-1} bulletSize={14} lineWidth={2}>
                            {events?.events.map((event) => (
                                <Timeline.Item
                                    color={event.level === 'ERROR' ? 'red' : 'teal'}
                                    key={event.id}
                                    title={new Date(event.createdAt).toLocaleString()}
                                >
                                    <Text size="sm">{event.message}</Text>
                                </Timeline.Item>
                            ))}
                        </Timeline>

                        {events?.events.length === 0 && (
                            <Text c="dimmed" size="sm">
                                Nothing recorded yet.
                            </Text>
                        )}
                    </ScrollArea.Autosize>
                </Stack>
            </Stack>
        </Drawer>
    )
}
