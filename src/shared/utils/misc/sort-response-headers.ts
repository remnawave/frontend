const PRIORITY_RESPONSE_HEADERS = [
    'profile-title',
    'profile-web-page-url',
    'profile-update-interval',
    'support-url',
    'routing',
    'announce'
]

export function sortResponseHeadersByPriority<T extends { key: string }>(headers: T[]): T[] {
    const priorityIndex = (key: string) => {
        const index = PRIORITY_RESPONSE_HEADERS.indexOf(key.trim().toLowerCase())
        return index === -1 ? Number.MAX_SAFE_INTEGER : index
    }

    return [...headers].sort((a, b) => {
        const diff = priorityIndex(a.key) - priorityIndex(b.key)
        if (diff !== 0) return diff
        return a.key.localeCompare(b.key)
    })
}
