import { GetConfigProfilesCommand } from '@remnawave/backend-contract'

export interface IProps {
    configProfiles: GetConfigProfilesCommand.Response['response']['configProfiles'] | undefined
    handleSearchAddressSelect: (value: null | string) => void
    handleSearchSelect: (value: null | string) => void
    searchAddressData: { label: string; value: string }[]
    searchAddressValue: null | string
    searchOptions: { label: string; value: string }[]
    searchValue: null | string
    setSearchAddressValue: (value: null | string) => void
    setSearchValue: (value: null | string) => void
}
