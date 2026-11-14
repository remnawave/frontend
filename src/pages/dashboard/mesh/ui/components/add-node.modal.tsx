import {
    Alert,
    Button,
    Checkbox,
    Group,
    Modal,
    PasswordInput,
    SegmentedControl,
    Select,
    Stack,
    Text,
    Textarea,
    TextInput
} from '@mantine/core'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useAddMeshNode } from '@shared/api/hooks'

const empty = {
    name: '',
    host: '',
    user: 'root',
    role: 'exit',
    rw: '',
    password: '',
    privateKey: '',
    fingerprint: ''
}
const ipv4 = (value: string) =>
    /^(\d{1,3}\.){3}\d{1,3}$/.test(value) && value.split('.').every((part) => Number(part) <= 255)

export function AddNodeModal({
    opened,
    onClose,
    onAccepted,
    canJoinEtcd
}: {
    opened: boolean
    onClose: () => void
    onAccepted: (id: string) => void
    canJoinEtcd: boolean
}) {
    const { t } = useTranslation(undefined, { keyPrefix: 'mesh' })
    const [form, setForm] = useState(empty)
    const [auth, setAuth] = useState<'password' | 'key'>('password')
    const [etcd, setEtcd] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const add = useAddMeshNode()
    const update = (key: keyof typeof empty, value: string) =>
        setForm((current) => ({ ...current, [key]: value }))
    const valid =
        /^[a-z][a-z0-9]{1,7}$/.test(form.name) &&
        ipv4(form.host.trim()) &&
        /^[a-z_][a-z0-9_-]{0,31}$/.test(form.user) &&
        /^SHA256:[A-Za-z0-9+/]{43}$/.test(form.fingerprint.trim()) &&
        (auth === 'password' ? form.password.length > 0 : form.privateKey.trim().length > 0)
    const reset = () => {
        setForm(empty)
        setEtcd(false)
        setSubmitted(false)
        setAuth('password')
        add.reset()
    }
    const close = () => {
        if (!add.isPending) {
            reset()
            onClose()
        }
    }
    const submit = () => {
        setSubmitted(true)
        if (!valid) return
        add.mutate(
            {
                name: form.name,
                host: form.host.trim(),
                user: form.user,
                role: form.role as 'entry' | 'exit',
                rw_node: form.rw.trim() || undefined,
                etcd: canJoinEtcd && etcd,
                host_key_fingerprint: form.fingerprint.trim(),
                password: auth === 'password' ? form.password : undefined,
                private_key: auth === 'key' ? form.privateKey : undefined
            },
            {
                onSuccess: (result) => {
                    reset()
                    onClose()
                    onAccepted(result.job)
                },
                onSettled: () => {
                    setForm((current) => ({ ...current, password: '', privateKey: '' }))
                    add.reset()
                }
            }
        )
    }
    return (
        <Modal
            centered
            closeOnClickOutside={!add.isPending}
            closeOnEscape={!add.isPending}
            onClose={close}
            opened={opened}
            size="lg"
            title={t('add')}
            withCloseButton={!add.isPending}
        >
            <Stack
                component="form"
                gap="sm"
                onSubmit={(event) => {
                    event.preventDefault()
                    submit()
                }}
            >
                <Text c="dimmed" size="sm">
                    {t('onboardDescription')}
                </Text>
                <Group grow align="start">
                    <TextInput
                        autoComplete="off"
                        description={t('nameHint')}
                        label={t('name')}
                        required
                        maxLength={8}
                        onChange={(event) =>
                            update('name', event.currentTarget.value.toLowerCase())
                        }
                        value={form.name}
                    />
                    <TextInput
                        autoComplete="off"
                        label={t('address')}
                        required
                        onChange={(event) => update('host', event.currentTarget.value)}
                        value={form.host}
                    />
                </Group>
                <Group grow align="start">
                    <TextInput
                        autoComplete="off"
                        label={t('user')}
                        required
                        onChange={(event) => update('user', event.currentTarget.value)}
                        value={form.user}
                    />
                    <Select
                        allowDeselect={false}
                        label={t('role')}
                        value={form.role}
                        data={[
                            { value: 'exit', label: t('exit') },
                            { value: 'entry', label: t('entry') }
                        ]}
                        onChange={(value) => update('role', value ?? 'exit')}
                    />
                </Group>
                {form.role === 'exit' && (
                    <TextInput
                        label={t('rwNode')}
                        value={form.rw}
                        onChange={(event) => update('rw', event.currentTarget.value)}
                    />
                )}
                <TextInput
                    autoComplete="off"
                    description={t('fingerprintHint')}
                    label={t('fingerprint')}
                    placeholder="SHA256:…"
                    required
                    value={form.fingerprint}
                    onChange={(event) => update('fingerprint', event.currentTarget.value)}
                />
                <Checkbox
                    checked={etcd}
                    disabled={!canJoinEtcd}
                    description={!canJoinEtcd ? t('membershipBlocked') : undefined}
                    label={t('withEtcd')}
                    onChange={(event) => setEtcd(event.currentTarget.checked)}
                />
                <Text fw={500} size="sm" id="mesh-auth-method">
                    {t('authentication')}
                </Text>
                <SegmentedControl
                    aria-labelledby="mesh-auth-method"
                    value={auth}
                    data={[
                        { value: 'password', label: t('password') },
                        { value: 'key', label: t('privateKey') }
                    ]}
                    onChange={(value) => {
                        setAuth(value as 'password' | 'key')
                        setForm((current) => ({ ...current, password: '', privateKey: '' }))
                    }}
                />
                {auth === 'password' ? (
                    <PasswordInput
                        autoComplete="new-password"
                        label={t('password')}
                        required
                        value={form.password}
                        onChange={(event) => update('password', event.currentTarget.value)}
                    />
                ) : (
                    <Textarea
                        autoComplete="off"
                        spellCheck={false}
                        label={t('privateKey')}
                        minRows={4}
                        required
                        value={form.privateKey}
                        onChange={(event) => update('privateKey', event.currentTarget.value)}
                    />
                )}
                {submitted && !valid && <Alert color="red">{t('validation')}</Alert>}
                <Group justify="flex-end">
                    <Button disabled={add.isPending} onClick={close} variant="default">
                        {t('cancel')}
                    </Button>
                    <Button loading={add.isPending} type="submit">
                        {t('add')}
                    </Button>
                </Group>
            </Stack>
        </Modal>
    )
}
