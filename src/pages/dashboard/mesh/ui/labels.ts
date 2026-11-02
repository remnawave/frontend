import i18next from 'i18next'

import english from '../../../../../public/locales/en/remnawave.json'

export const ui = (key: keyof typeof english.mesh.fork) =>
    (i18next.t as (key: string) => string)(`mesh.fork.${key}`)
