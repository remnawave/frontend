/* eslint-disable indent */

import { AppConfig, LocalizedText } from '../../../../model/types'

export const updateLocalizedField = (
    localApp: AppConfig,
    obj: keyof AppConfig,
    field: string,
    lang: keyof LocalizedText,
    value: string,
    setLocalApp: (app: AppConfig) => void,
    onChange: (app: AppConfig) => void
) => {
    const objValue = localApp[obj]
    const fieldValue =
        objValue && typeof objValue === 'object'
            ? (objValue as Record<string, unknown>)[field]
            : null

    const updated: AppConfig = {
        ...localApp,
        [obj]:
            typeof objValue === 'object' && objValue !== null
                ? {
                      ...objValue,
                      [field]: {
                          ...(fieldValue && typeof fieldValue === 'object' ? fieldValue : {}),
                          [lang]: value
                      }
                  }
                : objValue
    }

    setLocalApp(updated)
    onChange(updated)
}
