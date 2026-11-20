import { filterByTag } from '@shared/ui'

interface IFilterableHost {
    includeInSrrRules: string[]
    tags: string[]
}

export const getHostSrrRules = (host: IFilterableHost) => host.includeInSrrRules

export function filterHosts<T extends IFilterableHost>(
    hosts: T[],
    activeTag: null | string,
    activeSrrRule: null | string
): T[] {
    return filterByTag(filterByTag(hosts, activeTag), activeSrrRule, getHostSrrRules)
}
