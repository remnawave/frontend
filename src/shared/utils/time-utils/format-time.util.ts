import dayjs from 'dayjs'

type TTemplatePreset = 'DD.MM.YYYY HH:mm:ss' | 'D MMM' | 'D MMMM YYYY'

export const formatTimeUtil = (
    time: null | number | string | undefined,
    template: TTemplatePreset
): string => {
    if (!time) return 'Unknown date'

    if (!dayjs(time).isValid()) return 'Unknown date'

    return dayjs(time).format(template)
}
