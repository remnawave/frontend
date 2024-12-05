import dayjs from 'dayjs'

export function getExpirationTextUtil(expireAt: Date | null | string): string {
    if (!expireAt) {
        return 'Unknown'
    }

    const expiration = dayjs(expireAt)
    const now = dayjs()

    if (expiration.isBefore(now)) {
        return `Expired ${expiration.fromNow(false)}`
    }

    return `Expires in ${expiration.fromNow(true)}`
}
