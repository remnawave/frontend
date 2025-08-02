import { IAppConfig, TAdditionalLocales } from '../../../../model/types'

export interface AppFormProps {
    app: IAppConfig
    onChange: (app: IAppConfig) => void
    onDelete?: () => void
    additionalLocales: TAdditionalLocales[]
}
