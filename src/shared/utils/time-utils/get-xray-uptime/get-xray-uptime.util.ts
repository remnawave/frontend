import { i18n } from 'i18next'
import dayjs from 'dayjs'

export function getXrayUptimeUtil(uptimeInSeconds: string, i18n: i18n): null | string {
    const totalSeconds = parseInt(uptimeInSeconds, 10)

    const duration = dayjs.duration(totalSeconds, 'seconds')

    return duration.locale(i18n.language).humanize(false)
}
