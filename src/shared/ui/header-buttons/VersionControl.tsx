import { Group, Text } from '@mantine/core'
import { useMemo, useState } from 'react'
import semver from 'semver'
import clsx from 'clsx'

import { getBuildInfo } from '@shared/utils/get-build-info/get-build-info.util'
import { useRemnawaveInfo } from '@entities/dashboard/updates-store'

import { BuildInfoModal } from '../sidebar/build-info-modal'
import { GameModalShared } from '../sidebar/game-modal'
import packageJson from '../../../../package.json'
import classes from './VersionControl.module.css'
import { HeaderControl } from './HeaderControl'
import { Logo } from '../logo'

export function VersionControl() {
    const [buildInfoModalOpened, setBuildInfoModalOpened] = useState(false)

    const buildInfo = useMemo(() => getBuildInfo(), [])
    const isDev = buildInfo.branch === 'dev'

    const remnawaveInfo = useRemnawaveInfo()

    const isNewVersionAvailable = useMemo(() => {
        const currentVersion = buildInfo.tag ?? '0.0.0'
        const latest = remnawaveInfo.latestVersion || '0.0.0'
        return semver.gt(latest, currentVersion)
    }, [remnawaveInfo.latestVersion, buildInfo.tag])

    return (
        <>
            <HeaderControl
                className={clsx(classes.version, {
                    [classes.newVersion]: isNewVersionAvailable && !isDev
                })}
                onClick={() => setBuildInfoModalOpened(true)}
                w="auto"
            >
                <Group gap={8} ml={10} mr={10} wrap="nowrap">
                    <Logo color={isNewVersionAvailable && !isDev ? 'cyan' : undefined} size={20} />
                    <Text
                        c={isNewVersionAvailable && !isDev ? 'cyan' : undefined}
                        ff="text"
                        fw={600}
                        size="sm"
                    >
                        {isDev ? 'dev' : packageJson.version}
                    </Text>
                </Group>
            </HeaderControl>

            <BuildInfoModal
                buildInfo={buildInfo}
                isNewVersionAvailable={isNewVersionAvailable}
                onClose={() => setBuildInfoModalOpened(false)}
                opened={buildInfoModalOpened}
            />

            <GameModalShared />
        </>
    )
}
