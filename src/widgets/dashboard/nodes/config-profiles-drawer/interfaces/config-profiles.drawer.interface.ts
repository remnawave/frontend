export interface IProps {
    activeConfigProfileInbounds: null | string[] | undefined
    activeConfigProfileUuid: null | string | undefined
    onClose: () => void
    onSaveInbounds: (inbounds: string[], configProfileUuid: string) => void
    opened: boolean
}
