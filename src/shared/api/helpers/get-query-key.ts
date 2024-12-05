import { QueryKey } from '../types'

export function getQueryKey(
    queryKey: QueryKey,
    route: Record<string, number | string | undefined> = {},
    query: Record<string, number | string | undefined> = {}
) {
    const [mainKey, otherKeys = {}] = queryKey

    return [mainKey, { ...otherKeys, ...route, ...query }]
}
