/* eslint-disable no-use-before-define */
import {
    QueryClient,
    UndefinedInitialDataOptions,
    useMutation,
    UseMutationOptions,
    useQuery,
    useQueryClient,
    UseQueryResult
} from '@tanstack/react-query'
import consola from 'consola/browser'
import { isAxiosError } from 'axios'
import { z, ZodError } from 'zod'
import { useState } from 'react'

import { instance as client } from './axios'

export type PaginationParams = {
    limit?: number
    page?: number
}

interface CreateDeleteMutationHookArgs<
    TData = unknown,
    TError = Error,
    TVariables = void,
    TContext = unknown
> {
    /** The endpoint for the DELETE request */
    endpoint: string
    /** The mutation parameters for the react-query hook */
    rMutationParams?: EnhancedMutationParams<TData, TError, TVariables, TContext>
}

interface CreateGetQueryHookArgs<ResponseSchema extends z.ZodType> {
    /** The endpoint for the GET request */
    endpoint: string
    /** The Zod schema for the response data */
    responseSchema: ResponseSchema
    /** The query parameters for the react-query hook */
    rQueryParams: Omit<UndefinedInitialDataOptions, 'queryFn' | 'queryKey'> & {
        queryKey: QueryKey
    }
}

interface CreatePostMutationHookArgs<
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
    rMutationParams?: EnhancedMutationParams<z.infer<ResponseSchema>, Error, z.infer<BodySchema>>
}

interface CreatePutMutationHookArgs<
    BodySchema extends z.ZodType,
    ResponseSchema extends z.ZodType
> {
    /** The Zod schema for the request body */
    bodySchema: BodySchema
    /** The endpoint for the PUT request */
    endpoint: string
    options?: { isMultipart?: boolean }
    /** The Zod schema for the response data */
    responseSchema: ResponseSchema
    /** The mutation parameters for the react-query hook */
    rMutationParams?: EnhancedMutationParams<z.infer<ResponseSchema>, Error, z.infer<BodySchema>>
}

/* ----------------------------------- GET ---------------------------------- */

interface EnhancedMutationParams<
    TData = unknown,
    TError = Error,
    TVariables = void,
    TContext = unknown
> extends Omit<
        UseMutationOptions<TData, TError, TVariables, TContext>,
        'mutationFn' | 'onError' | 'onSettled' | 'onSuccess'
    > {
    onError?: (
        error: TError,
        variables: TVariables,
        context: TContext | undefined,
        queryClient: QueryClient
    ) => unknown
    onSettled?: (
        data: TData | undefined,
        error: null | TError,
        variables: TVariables,
        context: TContext | undefined,
        queryClient: QueryClient
    ) => unknown
    onSuccess?: (
        data: TData,
        variables: TVariables,
        context: TContext,
        queryClient: QueryClient
    ) => unknown
}

type QueryKey = [string, Record<string, number | string | undefined>] | [string]

/* ---------------------------------- POST ---------------------------------- */

/**
 * Create a custom hook for performing DELETE requests with react-query
 *
 * @example
 * const useDeleteUser = createDeleteMutationHook<typeof userSchema, { id: string }>({
 *  endpoint: '/api/users/:id',
 *  rMutationParams: { onSuccess: () => queryClient.invalidateQueries('getUsers') },
 * });
 */
export function createDeleteMutationHook<
    ModelSchema extends z.ZodType,
    RouteParams extends Record<string, number | string | undefined> = {},
    QueryParams extends Record<string, number | string | undefined> = {}
>({
    endpoint,
    rMutationParams
}: CreateDeleteMutationHookArgs<z.infer<ModelSchema>, Error, z.infer<ModelSchema>>) {
    return (params?: { query?: QueryParams; route?: RouteParams }) => {
        const queryClient = useQueryClient()
        const baseUrl = createUrl(endpoint, params?.query, params?.route)

        const mutationFn = async ({
            model,
            route,
            query
        }: {
            model: z.infer<ModelSchema>
            query?: QueryParams
            route?: RouteParams
        }) => {
            const url = createUrl(baseUrl, query, route)
            return client
                .delete(url)
                .then(() => model)
                .catch(handleRequestError)
        }

        return useMutation({
            ...rMutationParams,
            mutationFn,
            onSuccess: (data, variables, context) =>
                rMutationParams?.onSuccess?.(data, variables, context, queryClient),
            onError: (error, variables, context) =>
                rMutationParams?.onError?.(error, variables, context, queryClient),
            onSettled: (data, error, variables, context) =>
                rMutationParams?.onSettled?.(data, error, variables, context, queryClient)
        })
    }
}

/**
 * Create a custom hook for performing GET requests with react-query and Zod validation
 *
 * @example
 * const useGetUser = createGetQueryHook<typeof userSchema, { id: string }>({
 *   endpoint: '/api/users/:id',
 *   responseSchema: userSchema,
 *   rQueryParams: { queryKey: ['getUser'] },
 * });
 *
 * const { data, error } = useGetUser({ route: { id: 1 } });
 */
export function createGetQueryHook<
    ResponseSchema extends z.ZodType,
    RouteParams extends Record<string, number | string | undefined> = {},
    QueryParams extends Record<string, number | string | undefined> = {}
>({ endpoint, responseSchema, rQueryParams }: CreateGetQueryHookArgs<ResponseSchema>) {
    const queryFn = async (params?: { query?: QueryParams; route?: RouteParams }) => {
        const url = createUrl(endpoint, params?.query, params?.route)
        return client
            .get(url)
            .then((response) => responseSchema.parse(response.data))
            .catch(handleRequestError)
    }

    return (params?: { query?: QueryParams; route?: RouteParams }) =>
        useQuery({
            ...rQueryParams,
            queryKey: getQueryKey(rQueryParams.queryKey, params?.route, params?.query),
            queryFn: () => queryFn(params)
        }) as UseQueryResult<z.infer<ResponseSchema>>
}

/* ----------------------------------- PUT ---------------------------------- */

/**
 * Create a custom hook for performing POST requests with react-query and Zod validation
 *
 * @example
 * const useCreateUser = createPostMutationHook({
 *  endpoint: '/api/users',
 *  bodySchema: createUserSchema,
 *  responseSchema: userSchema,
 *  rMutationParams: { onSuccess: () => queryClient.invalidateQueries('getUsers') },
 * });
 */
export function createPostMutationHook<
    BodySchema extends z.ZodType,
    ResponseSchema extends z.ZodType,
    RouteParams extends Record<string, number | string | undefined> = {},
    QueryParams extends Record<string, number | string | undefined> = {}
>({
    endpoint,
    bodySchema,
    responseSchema,
    rMutationParams,
    options
}: CreatePostMutationHookArgs<BodySchema, ResponseSchema>) {
    return (params?: { query?: QueryParams; route?: RouteParams }) => {
        const queryClient = useQueryClient()
        const baseUrl = createUrl(endpoint, params?.query, params?.route)

        const mutationFn = async ({
            variables,
            route,
            query
        }: {
            query?: QueryParams
            route?: RouteParams
            variables: z.infer<BodySchema>
        }) => {
            const url = createUrl(baseUrl, query, route)

            const config = options?.isMultipart
                ? { headers: { 'Content-Type': 'multipart/form-data' } }
                : undefined

            return client
                .post(url, bodySchema.parse(variables), config)
                .then((response) => responseSchema.parse(response.data))
                .catch(handleRequestError)
        }

        return useMutation({
            ...rMutationParams,
            mutationFn,
            onSuccess: (data, variables, context) =>
                rMutationParams?.onSuccess?.(data, variables, context, queryClient),
            onError: (error, variables, context) =>
                rMutationParams?.onError?.(error, variables, context, queryClient),
            onSettled: (data, error, variables, context) =>
                rMutationParams?.onSettled?.(data, error, variables, context, queryClient)
        })
    }
}

/**
 * Create a custom hook for performing PUT requests with react-query and Zod validation
 *
 * @example
 * const useUpdateUser = createPutMutationHook<typeof updateUserSchema, typeof userSchema, { id: string }>({
 *  endpoint: '/api/users/:id',
 *  bodySchema: updateUserSchema,
 *  responseSchema: userSchema,
 *  rMutationParams: { onSuccess: () => queryClient.invalidateQueries('getUsers') },
 * });
 */
export function createPutMutationHook<
    BodySchema extends z.ZodType,
    ResponseSchema extends z.ZodType,
    RouteParams extends Record<string, number | string | undefined> = {},
    QueryParams extends Record<string, number | string | undefined> = {}
>({
    endpoint,
    bodySchema,
    responseSchema,
    rMutationParams,
    options
}: CreatePutMutationHookArgs<BodySchema, ResponseSchema>) {
    return (params?: { query?: QueryParams; route?: RouteParams }) => {
        const queryClient = useQueryClient()
        const baseUrl = createUrl(endpoint, params?.query, params?.route)
        const mutationFn = async ({
            variables,
            route,
            query
        }: {
            query?: QueryParams
            route?: RouteParams
            variables: z.infer<BodySchema>
        }) => {
            const url = createUrl(baseUrl, query, route)

            const config = options?.isMultipart
                ? { headers: { 'Content-Type': 'multipart/form-data' } }
                : undefined

            return client
                .put(url, bodySchema.parse(variables), config)
                .then((response) => responseSchema.parse(response.data))
                .catch(handleRequestError)
        }

        return useMutation({
            ...rMutationParams,
            mutationFn,
            onSuccess: (data, variables, context) =>
                rMutationParams?.onSuccess?.(data, variables, context, queryClient),
            onError: (error, variables, context) =>
                rMutationParams?.onError?.(error, variables, context, queryClient),
            onSettled: (data, error, variables, context) =>
                rMutationParams?.onSettled?.(data, error, variables, context, queryClient)
        })
    }
}

/* --------------------------------- DELETE --------------------------------- */

export function usePagination(params?: PaginationParams) {
    const [page, setPage] = useState(params?.page ?? 1)
    const [limit, setLimit] = useState(params?.limit ?? 15)

    const onChangeLimit = (value: number) => {
        setLimit(value)
        setPage(1)
    }

    return { page, limit, setPage, setLimit: onChangeLimit }
}

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
function createUrl(
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

/* ------------------------------- PAGINATION ------------------------------- */

function getQueryKey(
    queryKey: QueryKey,
    route: Record<string, number | string | undefined> = {},
    query: Record<string, number | string | undefined> = {}
) {
    const [mainKey, otherKeys = {}] = queryKey

    return [mainKey, { ...otherKeys, ...route, ...query }]
}

/** Handle request errors */
function handleRequestError(error: unknown) {
    if (isAxiosError(error)) {
        throw error.response?.data
    }

    if (error instanceof ZodError) {
        consola.error(error.format())
    }

    consola.log(error)

    throw error
}
