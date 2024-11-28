import dayjs from 'dayjs'

export const getConnectionStatusColorUtil = (onlineAt: string | null | Date): string => {
    if (!onlineAt) {
        return 'var(--mantine-color-yellow-5)'
    }

    const lastSeen = dayjs.utc(onlineAt)
    const now = dayjs.utc()
    const diffInSeconds = now.diff(lastSeen, 'second')

    if (diffInSeconds <= 60) {
        return 'var(--mantine-color-teal-5)'
    }

    return 'var(--mantine-color-red-5)'
}
