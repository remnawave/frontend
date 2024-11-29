import dayjs from 'dayjs'

export const getUserTimezoneUtil = (): string => {
    return dayjs.tz.guess()
}
