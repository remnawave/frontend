import { TFunction } from 'i18next'
import dayjs from 'dayjs'

export function getTimeAgoUtil(
    dateStr: Date | null | string,
    t: TFunction,
    language: string
): string {
    if (!dateStr) return t('get-time-ago.util.not-connected-yet')

    const date = dayjs(dateStr).locale(language)
    if (!date.isValid()) return t('get-time-ago.util.invalid-date')

    return date.fromNow()
}
