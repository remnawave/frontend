import type { GetNodeCommand } from '@remnawave/backend-contract'

export type TStage = 'connecting' | 'failed' | 'session' | 'setup'

export interface ISshTarget {
    host: string
    port: number
    username: string
}

export interface ISshTab {
    id: string
    node: GetNodeCommand.Response['response']
}

export interface ISshSessionStatus {
    isConnected: boolean
    size: string
    stage: TStage
    statusText: null | string
    target: ISshTarget
}

export interface ISshSessionHandle {
    showSettings: () => void
    write: (data: string) => void
}
