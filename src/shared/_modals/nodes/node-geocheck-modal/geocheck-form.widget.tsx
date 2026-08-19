import {
    Autocomplete,
    Button,
    Group,
    SegmentedControl,
    Stack,
    Text,
    TextInput,
    ThemeIcon
} from '@mantine/core'
import { GeocheckByNodeCommand, GetNodeCommand } from '@remnawave/backend-contract'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TbAffiliate, TbPlayerPlay, TbRoute, TbWorldSearch } from 'react-icons/tb'

import { NodeIpStatusIcon, resolveNodeIpStatusMeta } from '@shared/ui/node-ips'

type TSource = 'default' | 'interface' | 'ip'

interface IProps {
    node: GetNodeCommand.Response['response']
    onCancel: () => void
    onStart: (variables: GeocheckByNodeCommand.RequestBody) => void
}

export const GeocheckFormWidget = (props: IProps) => {
    const { node, onCancel, onStart } = props
    const { t } = useTranslation()

    const [source, setSource] = useState<TSource>('default')
    const [ip, setIp] = useState('')
    const [networkInterface, setNetworkInterface] = useState('')

    const ipOptions = useMemo(() => node.ips.map((item) => item.ip), [node.ips])
    const ipStatuses = useMemo(
        () => new Map(node.ips.map((item) => [item.ip, item.status])),
        [node.ips]
    )
    const interfaceOptions = useMemo(() => node.system?.info.networkInterfaces ?? [], [node.system])

    const value =
        source === 'ip' ? ip.trim() : source === 'interface' ? networkInterface.trim() : ''

    const selectedIpStatus = ipStatuses.get(ip.trim())
    const isDisabled = source !== 'default' && !value

    const handleStart = () => {
        if (source === 'ip') {
            onStart({ ip: value })
            return
        }

        if (source === 'interface') {
            onStart({ interface: value })
            return
        }

        onStart({})
    }

    return (
        <Stack gap="md">
            <SegmentedControl
                data={[
                    { value: 'default', label: t('node-geocheck.source-default') },
                    { value: 'ip', label: t('common.ip-address') },
                    { value: 'interface', label: t('common.interface') }
                ]}
                fullWidth
                onChange={(nextSource) => setSource(nextSource as TSource)}
                value={source}
            />

            {source === 'default' && (
                <TextInput
                    description={t('node-geocheck.default-description')}
                    disabled
                    label={t('node-geocheck.source-default')}
                    leftSection={<TbRoute size={18} />}
                    placeholder={t('node-geocheck.default-placeholder')}
                />
            )}

            {source === 'ip' && (
                <Autocomplete
                    data={ipOptions}
                    description={t('node-geocheck.ip-description')}
                    label={t('common.ip-address')}
                    leftSection={
                        selectedIpStatus ? (
                            <NodeIpStatusIcon size="sm" status={selectedIpStatus} />
                        ) : (
                            <TbWorldSearch size={18} />
                        )
                    }
                    onChange={setIp}
                    placeholder="1.2.3.4"
                    renderOption={({ option }) => {
                        const status = ipStatuses.get(option.value) ?? 'UNKNOWN'

                        return (
                            <Group gap="xs" w="100%" wrap="nowrap">
                                <NodeIpStatusIcon size="sm" status={status} />

                                <Text ff="monospace" size="sm">
                                    {option.value}
                                </Text>

                                <Text c="dimmed" ml="auto" size="xs">
                                    {t(resolveNodeIpStatusMeta(status).labelKey)}
                                </Text>
                            </Group>
                        )
                    }}
                    value={ip}
                />
            )}

            {source === 'interface' && (
                <Autocomplete
                    data={interfaceOptions}
                    description={t('node-geocheck.interface-description')}
                    label={t('common.interface')}
                    leftSection={<TbAffiliate size={18} />}
                    onChange={setNetworkInterface}
                    placeholder="eth0"
                    renderOption={({ option }) => (
                        <Group gap="xs" wrap="nowrap">
                            <ThemeIcon color="gray" radius="sm" size="sm" variant="soft">
                                <TbAffiliate size={14} />
                            </ThemeIcon>

                            <Text ff="monospace" size="sm">
                                {option.value}
                            </Text>
                        </Group>
                    )}
                    value={networkInterface}
                />
            )}

            <Group gap="sm" justify="flex-end">
                <Button onClick={onCancel} variant="subtle">
                    {t('common.cancel')}
                </Button>
                <Button
                    color="teal"
                    disabled={isDisabled}
                    leftSection={<TbPlayerPlay size={18} />}
                    onClick={handleStart}
                    variant="soft"
                >
                    {t('node-geocheck.run')}
                </Button>
            </Group>
        </Stack>
    )
}
