import { forwardRef } from 'react'

import { Input, Text, type InputProps, type InputWrapperProps } from '@mantine/core'
import { useUncontrolled } from '@mantine/hooks'
import { IMaskInput } from 'react-imask'

const maskProps = {
    mask: Number,
    thousandsSeparator: ' ',
    radix: '.',
    normalizeZeros: true
}

export interface MoneyInputProps
    extends Pick<InputWrapperProps, 'description' | 'label' | 'error' | 'required'>,
        InputProps {
    name?: string
    value?: string | number
    placeholder?: string
    onChange?: (value: number | string) => void
    currency?: string
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
                ref={ref}
                label={label}
                error={error}
                description={description}
                required={required}
            >
                <Input
                    unmask
                    autoComplete="none"
                    name={name}
                    placeholder={placeholder}
                    component={IMaskInput}
                    rightSection={<Text mr="md">{currency}</Text>}
                    value={majorUnitsValue}
                    onAccept={handleChange}
                    {...maskProps}
                    {...rest}
                />
            </Input.Wrapper>
        )
    }
)
