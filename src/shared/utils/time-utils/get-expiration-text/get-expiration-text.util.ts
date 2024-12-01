import dayjs from 'dayjs'

export function getExpirationTextUtil(expireAt: Date | string): string {
    const expiration = dayjs(expireAt)
    const now = dayjs()

    if (expiration.isBefore(now)) {
        return `Expired ${expiration.fromNow(false)}`
    }

    return `Expires in ${expiration.fromNow(true)}`
}
