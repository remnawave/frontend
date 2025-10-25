export interface IFilters {
    configProfileUuid: null | string
    hostTag: null | string
    inboundUuid: null | string
}

export interface IState {
    filters: IFilters
}
