import { Group, Text } from '@mantine/core'
import { modals } from '@mantine/modals'
import { useMemo } from 'react'
import semver from 'semver'
import clsx from 'clsx'

import { useRemnawaveInfo } from '@entities/dashboard/updates-store'
import { useGetRemnawaveMetadata } from '@shared/api/hooks'

import { BaseOverlayHeader } from '../overlays/base-overlay-header'
import { SkeletonHeaderControl } from './SkeletonHeaderControl'
import { BuildInfoModal } from '../sidebar/build-info-modal'
import classes from './VersionControl.module.css'
import { HeaderControl } from './HeaderControl'
import { Logo } from '../logo'

export function VersionControl() {
    const remnawaveInfo = useRemnawaveInfo()
    const { data: remnawaveMetadata, isLoading } = useGetRemnawaveMetadata()

    const [isNewVersionAvailable, isDev] = useMemo(() => {
        if (!remnawaveMetadata) return [false, false]

        const currentVersion = remnawaveMetadata.version
        const latest = remnawaveInfo.latestVersion || '0.0.0'
        return [semver.gt(latest, currentVersion), remnawaveMetadata.git.backend.branch === 'dev']
    }, [remnawaveInfo.latestVersion, remnawaveMetadata])

    if (isLoading || !remnawaveMetadata) {
        return <SkeletonHeaderControl width={85} />
    }

    const handleClick = () => {
        modals.open({
            title: (
                <BaseOverlayHeader
                    IconComponent={Logo}
                    iconVariant="gradient-teal"
                    title="Build Info"
                />
            ),
            centered: true,
            size: 'md',
            withCloseButton: true,
            children: (
                <BuildInfoModal
                    isNewVersionAvailable={isNewVersionAvailable}
                    remnawaveMetadata={remnawaveMetadata}
                />
            )
        })
    }

    return (
        <HeaderControl
            className={clsx(classes.version, {
                [classes.newVersion]: isNewVersionAvailable && !isDev,
                [classes.dev]: isDev
            })}
            onClick={handleClick}
            w="auto"
        >
            <Group gap={8} ml={10} mr={10} wrap="nowrap">
                <Logo size={20} />
                <Text ff="text" fw={600} size="sm">
                    {remnawaveMetadata.version}
                </Text>
            </Group>
        </HeaderControl>
    )
}
