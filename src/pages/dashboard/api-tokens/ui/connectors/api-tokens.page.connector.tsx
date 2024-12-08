import { useEffect } from 'react'

import {
    useApiTokensStoreActions,
    useApiTokensStoreCreateModalIsOpen
} from '@entities/dashboard/api-tokens/api-tokens-store'
import { QueryKeys, useGetApiTokens } from '@shared/api/hooks'
import { queryClient } from '@shared/api'

import ApiTokensPageComponent from '../components/api-tokens.page.component'

export function ApiTokensPageConnector() {
    const actions = useApiTokensStoreActions()

    const isCreateModalOpen = useApiTokensStoreCreateModalIsOpen()

    const { data: apiTokens, isLoading } = useGetApiTokens()

    useEffect(() => {
        return () => {
            actions.resetState()
        }
    }, [])

    useEffect(() => {
        if (isCreateModalOpen) return
        ;(async () => {
            await queryClient.refetchQueries({
                queryKey: QueryKeys.apiTokens.getAllApiTokens.queryKey
            })
        })()
    }, [isCreateModalOpen])

    return <ApiTokensPageComponent apiTokens={apiTokens} isLoading={isLoading} />
}
