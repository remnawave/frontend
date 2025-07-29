export interface IProps {
    activeConfigProfileInbound: null | string | undefined
    activeConfigProfileUuid: null | string | undefined
    onClose: () => void
    onSaveInbound: (inbound: string, configProfileUuid: string) => void
    opened: boolean
}
