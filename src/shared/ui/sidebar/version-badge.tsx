import { useQuery } from '@tanstack/react-query'
import { Badge, Indicator } from '@mantine/core'
import { useMemo, useState } from 'react'
import semver from 'semver'
import axios from 'axios'

import { getBuildInfo } from '@shared/utils/get-build-info/get-build-info.util'
import { sToMs } from '@shared/utils/time-utils/s-to-ms/s-to-ms.util'

import { BuildInfoModal } from './build-info-modal'
import packageJson from '../../../../package.json'
import { GameModalShared } from './game-modal'

export const VersionBadgeShared = () => {
    const [buildInfoModalOpened, setBuildInfoModalOpened] = useState(false)

    const buildInfo = useMemo(() => getBuildInfo(), [])
    const isDev = buildInfo.branch === 'dev'

    const { data: latestVersion } = useQuery({
        queryKey: ['github-latest-version'],
        staleTime: sToMs(3600),
        refetchInterval: sToMs(3600),
        queryFn: async () => {
            const response = await axios.get<{
                release: {
                    tag: string
                }
            }>('https://ungh.cc/repos/remnawave/panel/releases/latest')
            return response.data.release.tag
        }
    })

    const isNewVersionAvailable = useMemo(() => {
        const currentVersion = buildInfo.tag ?? '0.0.0'
        const latest = latestVersion ?? '0.0.0'
        return semver.gt(latest, currentVersion)
    }, [latestVersion, buildInfo.tag])

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
