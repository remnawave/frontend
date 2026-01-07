import ReactCountryFlag from 'react-country-flag'

interface IProps {
    className?: string
    countryCode: null | string | undefined
}

export function CountryFlag({ countryCode, className }: IProps) {
    if (!countryCode || countryCode === 'XX') return null
    return (
        <ReactCountryFlag
            className={className}
            countryCode={countryCode}
            style={{
                fontSize: '1.1em',
                borderRadius: '2px'
            }}
        />
    )
}
