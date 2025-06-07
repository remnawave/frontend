import relativeTime from 'dayjs/plugin/relativeTime'
import duration from 'dayjs/plugin/duration'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import 'dayjs/locale/fa'
import 'dayjs/locale/zh'

dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.extend(duration)
dayjs.extend(timezone)

export * from './get-connection-status-color/get-connection-status-color.util'
export * from './get-expiration-text/get-expiration-text.util'
export * from './get-node-reset-days/get-node-reset-days.util'
export * from './get-time-ago/get-time-ago.util'
export * from './get-user-timezone/get-user-timezone.util'
export * from './get-xray-uptime/get-xray-uptime.util'
export * from './s-to-ms/s-to-ms.util'
