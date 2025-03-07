/* eslint-disable no-nested-ternary */
/* eslint-disable indent */
import dayjs from 'dayjs'

export function getXrayUptimeUtil(uptimeInSeconds: string): string {
    const totalSeconds = parseInt(uptimeInSeconds, 10)

    const duration = dayjs.duration(totalSeconds, 'seconds')

    return duration.humanize(false)
}
