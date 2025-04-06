import { AppConfig, Button as ConfigButton } from '../../../../model/types'
import { ButtonSection } from '../lib/button-fields.utils'

export interface ButtonFieldsProps {
    buttons: ConfigButton[]
    localApp: AppConfig
    section: ButtonSection
    updateApp: (data: Partial<AppConfig>) => void
}
