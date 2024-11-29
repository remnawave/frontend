import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.extend(duration)
dayjs.extend(timezone)

export * from './get-time-ago/get-time-ago.util'
export * from './get-expiration-text/get-expiration-text.util'
export * from './get-connection-status-color/get-connection-status-color.util'
export * from './get-user-timezone/get-user-timezone.util'
