import { GetInternalSquadsCommand } from '@remnawave/backend-contract'
import { Key } from 'react'

export interface IProps {
    description: string
    filteredInternalSquads: GetInternalSquadsCommand.Response['response']['internalSquads']
    formKey: Key | null | undefined
    hideEditButton?: boolean
    label: string
    searchQuery: string
    setSearchQuery: (value: string) => void
}
