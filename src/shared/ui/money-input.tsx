import { Input, type InputProps, type InputWrapperProps, Text } from '@mantine/core'
import { useUncontrolled } from '@mantine/hooks'
import { IMaskInput } from 'react-imask'
import { forwardRef } from 'react'

const maskProps = {
    mask: Number,
    thousandsSeparator: ' ',
    radix: '.',
    normalizeZeros: true
}

export interface MoneyInputProps
    extends InputProps,
        Pick<InputWrapperProps, 'description' | 'error' | 'label' | 'required'> {
    currency?: string
    name?: string
    onChange?: (value: number | string) => void
    placeholder?: string
    value?: number | string
}

export const MoneyInput = forwardRef<HTMLDivElement, MoneyInputProps>(
    (
        {
            name,
            placeholder,
            error,
            label,
            description,
            required,
            value,
            onChange,
            currency = 'USD',
            ...rest
        },
        ref
    ) => {
        const [uncontrolledValue, handleUncontrolledValueChange] = useUncontrolled({
            value,
            defaultValue: value,
            onChange
        })

        const handleChange = (unmaskedNewValue: string) => {
            // Since money is typed in major units (100 USD), we need to convert
            // it to minor units (10000 cents) before sending it to the backend.
            const minorUnits = Math.round(Number(unmaskedNewValue) * 100)
            handleUncontrolledValueChange(minorUnits)
        }

        const majorUnitsValue = String(uncontrolledValue ? Number(uncontrolledValue) / 100 : '')

        return (
            <Input.Wrapper
                description={description}
                error={error}
                label={label}
                ref={ref}
                required={required}
            >
                <Input
                    autoComplete="none"
                    component={IMaskInput}
                    name={name}
                    onAccept={handleChange}
                    placeholder={placeholder}
                    rightSection={<Text mr="md">{currency}</Text>}
                    unmask
                    value={majorUnitsValue}
                    {...maskProps}
                    {...rest}
                />
            </Input.Wrapper>
        )
    }
)
