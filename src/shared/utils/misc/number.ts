interface FormatterOptions {
    decimalSeparator?: string
    full?: boolean
    precision?: number
    prefix?: string
    suffix?: string
    thousandSeparator?: string
}

const defaultOptions: Required<FormatterOptions> = {
    precision: 2,
    thousandSeparator: ',',
    decimalSeparator: '.',
    suffix: '',
    prefix: '',
    full: true
}

export function formatCurrency(
    value: number | string,
    options?: FormatterOptions,
    currency = '$'
): string {
    // eslint-disable-next-line no-use-before-define
    return formatDecimal(value, { ...options, prefix: currency })
}

export function formatCurrencyWithIntl(amount: number) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    }).format(amount)
}

export function formatDecimal(value: number | string, options?: FormatterOptions): string {
    const currentValue = typeof value === 'string' ? parseFloat(value) : value

    if (Number.isNaN(currentValue)) {
        throw new Error(
            'Invalid value. Please provide a valid number or string representation of a number.'
        )
    }

    const { precision, thousandSeparator, decimalSeparator, prefix, suffix } = {
        ...defaultOptions,
        ...options
    }

    const parts = currentValue.toFixed(precision).split('.')
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator)
    const decimalPart = parts[1]

    return `${prefix}${integerPart}`
        .concat(decimalPart ? `${decimalSeparator}${decimalPart}` : '')
        .concat(suffix)
}

export function formatInt(value: number | string, options?: FormatterOptions) {
    return formatDecimal(value, { ...options, precision: 0 })
}

export function formatPercentage(value: number | string, options?: FormatterOptions): string {
    return formatDecimal(value, { ...options, suffix: '%' })
}

export function isNumber(value: unknown): value is number {
    return typeof value === 'number' && !Number.isNaN(value)
}

export function randomInt({ min, max }: { max: number; min: number }) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}
