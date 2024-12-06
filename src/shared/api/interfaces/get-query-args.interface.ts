import { QueryKey, UndefinedInitialDataOptions } from '@tanstack/react-query'
import { z } from 'zod'

/**
 * Arguments for creating a GET query hook with Zod validation
 * @template ResponseSchema - Zod schema for validating response data
 * @template RequestQuerySchema - Zod schema for validating query parameters
 * @template RouteParamsSchema - Zod schema for validating route parameters
 */
export interface CreateGetQueryHookArgs<
    ResponseSchema extends z.ZodType,
    RequestQuerySchema extends z.ZodType,
    RouteParamsSchema extends z.ZodType
> {
    /** API endpoint URL, can include route parameters (e.g. /api/users/:id) */
    endpoint: string

    /** Custom error handler function */
    errorHandler?: (error: unknown) => void

    /** Query parameters to include in request URL */
    queryParams?: z.infer<RequestQuerySchema>

    /** Schema for validating query parameters */
    requestQuerySchema?: RequestQuerySchema

    /** Schema for validating and parsing API response */
    responseSchema: ResponseSchema

    /** Route parameters to substitute in endpoint URL */
    routeParams?: z.infer<RouteParamsSchema>

    /** Schema for validating route parameters */
    routeParamsSchema?: RouteParamsSchema

    /**
     * React Query options configuration
     * @param queryKey - Unique key for identifying this query
     * @param staleTime - Time in ms after which data is considered stale
     * @param refetchInterval - Time in ms between automatic background refetches
     * @param enabled - Whether this query should automatically run
     * And other React Query options excluding queryFn and queryKey
     */
    rQueryParams: Omit<UndefinedInitialDataOptions, 'queryFn' | 'queryKey'> & {
        queryKey: QueryKey
    }
}
