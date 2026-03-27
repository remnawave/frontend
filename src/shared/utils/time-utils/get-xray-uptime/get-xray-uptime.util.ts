import relativeTime from 'dayjs/plugin/relativeTime'
import duration from 'dayjs/plugin/duration'
import dayjs from 'dayjs'

dayjs.extend(duration)
dayjs.extend(relativeTime)

export function getXrayUptimeUtil(uptimeInSeconds: number): string {
    const duration = dayjs.duration(uptimeInSeconds, 'seconds')

    if (duration.asDays() >= 1) {
        return `${duration.asDays().toFixed(0)}d`
    }

    if (duration.asHours() >= 1) {
        return `${duration.asHours().toFixed(0)}h`
    }

    if (duration.asMinutes() >= 1) {
        return `${duration.asMinutes().toFixed(0)}m`
    }

    if (duration.asSeconds() >= 1) {
        return `${duration.asSeconds().toFixed(0)}s`
    }

    return '0s'
}

export function formatDurationUtil(uptimeInSeconds: number): string {
    const d = dayjs.duration(uptimeInSeconds, 'seconds')
    const totalDays = Math.floor(d.asDays())
    return `${totalDays}d ${d.hours()}h ${d.minutes()}m ${d.seconds()}s`
}
