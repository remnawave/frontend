/**
 * Create a URL with query parameters and route parameters
 *
 * @param base - The base URL with route parameters (e.g. '/api/users/:id')
 * @param queryParams - Optional query parameters as key-value pairs. Values can be numbers, strings, objects (will be JSON stringified), or undefined
 * @param routeParams - Optional route parameters as key-value pairs to replace placeholders in base URL
 * @returns The URL with route params replaced and query string appended (if any params provided)
 * @example
 * // Basic usage with route param
 * createUrl('/api/users/:id', undefined, { id: 1 })
 * // => '/api/users/1'
 *
 * @example
 * // With query params
 * createUrl('/api/users', { page: 1, limit: 10 })
 * // => '/api/users?page=1&limit=10'
 *
 * @example
 * // With both route and query params
 * createUrl('/api/users/:id/posts', { sort: 'desc' }, { id: 1 })
 * // => '/api/users/1/posts?sort=desc'
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

        if (value === 0) {
            query.append(key, '0')
            return
        }

        const processedValue = typeof value === 'object' ? JSON.stringify(value) : String(value)

        query.append(key, processedValue)
    })

    return `${url}?${query.toString()}`
}
