import {
    PiAndroidLogo,
    PiAppleLogo,
    PiDeviceMobile,
    PiLinuxLogo,
    PiTrash,
    PiWindowsLogo
} from 'react-icons/pi'
import { ActionIcon, Divider, Group, Stack, Text, ThemeIcon } from '@mantine/core'
import { GetUserHwidDevicesCommand } from '@remnawave/backend-contract'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'

import { CopyableFieldShared } from '@shared/ui/copyable-field/copyable-field'
import { SettingsCardShared } from '@shared/ui/settings-card'

interface IProps {
    device: GetUserHwidDevicesCommand.Response['response']['devices'][number]
    index: number
    onDelete: (hwid: string) => void
}

export const UserHwidDeviceItem = (props: IProps) => {
    const { index, device, onDelete } = props

    const { t } = useTranslation()

    const resolvePlatform = (platform: null | string) => {
        if (!platform) return <PiDeviceMobile size={24} />
        switch (platform.toLowerCase()) {
            case 'android':
                return <PiAndroidLogo size={24} />
            case 'ios':
                return <PiAppleLogo size={24} />
            case 'linux':
                return <PiLinuxLogo size={24} />
            case 'macos':
                return <PiAppleLogo size={24} />
            case 'unknown':
                return <PiDeviceMobile size={24} />
            case 'windows':
                return <PiWindowsLogo size={24} />
            default:
                return <PiDeviceMobile size={24} />
        }
    }

    return (
        <SettingsCardShared.Container>
            <Group align="center" gap="xs" justify="space-between" wrap="nowrap">
                <Group align="center" gap="xs" wrap="nowrap">
                    <ThemeIcon color="indigo" size="lg" variant="light">
                        {resolvePlatform(device.platform)}
                    </ThemeIcon>
                    <Text fw={600} size="md">
                        #{index + 1}
                    </Text>
                </Group>

                <ActionIcon
                    aria-label={t('get-hwid-user-devices.feature.delete-device')}
                    color="red"
                    onClick={() => onDelete(device.hwid)}
                    size="lg"
                    variant="light"
                >
                    <PiTrash size="20px" />
                </ActionIcon>
            </Group>
            <Divider />
            <SettingsCardShared.Content>
                <Stack gap="xs">
                    <CopyableFieldShared label="HWID" size="sm" value={device.hwid} />

                    <Group gap="xs" grow>
                        <CopyableFieldShared
                            label={t('get-hwid-user-devices.feature.platform')}
                            size="sm"
                            value={device.platform || t('get-hwid-user-devices.feature.unknown')}
                        />

                        <CopyableFieldShared
                            label={t('get-hwid-user-devices.feature.os-version')}
                            size="sm"
                            value={device.osVersion || t('get-hwid-user-devices.feature.unknown')}
                        />
                    </Group>

                    <CopyableFieldShared
                        label={t('get-hwid-user-devices.feature.model')}
                        size="sm"
                        value={device.deviceModel || t('get-hwid-user-devices.feature.unknown')}
                    />

                    <CopyableFieldShared
                        label={t('get-hwid-user-devices.feature.user-agent')}
                        size="sm"
                        value={device.userAgent || t('get-hwid-user-devices.feature.unknown')}
                    />

                    <CopyableFieldShared
                        label={t('get-hwid-user-devices.feature.added')}
                        size="sm"
                        value={dayjs(device.createdAt).format('HH:mm DD MMMM, YYYY')}
                    />

                    <CopyableFieldShared
                        label="Updated"
                        size="sm"
                        value={dayjs(device.updatedAt).format('HH:mm DD MMMM, YYYY')}
                    />
                </Stack>
            </SettingsCardShared.Content>
        </SettingsCardShared.Container>
    )
}
