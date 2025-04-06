import { AppConfig } from '../../../../model/types'

export interface AppFormProps {
    app: AppConfig
    onChange: (app: AppConfig) => void
    onDelete?: () => void
}
