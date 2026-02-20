import { GetAllHostsCommand, GetConfigProfilesCommand } from '@remnawave/backend-contract'
import { Group, Stack, Text, ThemeIcon } from '@mantine/core'
import { PiProhibit, PiPulse } from 'react-icons/pi'
import { TbEyeOff } from 'react-icons/tb'

import { MODALS, useModalsStoreOpenWithData } from '@entities/dashboard/modal-store'
import { UniversalSpotlightContentShared } from '@shared/ui/universal-spotlight'
import { XrayLogo } from '@shared/ui/logos'

interface IProps {
    configProfiles: GetConfigProfilesCommand.Response['response']['configProfiles']
    hosts: GetAllHostsCommand.Response['response']
}

export const HostsSpotlightWidget = (props: IProps) => {
    const { configProfiles, hosts } = props

    const openModalWithData = useModalsStoreOpenWithData()

    const handleViewHost = (hostUuid: string) => {
        openModalWithData(MODALS.EDIT_HOST_MODAL, hosts.find((host) => host.uuid === hostUuid)!)
    }

    const getHostIcon = (isDisabled: boolean, isHidden: boolean) => {
        if (isDisabled) {
            return (
                <ThemeIcon size="lg" style={{ flexShrink: 0 }} variant="gradient-gray">
                    <PiProhibit size={20} />
                </ThemeIcon>
            )
        }
        if (!isDisabled && isHidden) {
            return (
                <ThemeIcon size="lg" style={{ flexShrink: 0 }} variant="gradient-violet">
                    <TbEyeOff size={20} />
                </ThemeIcon>
            )
        }
        if (!isDisabled && !isHidden) {
            return (
                <ThemeIcon size="lg" style={{ flexShrink: 0 }} variant="gradient-teal">
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
                        <ThemeIcon
                            color="teal"
                            size="lg"
                            style={{ flexShrink: 0 }}
                            variant="gradient-teal"
                        >
                            <XrayLogo size={20} />
                        </ThemeIcon>
                    )}
                </Group>
            )
        }
    })

    return <UniversalSpotlightContentShared actions={actions} />
}
