/* eslint-disable perfectionist/sort-interfaces */

import { UndefinedInitialDataOptions } from '@tanstack/react-query'
import { z } from 'zod'

/**
 * Arguments for creating a query hook that issues a request with a body
 * (e.g. a POST endpoint that semantically performs a read). Mirrors
 * `CreateGetQueryHookArgs` but adds `requestMethod` and `bodySchema`,
 * and the request is made via `instance.request` instead of `instance.get`.
 *
 * @template ResponseSchema - Zod schema for validating response data
 * @template RequestQuerySchema - Zod schema for validating query parameters
 * @template RouteParamsSchema - Zod schema for validating route parameters
 * @template BodySchema - Zod schema for validating the request body
 */
export interface CreateBodyQueryHookArgs<
    ResponseSchema extends z.ZodType,
    RequestQuerySchema extends z.ZodType,
    RouteParamsSchema extends z.ZodType,
    BodySchema extends z.ZodType
> {
    /** API endpoint URL, can include route parameters (e.g. /api/users/:id) */
    endpoint: string

    /** HTTP method to use for the request */
    requestMethod: 'delete' | 'get' | 'patch' | 'post' | 'put'

    /** Zod schema for validating and parsing API response */
    responseSchema: ResponseSchema

    /** Zod schema for validating query parameters */
    requestQuerySchema?: RequestQuerySchema

    /** Default query parameters to include in every request */
    queryParams?: z.infer<RequestQuerySchema>

    /** Zod schema for validating route parameters */
    routeParamsSchema?: RouteParamsSchema

    /** Default route parameters to substitute in endpoint URL */
    routeParams?: z.infer<RouteParamsSchema>

    /** Zod schema for validating the request body */
    bodySchema?: BodySchema

    /** Custom error handler function */
    errorHandler?: (error: unknown) => void

    /** React Query options (excluding queryFn and queryKey) */
    rQueryParams?: Omit<UndefinedInitialDataOptions, 'queryFn' | 'queryKey'>
}
