import { z } from 'zod'

import { EnhancedMutationParams } from './enhanced-mutations-params.interface'

export interface CreatePutMutationHookArgs<
    BodySchema extends z.ZodType,
    ResponseSchema extends z.ZodType
> {
    /** The Zod schema for the request body */
    bodySchema: BodySchema
    /** The endpoint for the POST request */
    endpoint: string
    options?: { isMultipart?: boolean }
    /** The Zod schema for the response data */
    responseSchema: ResponseSchema
    /** The mutation parameters for the react-query hook */
    rMutationParams?: EnhancedMutationParams<
        z.infer<ResponseSchema>['response'],
        Error,
        z.infer<BodySchema>
    >
}
