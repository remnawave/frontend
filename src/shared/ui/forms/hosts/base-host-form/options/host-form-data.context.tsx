import { GetInputPropsReturnType } from '@mantine/form'
import {
    GetHostsTagsCommand,
    GetInternalSquadsCommand,
    GetNodesCommand,
    GetSubscriptionTemplatesCommand
} from '@remnawave/backend-contract'
import { createContext, ReactNode, useContext } from 'react'

import { THostForm } from '../host-form.types'
import { IHostJsonFieldConfig } from '../json-fields'

export interface IHostFormData {
    form: THostForm
    handleTagsChange: (value: string[]) => void
    hostJsonFields: IHostJsonFieldConfig[]
    hostTags: GetHostsTagsCommand.Response['response']['tags']
    internalSquads: GetInternalSquadsCommand.Response['response']['internalSquads']
    internalSquadsModeProps: Omit<GetInputPropsReturnType, 'error'>
    isAllowOnlyInternalSquads: boolean
    isXhttpExtraButtonDisabled: () => boolean
    language: string
    nodes: GetNodesCommand.Response['response']
    patternHoverCard: (
        showSingle?: boolean,
        showMulti?: boolean,
        showWildcard?: boolean
    ) => ReactNode
    resolveSelectedRawInbound: () => unknown
    securityLayerLabels: Record<string, string>
    subscriptionTemplates: GetSubscriptionTemplatesCommand.Response['response']['templates']
    tagsInputProps: GetInputPropsReturnType
}

const HostFormDataContext = createContext<IHostFormData | null>(null)

interface Props {
    children: ReactNode
    value: IHostFormData
}

export function HostFormDataProvider(props: Props) {
    const { children, value } = props

    return <HostFormDataContext.Provider value={value}>{children}</HostFormDataContext.Provider>
}

export function useHostFormData(): IHostFormData {
    const context = useContext(HostFormDataContext)

    if (!context) {
        throw new Error('useHostFormData must be used inside HostFormDataProvider')
    }

    return context
}
