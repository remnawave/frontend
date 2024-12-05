import { z } from 'zod'

import { EnhancedMutationParams } from './enhanced-mutations-params.interface'

/**
 * Arguments for creating a PATCH mutation hook with Zod validation
 * @template ResponseSchema - Zod schema for validating response data
 * @template RequestQuerySchema - Zod schema for validating query parameters
 * @template RouteParamsSchema - Zod schema for validating route parameters
 */
export interface CreatePatchMutationHookArgs<
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

    /** React Query mutation parameters and callbacks */
    rMutationParams?: EnhancedMutationParams<
        z.infer<ResponseSchema>['response'],
        Error,
        z.infer<RouteParamsSchema>
    >

    /** Route parameters to substitute in endpoint URL */
    routeParams?: z.infer<RouteParamsSchema>

    /** Schema for validating route parameters */
    routeParamsSchema?: RouteParamsSchema
}
