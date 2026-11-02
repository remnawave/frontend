import {
    ActionIcon,
    Alert,
    Badge,
    Button,
    Card,
    Chip,
    Group,
    ScrollArea,
    Select,
    Stack,
    Switch,
    Table,
    Text,
    Tooltip,
    Modal,
    TextInput
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { modals } from '@mantine/modals'
import i18next from 'i18next'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TbAlertTriangle, TbNetwork, TbPlus, TbRefresh, TbTrash } from 'react-icons/tb'

import {
    MeshStatus,
    useGetMeshJob,
    useMeshProbeNow,
    usePinMeshNode,
    useRemoveMeshNode,
    useSetMeshFlags,
    useSetMeshEtcdMember,
    useSetMeshRelay,
    useTeardownMesh
} from '@shared/api/hooks'
import { LoadingScreen, Page, PageHeaderShared } from '@shared/ui'

import { ui } from '../labels'
import { AddNodeModal } from './add-node.modal'
import { MeshJobModal } from './mesh-job.modal'
import { MeshMap } from './mesh-map'

interface IProps {
    isError: boolean
    isLoading: boolean
    status: MeshStatus | undefined
}

const healthBadge = (value: boolean | null, yes: string, no: string) => {
    if (value === null)
        return (
            <Badge color="gray" variant="light">
                {' '}
                {ui('no-data')}{' '}
            </Badge>
        )
    return (
        <Badge color={value ? 'teal' : 'red'} variant="light">
            {value ? yes : no}
        </Badge>
    )
}

const ago = (unix: number) => {
    if (!unix) return '—'
    const s = Math.max(0, Math.round(Date.now() / 1000 - unix))
    return s < 90
        ? i18next.t('mesh.age', { seconds: s })
        : i18next.t('mesh.fork.minutesAgo', { count: Math.round(s / 60) })
}

const getKindLabels = (): Record<string, { color: string; label: string }> => ({
    etcd: { color: 'cyan', label: 'etcd' },
    balancer: { color: 'grape', label: ui('balancer') },
    flags: { color: 'gray', label: ui('settings') },
    health: { color: 'teal', label: ui('health') },
    info: { color: 'gray', label: ui('information') },
    ip: { color: 'pink', label: ui('ip-change') },
    node: { color: 'cyan', label: ui('nodes') },
    path: { color: 'blue', label: ui('route') },
    relay: { color: 'orange', label: ui('relay') }
})

const bytes = (n?: number) =>
    n == null
        ? '—'
        : n > 1048576
          ? `${(n / 1048576).toFixed(1)} MiB`
          : `${Math.round(n / 1024)} KiB`

function RemoveJobWatcher({ id }: { id: string }) {
    const { data } = useGetMeshJob(id)
    if (!data) return null
    return (
        <Text c={data.status === 'failed' ? 'red' : 'dimmed'} size="xs">
            {data.title}:{' '}
            {data.status === 'running'
                ? ui('running')
                : data.status === 'done'
                  ? ui('completed')
                  : data.error}
        </Text>
    )
}

export default function MeshPageComponent(props: IProps) {
    const { status, isLoading, isError } = props
    const { t } = useTranslation()
    const KIND_LABEL = getKindLabels()
    const [activeJob, setActiveJob] = useState<null | string>(null)
    const [addOpened, addCtl] = useDisclosure(false)
    const [removeJob, setRemoveJob] = useState<null | string>(null)
    const [kinds, setKinds] = useState<string[]>([
        'relay',
        'balancer',
        'ip',
        'node',
        'health',
        'path',
        'flags',
        'etcd'
    ])

    const setFlags = useSetMeshFlags()
    const pin = usePinMeshNode()
    const probe = useMeshProbeNow()
    const relay = useSetMeshRelay()
    const remove = useRemoveMeshNode()
    const etcdChange = useSetMeshEtcdMember()
    const [etcdJob, setEtcdJob] = useState<null | string>(null)

    const teardown = useTeardownMesh()
    const [teardownOpened, teardownCtl] = useDisclosure(false)
    const [confirmation, setConfirmation] = useState('')
    const standalone =
        status?.control_plane.mode === 'standalone' || status?.control_plane.mode === 'removed'
    const editable = !isError && (!!status?.overlay.etcd_up || standalone)
    const retryPause = status?.control_plane.mode === 'pausing'
    const exits = status ? Object.entries(status.exits) : []
    const names = status ? Object.keys(status.overlay.nodes).sort() : []

    const changeEtcd = (name: string, member: boolean) =>
        modals.openConfirmModal({
            title: member
                ? i18next.t('mesh.memberAddTitle', { name })
                : i18next.t('mesh.memberRemoveTitle', { name }),
            children: (
                <Text size="sm">
                    {member
                        ? ui('the-controller-installs-etcd-with-mutual-tls-waits-for')
                        : status && status.quorum.size <= 3
                          ? ui('pauseEtcdConfirmation')
                          : ui('the-node-leaves-quorum-and-its-etcd-container-stops-dat')}
                </Text>
            ),
            labels: {
                cancel: ui('cancel'),
                confirm: member ? ui('install-and-join') : ui('leave-etcd')
            },
            confirmProps: { color: member ? 'teal' : 'red' },
            onConfirm: () =>
                etcdChange.mutate({ name, member }, { onSuccess: (r) => setEtcdJob(r.job) })
        })

    const confirmRemove = (name: string) =>
        modals.openConfirmModal({
            children: (
                <Text size="sm">
                    {' '}
                    {ui('node')} {name}{' '}
                    {ui('will-be-removed-from-mesh-the-controller-removes-its-me')}{' '}
                </Text>
            ),
            confirmProps: { color: 'red' },
            labels: { cancel: ui('cancel'), confirm: ui('remove-from-mesh') },
            onConfirm: () => remove.mutate({ name }, { onSuccess: (r) => setRemoveJob(r.job) }),
            title: i18next.t('mesh.removeTitle', { name })
        })

    return (
        <Page title={t('constants.mesh')}>
            <Stack gap="md">
                <PageHeaderShared
                    actions={
                        <Group gap="xs">
                            <Button
                                color="cyan"
                                leftSection={<TbPlus size={18} />}
                                disabled={!editable || !status?.capabilities.node_management}
                                onClick={addCtl.open}
                                size="sm"
                                variant="filled"
                            >
                                {' '}
                                {ui('add-node')}{' '}
                            </Button>
                            <Button
                                color="cyan"
                                leftSection={<TbRefresh size={18} />}
                                loading={probe.isPending}
                                disabled={isError || !status}
                                onClick={() => probe.mutate(undefined)}
                                size="sm"
                                variant="light"
                            >
                                {' '}
                                {ui('probe-now')}{' '}
                            </Button>
                        </Group>
                    }
                    description={ui('data-reachability-from-entry-to-exit-nodes-overlay-link')}
                    icon={<TbNetwork size={24} />}
                    title={t('constants.mesh')}
                />

                <AddNodeModal
                    onClose={addCtl.close}
                    opened={addOpened}
                    onAccepted={setActiveJob}
                    canJoinEtcd={!!status?.capabilities.membership}
                />
                <Modal
                    opened={teardownOpened}
                    onClose={() => {
                        teardownCtl.close()
                        setConfirmation('')
                    }}
                    title={ui('removeEntireMesh')}
                >
                    <Stack>
                        <Text size="sm">{ui('teardownExplanation')}</Text>
                        <TextInput
                            label={ui('typeRemovalPhrase')}
                            value={confirmation}
                            onChange={(event) => setConfirmation(event.currentTarget.value)}
                        />
                        <Button
                            color="red"
                            disabled={confirmation !== 'REMOVE_MESH'}
                            loading={teardown.isPending}
                            onClick={() =>
                                teardown.mutate(
                                    { confirm: 'REMOVE_MESH' },
                                    {
                                        onSuccess: (result) => {
                                            teardownCtl.close()
                                            setConfirmation('')
                                            setActiveJob(result.job)
                                        }
                                    }
                                )
                            }
                        >
                            {ui('removeEntireMesh')}
                        </Button>
                    </Stack>
                </Modal>
                <MeshJobModal id={activeJob} onClose={() => setActiveJob(null)} />

                {isError && (
                    <Alert
                        color="red"
                        icon={<TbAlertTriangle />}
                        title={ui('controller-unavailable')}
                    >
                        {' '}
                        {ui('mesh-status-could-not-be-loaded-check-the-controller-co')}{' '}
                        <Button
                            ml="sm"
                            onClick={() => window.location.reload()}
                            variant="light"
                            size="xs"
                        >
                            {' '}
                            {ui('retry')}{' '}
                        </Button>
                    </Alert>
                )}

                {isLoading && <LoadingScreen height="40vh" />}

                {status && (
                    <>
                        <Card withBorder>
                            <Stack gap="sm">
                                <Group justify="space-between">
                                    <Text fw={600}> {ui('automation')} </Text>
                                    <Group gap="xs">
                                        <Badge
                                            color={
                                                status.overlay.etcd_up
                                                    ? 'teal'
                                                    : standalone
                                                      ? 'gray'
                                                      : 'red'
                                            }
                                            variant="light"
                                        >
                                            {standalone
                                                ? status.control_plane.mode === 'removed'
                                                    ? ui('meshRemoved')
                                                    : ui('etcdStopped')
                                                : `etcd ${status.overlay.etcd_up ? 'ok' : ui('unavailable')}`}
                                        </Badge>
                                        {Object.entries(status.entries_ssh).map(([name, ok]) => (
                                            <Badge
                                                color={ok ? 'teal' : 'red'}
                                                key={name}
                                                variant="light"
                                            >
                                                {' '}
                                                {ui('entry')} {name}:{' '}
                                                {ok ? 'ssh ok' : ui('ssh-unavailable')}
                                            </Badge>
                                        ))}
                                        <Text c="dimmed" size="xs">
                                            {' '}
                                            {ui('cycle')} {status.cycles}, {ago(status.last_cycle)}
                                        </Text>
                                    </Group>
                                </Group>

                                {status.balancer_error && (
                                    <Alert
                                        color="red"
                                        title={ui('balancer-not-selected-or-unavailable')}
                                    >
                                        {status.balancer_error}
                                    </Alert>
                                )}
                                <Text size="xs" c="dimmed">
                                    {' '}
                                    {ui('balancer-2')}{' '}
                                    {status.balancer_selector ?? ui('not-configured')}{' '}
                                    {ui(
                                        'manual-relay-modes-remain-pinned-and-are-not-overridden'
                                    )}{' '}
                                </Text>
                                <Switch
                                    checked={status.auto_balancer}
                                    description={ui(
                                        'check-the-direct-path-and-with-mesh-fallback-enabled-th'
                                    )}
                                    disabled={
                                        !editable ||
                                        setFlags.isPending ||
                                        !status.capabilities.balancer
                                    }
                                    label={ui('manage-balancer-automatically')}
                                    onChange={(e) =>
                                        setFlags.mutate({ auto_balancer: e.currentTarget.checked })
                                    }
                                />
                                <Switch
                                    checked={status.auto_relay}
                                    description={ui(
                                        'when-direct-access-fails-but-overlay-works-create-entry'
                                    )}
                                    disabled={
                                        !editable ||
                                        setFlags.isPending ||
                                        !status.capabilities.relay
                                    }
                                    label={ui('automatic-overlay-relay')}
                                    onChange={(e) =>
                                        setFlags.mutate({ auto_relay: e.currentTarget.checked })
                                    }
                                />
                                <Switch
                                    checked={status.auto_ip_update}
                                    description={ui(
                                        'after-a-confirmed-server-ip-change-update-mesh-membersh'
                                    )}
                                    disabled={
                                        !editable ||
                                        setFlags.isPending ||
                                        !status.capabilities.ip_update
                                    }
                                    label={ui('track-node-ip-changes')}
                                    onChange={(e) =>
                                        setFlags.mutate({ auto_ip_update: e.currentTarget.checked })
                                    }
                                />
                            </Stack>
                        </Card>

                        <Card withBorder>
                            <Group justify="space-between" mb="xs">
                                <Text fw={600}> {ui('link-map')} </Text>
                                <Text c="dimmed" size="xs">
                                    {' '}
                                    {ui(
                                        'refreshes-every-10-seconds-transit-selection-considers'
                                    )}{' '}
                                </Text>
                            </Group>
                            <MeshMap status={status} />
                        </Card>

                        <Card withBorder>
                            <Group justify="space-between" mb="sm">
                                <Text fw={600}> {ui('etcd-quorum')} </Text>
                                <Badge
                                    color={
                                        status.quorum.quorum === null
                                            ? 'gray'
                                            : status.quorum.quorum
                                              ? 'teal'
                                              : 'red'
                                    }
                                    size="lg"
                                    variant="light"
                                >
                                    {status.quorum.quorum === null
                                        ? standalone
                                            ? status.control_plane.mode === 'removed'
                                                ? ui('meshRemoved')
                                                : ui('etcdStopped')
                                            : ui('no-data')
                                        : `${status.quorum.quorum ? ui('quorum-available') : ui('no-quorum')}: ${i18next.t('mesh.memberCount', { healthy: status.quorum.healthy, total: status.quorum.size })}${status.quorum.leader ? `, ${ui('leader')} ${status.quorum.leader}` : ui('no-leader')}`}
                                </Badge>
                            </Group>
                            <Text c="dimmed" mb="xs" size="xs">
                                {' '}
                                {standalone
                                    ? status.control_plane.mode === 'removed'
                                        ? ui('meshRemoved')
                                        : ui('standaloneExplanation')
                                    : ui(
                                          'etcd-stores-mesh-membership-agent-observations-flags-an'
                                      )}{' '}
                            </Text>
                            <Table verticalSpacing="xs">
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th> {ui('member')} </Table.Th>
                                        <Table.Th> {ui('role')} </Table.Th>
                                        <Table.Th> {ui('state')} </Table.Th>
                                        <Table.Th>Term</Table.Th>
                                        <Table.Th>Raft index</Table.Th>
                                        <Table.Th> {ui('database')} </Table.Th>
                                        <Table.Th> {ui('version')} </Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {status.quorum.members.map((m) => (
                                        <Table.Tr key={m.name}>
                                            <Table.Td>
                                                <b>{m.name}</b>{' '}
                                                <Text c="dimmed" component="span" size="xs">
                                                    {m.endpoint.replace('http://', '')}
                                                </Text>
                                            </Table.Td>
                                            <Table.Td>
                                                <Badge
                                                    color={m.leader ? 'yellow' : 'gray'}
                                                    variant={m.leader ? 'filled' : 'light'}
                                                >
                                                    {m.leader ? ui('leader') : ui('follower')}
                                                </Badge>
                                            </Table.Td>
                                            <Table.Td>
                                                {standalone ? (
                                                    <Badge color="gray">{ui('etcdStopped')}</Badge>
                                                ) : (
                                                    healthBadge(
                                                        m.healthy,
                                                        ui('healthy'),
                                                        ui('not-responding')
                                                    )
                                                )}
                                            </Table.Td>
                                            <Table.Td>{m.raft_term ?? '—'}</Table.Td>
                                            <Table.Td>{m.raft_index ?? '—'}</Table.Td>
                                            <Table.Td>{bytes(m.db_size)}</Table.Td>
                                            <Table.Td>{m.version ?? '—'}</Table.Td>
                                        </Table.Tr>
                                    ))}
                                </Table.Tbody>
                            </Table>
                        </Card>

                        <Card withBorder>
                            <Text fw={600} mb="sm">
                                {' '}
                                {ui('manage-etcd-members')}{' '}
                            </Text>
                            <Text size="sm" c="dimmed" mb="sm">
                                {' '}
                                {ui('mesh-is-installed-automatically-on-added-nodes-assign-e')}{' '}
                            </Text>
                            {!status.etcd_mtls && (
                                <Alert color="yellow" mb="sm">
                                    {' '}
                                    {ui(
                                        'configure-etcd-mutual-tls-before-changing-membership'
                                    )}{' '}
                                </Alert>
                            )}
                            {status.etcd_operation && status.etcd_operation.stage !== 'done' && (
                                <Alert color={status.etcd_operation.error ? 'red' : 'blue'} mb="sm">
                                    {status.etcd_operation.name}: {status.etcd_operation.stage}
                                    {status.etcd_operation.error
                                        ? ` — ${status.etcd_operation.error}`
                                        : ui('running-2')}
                                </Alert>
                            )}
                            {etcdJob && <RemoveJobWatcher id={etcdJob} />}
                            {retryPause && names[0] && (
                                <Button
                                    onClick={() =>
                                        etcdChange.mutate(
                                            { name: names[0], member: false },
                                            { onSuccess: (r) => setActiveJob(r.job) }
                                        )
                                    }
                                >
                                    {ui('retryPause')}
                                </Button>
                            )}
                            {standalone && status.control_plane.desired_members.length >= 3 && (
                                <Button
                                    onClick={() =>
                                        etcdChange.mutate(
                                            {
                                                name: status.control_plane.desired_members[0],
                                                member: true
                                            },
                                            { onSuccess: (r) => setActiveJob(r.job) }
                                        )
                                    }
                                >
                                    {ui('resumeEtcd')}
                                </Button>
                            )}
                            <Table verticalSpacing="xs">
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th> {ui('node-2')} </Table.Th>
                                        <Table.Th> {ui('role')} </Table.Th>
                                        <Table.Th> {ui('action')} </Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {names.map((name) => {
                                        const member = status.quorum.members.some(
                                            (m) => m.name === name
                                        )
                                        return (
                                            <Table.Tr key={name}>
                                                <Table.Td>{name}</Table.Td>
                                                <Table.Td>
                                                    <Badge color={member ? 'teal' : 'gray'}>
                                                        {member ? 'etcd + mesh' : ui('mesh-only')}
                                                    </Badge>
                                                </Table.Td>
                                                <Table.Td>
                                                    <Tooltip
                                                        label={
                                                            member && status.quorum.size <= 3
                                                                ? ui('pauseEtcdConfirmation')
                                                                : member
                                                                  ? ui('leave-quorum-and-stop-etcd')
                                                                  : ui(
                                                                        'install-etcd-and-safely-join-the-cluster'
                                                                    )
                                                        }
                                                    >
                                                        <Button
                                                            size="compact-xs"
                                                            variant="light"
                                                            color={member ? 'red' : 'teal'}
                                                            disabled={
                                                                (!editable && !retryPause) ||
                                                                !status.capabilities.membership ||
                                                                etcdChange.isPending
                                                            }
                                                            onClick={() =>
                                                                changeEtcd(name, !member)
                                                            }
                                                        >
                                                            {member
                                                                ? ui('leave-etcd-2')
                                                                : ui('join-etcd')}
                                                        </Button>
                                                    </Tooltip>
                                                </Table.Td>
                                            </Table.Tr>
                                        )
                                    })}
                                </Table.Tbody>
                            </Table>
                        </Card>

                        <Card withBorder>
                            <Text fw={600} mb="sm">
                                {' '}
                                {ui('exits')}{' '}
                            </Text>
                            <ScrollArea>
                                <Table highlightOnHover verticalSpacing="xs">
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Th> {ui('exit')} </Table.Th>
                                            <Table.Th> {ui('node-2')} </Table.Th>
                                            <Table.Th> {ui('direct-from-entries')} </Table.Th>
                                            <Table.Th> {ui('through-overlay')} </Table.Th>
                                            <Table.Th> {ui('from-controller')} </Table.Th>
                                            <Table.Th> {ui('from-entries')} </Table.Th>
                                            <Table.Th> {ui('balancer-3')} </Table.Th>
                                            <Table.Th> {ui('relay-2')} </Table.Th>
                                            <Table.Th> {ui('keep-disabled')} </Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {exits.map(([name, e]) => {
                                            const node = status.exits_nodes[name] ?? ''
                                            const disabled = status.balancer_disabled[node]
                                            const rl = status.relays[name]
                                            const capable = status.relay_capable.includes(name)
                                            return (
                                                <Table.Tr key={name}>
                                                    <Table.Td>
                                                        <b>{name}</b>
                                                    </Table.Td>
                                                    <Table.Td>{node || '—'}</Table.Td>
                                                    <Table.Td>
                                                        {healthBadge(
                                                            e.direct_healthy,
                                                            ui('reachable'),
                                                            ui('unreachable')
                                                        )}
                                                    </Table.Td>
                                                    <Table.Td>
                                                        {healthBadge(
                                                            e.wg_healthy,
                                                            ui('reachable'),
                                                            ui('no-path')
                                                        )}
                                                    </Table.Td>
                                                    <Table.Td>
                                                        {e.from_cluster === null
                                                            ? '—'
                                                            : `${Math.round(e.from_cluster * 100)}%`}
                                                    </Table.Td>
                                                    <Table.Td>
                                                        {Object.entries(e.per_entry).map(
                                                            ([entry, paths]) => (
                                                                <Text key={entry} size="xs">
                                                                    {entry}:{' '}
                                                                    {Object.entries(paths)
                                                                        .map(
                                                                            ([p, v]) =>
                                                                                `${p} ${Math.round(v * 100)}%`
                                                                        )
                                                                        .join(' · ')}
                                                                </Text>
                                                            )
                                                        )}
                                                    </Table.Td>
                                                    <Table.Td>
                                                        {disabled === undefined ? (
                                                            '—'
                                                        ) : (
                                                            <Badge
                                                                color={disabled ? 'red' : 'teal'}
                                                                variant="light"
                                                            >
                                                                {disabled
                                                                    ? ui('disabled')
                                                                    : ui('active')}
                                                            </Badge>
                                                        )}
                                                        {status.balancer_routing_mode ===
                                                            'mesh-fallback' &&
                                                            status.balancer_routes[node] &&
                                                            !disabled && (
                                                                <Text size="xs" c="dimmed">
                                                                    {status.balancer_routes[node]
                                                                        .path === 'mesh'
                                                                        ? ui('via-mesh')
                                                                        : ui('direct')}
                                                                </Text>
                                                            )}
                                                    </Table.Td>
                                                    <Table.Td>
                                                        {capable ? (
                                                            <Group gap={6} wrap="nowrap">
                                                                <Badge
                                                                    color={
                                                                        rl?.on ? 'orange' : 'gray'
                                                                    }
                                                                    variant="light"
                                                                >
                                                                    {rl?.on
                                                                        ? ui('enabled')
                                                                        : ui('disabled-2')}
                                                                </Badge>
                                                                <Select
                                                                    aria-label={`${i18next.t('mesh.mode')}: ${name}`}
                                                                    data={[
                                                                        {
                                                                            value: 'auto',
                                                                            label: ui('automatic')
                                                                        },
                                                                        {
                                                                            value: 'direct',
                                                                            label: ui('direct')
                                                                        },
                                                                        {
                                                                            value: 'relay',
                                                                            label: ui('via-relay')
                                                                        }
                                                                    ]}
                                                                    disabled={
                                                                        !editable ||
                                                                        !status.capabilities
                                                                            .relay ||
                                                                        (relay.isPending &&
                                                                            relay.variables
                                                                                ?.exit === name)
                                                                    }
                                                                    onChange={(mode) => {
                                                                        if (
                                                                            !editable ||
                                                                            !status.capabilities
                                                                                .relay
                                                                        )
                                                                            return
                                                                        if (
                                                                            mode === 'auto' ||
                                                                            mode === 'direct' ||
                                                                            mode === 'relay'
                                                                        )
                                                                            relay.mutate({
                                                                                exit: name,
                                                                                mode
                                                                            })
                                                                    }}
                                                                    value={
                                                                        status.relay_modes[name] ??
                                                                        'auto'
                                                                    }
                                                                    w={150}
                                                                />
                                                                {rl?.pending && (
                                                                    <Badge color="yellow">
                                                                        {' '}
                                                                        {ui('switching')}{' '}
                                                                    </Badge>
                                                                )}
                                                            </Group>
                                                        ) : (
                                                            <Text c="dimmed" size="xs">
                                                                {' '}
                                                                {ui('none')}{' '}
                                                            </Text>
                                                        )}
                                                    </Table.Td>
                                                    <Table.Td>
                                                        {node ? (
                                                            <Tooltip
                                                                label={ui(
                                                                    'keep-this-node-excluded-from-the-balancer-regardless-of'
                                                                )}
                                                                multiline
                                                                w={280}
                                                            >
                                                                <Switch
                                                                    checked={status.pinned_disabled.includes(
                                                                        node
                                                                    )}
                                                                    aria-label={`${ui('keep-disabled')}: ${node}`}
                                                                    disabled={
                                                                        !editable ||
                                                                        pin.isPending ||
                                                                        !status.capabilities
                                                                            .balancer
                                                                    }
                                                                    onChange={(ev) =>
                                                                        pin.mutate({
                                                                            node,
                                                                            pinned: ev.currentTarget
                                                                                .checked
                                                                        })
                                                                    }
                                                                />
                                                            </Tooltip>
                                                        ) : null}
                                                    </Table.Td>
                                                </Table.Tr>
                                            )
                                        })}
                                    </Table.Tbody>
                                </Table>
                            </ScrollArea>
                        </Card>

                        {status.jobs.length > 0 && (
                            <Card withBorder>
                                <Text fw={600} mb="sm">
                                    {' '}
                                    {ui('operations')}{' '}
                                </Text>
                                <Stack gap="xs">
                                    {status.jobs.map((job) => (
                                        <Group justify="space-between" key={job.id}>
                                            <Text size="sm">
                                                {job.title}:{' '}
                                                {job.status === 'done'
                                                    ? ui('completed')
                                                    : job.status === 'failed'
                                                      ? ui('failed')
                                                      : ui('running-3')}
                                            </Text>
                                            <Button
                                                size="xs"
                                                variant="light"
                                                onClick={() => setActiveJob(job.id)}
                                            >
                                                {' '}
                                                {ui('view-progress')}{' '}
                                            </Button>
                                        </Group>
                                    ))}
                                </Stack>
                            </Card>
                        )}
                        {Object.keys(status.inventory).length > 0 && (
                            <Card withBorder>
                                <Text fw={600} mb="sm">
                                    {' '}
                                    {ui('nodes-added-from-the-panel')}{' '}
                                </Text>
                                <Table verticalSpacing="xs">
                                    <Table.Tbody>
                                        {Object.entries(status.inventory).map(([name, n]) => (
                                            <Table.Tr key={name}>
                                                <Table.Td>
                                                    <b>{name}</b>
                                                </Table.Td>
                                                <Table.Td>
                                                    {n.role === 'entry'
                                                        ? ui('entry')
                                                        : ui('exit-2')}
                                                </Table.Td>
                                                <Table.Td>{n.host}</Table.Td>
                                                <Table.Td>{n.overlay}</Table.Td>
                                                <Table.Td>{n.rw_node ?? '—'}</Table.Td>
                                                <Table.Td>
                                                    <Tooltip label={ui('remove-from-mesh-2')}>
                                                        <ActionIcon
                                                            aria-label={i18next.t(
                                                                'mesh.removeTitle',
                                                                { name }
                                                            )}
                                                            disabled={
                                                                !editable ||
                                                                remove.isPending ||
                                                                status.quorum.members.some(
                                                                    (member) => member.name === name
                                                                )
                                                            }
                                                            color="red"
                                                            onClick={() => confirmRemove(name)}
                                                            variant="subtle"
                                                        >
                                                            <TbTrash size={16} />
                                                        </ActionIcon>
                                                    </Tooltip>
                                                </Table.Td>
                                            </Table.Tr>
                                        ))}
                                    </Table.Tbody>
                                </Table>
                                {removeJob && <RemoveJobWatcher id={removeJob} />}
                            </Card>
                        )}

                        <Card withBorder>
                            <Text fw={600} mb="sm">
                                {' '}
                                {ui('node-overlay')}{' '}
                                <Text c="dimmed" component="span" size="xs">
                                    {' '}
                                    {ui(
                                        'rows-observe-columns-via-x-means-traffic-uses-a-transit'
                                    )}{' '}
                                </Text>
                            </Text>
                            <ScrollArea>
                                <Table verticalSpacing="xs" withColumnBorders>
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Th> {ui('from-to')} </Table.Th>
                                            {names.map((n) => (
                                                <Table.Th key={n}>{n}</Table.Th>
                                            ))}
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {names.map((a) => (
                                            <Table.Tr key={a}>
                                                <Table.Th>{a}</Table.Th>
                                                {names.map((b) => {
                                                    if (a === b)
                                                        return <Table.Td key={b}>·</Table.Td>
                                                    const link = status.overlay.obs[a]?.[b]
                                                    const via = status.overlay.route[a]?.[b]
                                                    if (!link) {
                                                        return (
                                                            <Table.Td key={b}>
                                                                <Text c="dimmed" size="xs">
                                                                    ?
                                                                </Text>
                                                            </Table.Td>
                                                        )
                                                    }
                                                    return (
                                                        <Table.Td key={b}>
                                                            <Text
                                                                c={link.ok ? 'teal' : 'red'}
                                                                size="xs"
                                                            >
                                                                {link.ok
                                                                    ? link.rtt != null
                                                                        ? `${Math.round(link.rtt)} ${ui('ms')}`
                                                                        : 'ok'
                                                                    : 'down'}
                                                                {link.loss
                                                                    ? ` · ${ui('loss')} ${Math.round(link.loss * 100)}%`
                                                                    : ''}
                                                                {via ? ` ${ui('via')} ${via}` : ''}
                                                            </Text>
                                                        </Table.Td>
                                                    )
                                                })}
                                            </Table.Tr>
                                        ))}
                                    </Table.Tbody>
                                </Table>
                            </ScrollArea>
                        </Card>

                        <Card withBorder>
                            <Group justify="space-between" mb="xs">
                                <Text fw={600}> {ui('decisions-and-events')} </Text>
                                <Text c="dimmed" size="xs">
                                    {' '}
                                    {ui(
                                        'stored-in-etcd-for-one-week-surviving-controller-restar'
                                    )}{' '}
                                </Text>
                            </Group>
                            <Chip.Group multiple onChange={setKinds} value={kinds}>
                                <Group gap={6} mb="sm">
                                    {Object.entries(KIND_LABEL)
                                        .filter(([k]) => k !== 'info')
                                        .map(([k, v]) => (
                                            <Chip color={v.color} key={k} size="xs" value={k}>
                                                {v.label}
                                            </Chip>
                                        ))}
                                </Group>
                            </Chip.Group>
                            {status.events.filter(
                                (ev) => ev.kind === 'info' || kinds.includes(ev.kind)
                            ).length === 0 ? (
                                <Text c="dimmed" size="sm">
                                    {' '}
                                    {ui('no-events-yet')}{' '}
                                </Text>
                            ) : (
                                <Stack gap={6}>
                                    {status.events
                                        .filter(
                                            (ev) => ev.kind === 'info' || kinds.includes(ev.kind)
                                        )
                                        .slice(0, 60)
                                        .map((ev, i) => {
                                            const k = KIND_LABEL[ev.kind] ?? KIND_LABEL.info
                                            return (
                                                <Group
                                                    align="flex-start"
                                                    gap="xs"
                                                    key={`${ev.t}-${i}`}
                                                    wrap="nowrap"
                                                >
                                                    <Text
                                                        c="dimmed"
                                                        size="xs"
                                                        style={{ minWidth: 120 }}
                                                    >
                                                        {ev.t}
                                                    </Text>
                                                    <Badge
                                                        color={k.color}
                                                        size="sm"
                                                        style={{ minWidth: 110 }}
                                                        variant="light"
                                                    >
                                                        {k.label}
                                                    </Badge>
                                                    <Text size="sm">{ev.msg}</Text>
                                                </Group>
                                            )
                                        })}
                                </Stack>
                            )}
                        </Card>
                        <Card withBorder>
                            <Text fw={600}>{ui('removeEntireMesh')}</Text>
                            <Text size="sm" c="dimmed" my="sm">
                                {ui('teardownExplanation')}
                            </Text>
                            <Button
                                color="red"
                                variant="light"
                                disabled={
                                    !status.capabilities.node_management ||
                                    status.control_plane.mode === 'removed'
                                }
                                onClick={teardownCtl.open}
                            >
                                {ui('removeEntireMesh')}
                            </Button>
                        </Card>
                    </>
                )}
            </Stack>
        </Page>
    )
}
