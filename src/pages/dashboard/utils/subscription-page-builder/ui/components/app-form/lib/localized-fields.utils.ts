/* eslint-disable indent */

import { IAppConfig, ILocalizedText } from '../../../../model/types'

export const updateLocalizedField = (
    localApp: IAppConfig,
    obj: keyof IAppConfig,
    field: string,
    lang: keyof ILocalizedText,
    value: string,
    setLocalApp: (app: IAppConfig) => void,
    onChange: (app: IAppConfig) => void
) => {
    const objValue = localApp[obj]
    const fieldValue =
        objValue && typeof objValue === 'object'
            ? (objValue as Record<string, unknown>)[field]
            : null

    const updated: IAppConfig = {
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
