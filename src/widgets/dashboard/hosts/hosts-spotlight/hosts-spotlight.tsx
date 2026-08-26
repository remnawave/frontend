import { Group, Stack, Text, ThemeIcon } from '@mantine/core'
import { GetHostsCommand, GetConfigProfilesCommand } from '@remnawave/backend-contract'
import { PiProhibit, PiPulse } from 'react-icons/pi'
import { TbEyeOff } from 'react-icons/tb'

import { showModal } from '@shared/_modals/show-modal'
import { XrayLogo } from '@shared/ui/logos'
import { UniversalSpotlightContentShared } from '@shared/ui/universal-spotlight'

interface IProps {
    configProfiles: GetConfigProfilesCommand.Response['response']['configProfiles']
    hosts: GetHostsCommand.Response['response']
}

export const HostsSpotlightWidget = (props: IProps) => {
    const { configProfiles, hosts } = props

    const handleViewHost = (hostUuid: string) => {
        showModal('hosts_editHostDrawer', {
            hostUuid: hosts.find((host) => host.uuid === hostUuid)!.uuid
        })
    }

    const getHostIcon = (isDisabled: boolean, isHidden: boolean) => {
        if (isDisabled) {
            return (
                <ThemeIcon color="gray" size="lg" style={{ flexShrink: 0 }} variant="soft">
                    <PiProhibit size={20} />
                </ThemeIcon>
            )
        }
        if (!isDisabled && isHidden) {
            return (
                <ThemeIcon color="violet" size="lg" style={{ flexShrink: 0 }} variant="soft">
                    <TbEyeOff size={20} />
                </ThemeIcon>
            )
        }
        if (!isDisabled && !isHidden) {
            return (
                <ThemeIcon color="teal" size="lg" style={{ flexShrink: 0 }} variant="soft">
                    <PiPulse size={20} />
                </ThemeIcon>
            )
        }
        return null
    }

    const profileMap = new Map(configProfiles.map((p) => [p.uuid, p]))

    const actions = hosts.map((host) => {
        const profile = host.inbound.configProfileUuid
            ? profileMap.get(host.inbound.configProfileUuid)
            : null
        const inbound = profile?.inbounds.find(
            (i) => i.uuid === host.inbound.configProfileInboundUuid
        )

        const meta = [profile?.name, inbound?.tag].filter(Boolean).join('  ·  ')

        return {
            id: host.uuid,
            label: host.remark,
            keywords: [host.address, host.uuid, meta, host.uuid],
            onClick: () => handleViewHost(host.uuid),

            children: (
                <Group gap="sm" justify="space-between" w="100%" wrap="nowrap">
                    <Group gap="sm" style={{ minWidth: 0 }} wrap="nowrap">
                        {getHostIcon(host.isDisabled, host.isHidden)}
                        <Stack gap={1} style={{ minWidth: 0 }}>
                            <Text fw={500} size="sm">
                                {host.remark}
                            </Text>
                            <Text c="dimmed" size="xs">
                                {host.address} · {host.uuid}
                            </Text>
                            {meta && (
                                <Text c="dimmed" size="xs" truncate>
                                    {meta}
                                </Text>
                            )}
                        </Stack>
                    </Group>

                    {host.xrayJsonTemplateUuid && (
                        <ThemeIcon color="teal" size="lg" style={{ flexShrink: 0 }} variant="soft">
                            <XrayLogo size={20} />
                        </ThemeIcon>
                    )}
                </Group>
            )
        }
    })

    return <UniversalSpotlightContentShared actions={actions} />
}
