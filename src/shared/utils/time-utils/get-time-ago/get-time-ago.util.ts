import dayjs from 'dayjs'

export function getTimeAgoUtil(dateStr: Date | null | string): string {
    if (!dateStr) return 'Not connected yet'

    const date = dayjs(dateStr)
    if (!date.isValid()) return 'Invalid Date'

    return date.fromNow()
}
