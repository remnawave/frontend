/**
 * Create a URL with query parameters and route parameters
 *
 * @param base - The base URL with route parameters
 * @param queryParams - The query parameters
 * @param routeParams - The route parameters
 * @returns The URL with query parameters
 * @example
 * createUrl('/api/users/:id', { page: 1 }, { id: 1 });
 * // => '/api/users/1?page=1'
 */
export function createUrl(
    base: string,
    queryParams?: Record<string, number | string | undefined>,
    routeParams?: Record<string, number | string | undefined>
) {
    const url = Object.entries(routeParams ?? {}).reduce(
        (acc, [key, value]) => acc.replaceAll(`:${key}`, String(value)),
        base
    )

    if (!queryParams) return url

    const query = new URLSearchParams()

    Object.entries(queryParams).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') return
        query.append(key, String(value))
    })

    return `${url}?${query.toString()}`
}
