import { Alert, Badge, Button, Group, Loader, Modal, Stack, Text } from '@mantine/core'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { useGetMeshJob } from '@shared/api/hooks'

export function MeshJobModal({ id, onClose }: { id: null | string; onClose: () => void }) {
    const { t } = useTranslation(undefined, { keyPrefix: 'mesh' })
    const query = useGetMeshJob(id)
    const job = query.data
    const client = useQueryClient()
    useEffect(() => {
        if (job?.status === 'done' || job?.status === 'failed') {
            void client.invalidateQueries({ queryKey: ['mesh', 'status'] })
        }
    }, [job?.status, client])
    return (
        <Modal centered onClose={onClose} opened={!!id} size="lg" title={t('jobTitle')}>
            <Stack aria-live="polite" gap="sm">
                {query.isPending && <Loader aria-label={t('running')} size="sm" />}
                {query.isError && (
                    <Alert color="red" title={t('jobUnavailable')}>
                        <Button mt="sm" onClick={() => void query.refetch()} variant="light">
                            {t('retry')}
                        </Button>
                    </Alert>
                )}
                {job && (
                    <>
                        <Group justify="space-between">
                            <Text fw={600}>{job.title}</Text>
                            <Badge
                                color={
                                    job.status === 'failed'
                                        ? 'red'
                                        : job.status === 'done'
                                          ? 'teal'
                                          : 'blue'
                                }
                            >
                                {job.status === 'done'
                                    ? t('done')
                                    : job.status === 'failed'
                                      ? t('failed')
                                      : t('running')}
                            </Badge>
                        </Group>
                        {job.steps.map((step, index) => (
                            <Text key={`${step.t}-${index}`} size="sm">
                                <Text c="dimmed" component="span" mr="xs" size="xs">
                                    {step.t}
                                </Text>
                                {step.text}
                            </Text>
                        ))}
                        {job.error && (
                            <Alert color="red" title={t('failed')}>
                                {job.error}
                            </Alert>
                        )}
                        {job.status === 'running' && (
                            <Text c="dimmed" size="sm">
                                {t('continues')}
                            </Text>
                        )}
                    </>
                )}
                <Group justify="flex-end">
                    <Button onClick={onClose} variant="default">
                        {t('close')}
                    </Button>
                </Group>
            </Stack>
        </Modal>
    )
}
