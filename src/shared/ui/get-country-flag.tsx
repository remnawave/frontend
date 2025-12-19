import ReactCountryFlag from 'react-country-flag'

export function CountryFlag({ countryCode }: { countryCode: null | string | undefined }) {
    if (!countryCode || countryCode === 'XX') return null
    return (
        <ReactCountryFlag
            countryCode={countryCode}
            style={{
                fontSize: '1.1em',
                borderRadius: '2px'
            }}
        />
    )
}
