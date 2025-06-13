import { GetInboundsCommand } from '@remnawave/backend-contract'
import { Key } from 'react'

export interface IProps {
    checkboxLogic: 'exclude' | 'include'
    description: string
    filteredInbounds: GetInboundsCommand.Response['response']
    formKey: Key | null | undefined
    handleIncludedInboundsChange: (values: string[]) => void
    includedInbounds: string[]
    label: string
    searchQuery: string
    setSearchQuery: (value: string) => void
}
