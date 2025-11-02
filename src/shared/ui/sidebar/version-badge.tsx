import { Badge, Indicator } from '@mantine/core'
import { useMemo, useState } from 'react'
import semver from 'semver'

import { getBuildInfo } from '@shared/utils/get-build-info/get-build-info.util'
import { useRemnawaveInfo } from '@entities/dashboard/updates-store'

import { BuildInfoModal } from './build-info-modal'
import packageJson from '../../../../package.json'
import { GameModalShared } from './game-modal'
import classes from './sidebar.module.css'

export const VersionBadgeShared = () => {
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
            <Indicator
                color="cyan.6"
                disabled={!isNewVersionAvailable}
                offset={3}
                processing
                size={11}
            >
                <Badge
                    className={classes.fadeIn}
                    color={isDev ? 'red' : 'cyan'}
                    onClick={() => setBuildInfoModalOpened(true)}
                    radius="xl"
                    size="lg"
                    style={{ cursor: isDev ? 'help' : 'pointer' }}
                    variant="light"
                >
                    {isDev ? 'dev' : packageJson.version}
                </Badge>
            </Indicator>

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
