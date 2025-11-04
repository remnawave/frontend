import ReactCountryFlag from 'react-country-flag'
import { ReactNode } from 'react'

export const getLocaleFlag = (locale: string): ReactNode => {
    switch (locale) {
        case 'en':
            return (
                <ReactCountryFlag
                    countryCode="GB"
                    style={{
                        fontSize: '1.1em',
                        borderRadius: '2px'
                    }}
                />
            )
        case 'fa':
            return (
                <ReactCountryFlag
                    countryCode="IR"
                    style={{
                        fontSize: '1.1em',
                        borderRadius: '2px'
                    }}
                />
            )
        case 'fr':
            return (
                <ReactCountryFlag
                    countryCode="FR"
                    style={{
                        fontSize: '1.1em',
                        borderRadius: '2px'
                    }}
                />
            )
        case 'ru':
            return (
                <ReactCountryFlag
                    countryCode="RU"
                    style={{
                        fontSize: '1.1em',
                        borderRadius: '2px'
                    }}
                />
            )
        case 'zh':
            return (
                <ReactCountryFlag
                    countryCode="CN"
                    style={{
                        fontSize: '1.1em',
                        borderRadius: '2px'
                    }}
                />
            )
        default:
            return null
    }
}
