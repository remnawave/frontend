/* eslint-disable perfectionist/sort-interfaces */

import { z } from 'zod'

import { EnhancedMutationParams } from './enhanced-mutations-params.interface'

export interface CreateMutationHookArgs<
    RouteParamsSchema extends z.ZodType,
    RequestQuerySchema extends z.ZodType,
    BodySchema extends z.ZodType,
    ResponseSchema extends z.ZodType
> {
    /** The endpoint for the POST request */
    endpoint: string

    /** The HTTP method to use for the request */
    requestMethod: 'delete' | 'get' | 'patch' | 'post' | 'put'

    /** Route parameters to substitute in endpoint URL */
    routeParams?: z.infer<RouteParamsSchema>

    /** Schema for validating route parameters */
    routeParamsSchema?: RouteParamsSchema

    /** Query parameters to include in request URL */
    queryParams?: z.infer<RequestQuerySchema>

    /** Schema for validating query parameters */
    requestQuerySchema?: RequestQuerySchema

    /** The Zod schema for the request body */
    bodySchema?: BodySchema

    /** The Zod schema for the response data */
    responseSchema: ResponseSchema

    /** The mutation parameters for the react-query hook */
    rMutationParams?: EnhancedMutationParams<
        z.infer<ResponseSchema>['response'],
        Error,
        z.infer<BodySchema>,
        z.infer<RouteParamsSchema>
    >

    /** Custom error handler function */
    errorHandler?: (error: unknown) => void
}
