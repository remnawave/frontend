import {
    InfiniteData,
    QueryKey,
    useInfiniteQuery,
    UseInfiniteQueryResult
} from '@tanstack/react-query'
import { z } from 'zod'

import { instance } from '../axios'
import { createUrl, handleRequestError } from '../helpers'
import { CreateGetQueryHookArgs } from '../interfaces'

type QueryParams<R, Q> = {
    query?: Q
    route?: R
}

/** React Query options supported by the infinite query hook (managed keys excluded). */
type InfiniteRQueryParams = {
    enabled?: boolean
    gcTime?: number
    refetchInterval?: false | number
    refetchOnMount?: 'always' | boolean
    refetchOnWindowFocus?: 'always' | boolean
    staleTime?: number
}

/**
 * Cursor/offset-paginated sibling of {@link createGetQueryHook}. Builds a type-safe
 * `useInfiniteQuery` hook with Zod validation, injecting the current page param into
 * the request query under `pageParamKey`.
 *
 * @template ResponseSchema - Zod schema for validating API response (`{ response: ... }`)
 * @template RequestQuerySchema - Zod schema for validating query parameters
 * @template RouteParamsSchema - Zod schema for validating route parameters
 * @template TPageParam - Type of the pagination cursor (e.g. `string | null`, `number`)
 *
 * @param options.pageParamKey - Query-param name the page param is sent as (e.g. `'cursor'`)
 * @param options.initialPageParam - Page param for the first request (omitted from the URL when `null`/`undefined`)
 * @param options.getNextPageParam - Derives the next page param from the parsed response, or `null`/`undefined` to stop
 *
 * @example
 * ```typescript
 * const useGetThings = createGetInfiniteQueryHook({
 *   endpoint: GetThingsCommand.TSQ_url,
 *   responseSchema: GetThingsCommand.ResponseSchema,
 *   requestQuerySchema: GetThingsCommand.RequestQuerySchema,
 *   routeParamsSchema: GetThingsCommand.RequestParamSchema,
 *   getQueryKey: ({ route, query }) => thingsKeys.list({ ...route!, ...query! }).queryKey,
 *   pageParamKey: 'cursor',
 *   initialPageParam: null as string | null,
 *   getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.nextCursor : null),
 *   rQueryParams: { staleTime: 60_000 }
 * })
 * ```
 */
export function createGetInfiniteQueryHook<
    ResponseSchema extends z.ZodType<{ response: unknown }>,
    RequestQuerySchema extends z.ZodType<Record<string, unknown>>,
    RouteParamsSchema extends z.ZodType<Record<string, unknown>>,
    TPageParam
>({
    endpoint,
    responseSchema,
    requestQuerySchema,
    queryParams,
    routeParams,
    errorHandler,
    rQueryParams,
    getQueryKey,
    getNextPageParam,
    initialPageParam,
    pageParamKey
}: Omit<
    CreateGetQueryHookArgs<ResponseSchema, RequestQuerySchema, RouteParamsSchema>,
    'rQueryParams'
> & {
    getNextPageParam: (
        lastPage: z.infer<ResponseSchema>['response'],
        allPages: z.infer<ResponseSchema>['response'][]
    ) => null | TPageParam | undefined
    getQueryKey: (
        params: QueryParams<z.infer<RouteParamsSchema>, z.infer<RequestQuerySchema>>
    ) => QueryKey
    initialPageParam: TPageParam
    pageParamKey: string
    rQueryParams?: InfiniteRQueryParams
}) {
    type Response = z.infer<ResponseSchema>['response']

    const queryFn = async (
        pageParam: TPageParam,
        params?: {
            query?: z.infer<RequestQuerySchema>
            route?: z.infer<RouteParamsSchema>
        }
    ): Promise<Response> => {
        const pageQuery =
            pageParam === undefined || pageParam === null
                ? undefined
                : { [pageParamKey]: pageParam }

        const merged = { ...queryParams, ...params?.query, ...pageQuery }
        const validatedQuery = requestQuerySchema ? requestQuerySchema.parse(merged) : merged

        const url = createUrl(endpoint, validatedQuery, params?.route ?? routeParams)

        try {
            const response = await instance.get<z.infer<ResponseSchema>>(url)
            const result = await responseSchema.safeParseAsync(response.data)
            if (!result.success) {
                throw result.error
            }
            return result.data.response
        } catch (error) {
            if (errorHandler) {
                errorHandler(error)
            } else {
                handleRequestError(error)
            }
            throw error
        }
    }

    return (params?: {
        query?: z.infer<RequestQuerySchema>
        rQueryParams?: InfiniteRQueryParams
        route?: z.infer<RouteParamsSchema>
    }) =>
        useInfiniteQuery({
            ...rQueryParams,
            ...params?.rQueryParams,
            queryKey: getQueryKey({
                route: params?.route,
                query: params?.query
            }),
            queryFn: ({ pageParam }) => queryFn(pageParam as TPageParam, params),
            initialPageParam,
            getNextPageParam
        }) as UseInfiniteQueryResult<InfiniteData<Response, TPageParam>>
}
