import { Group, NativeSelect, NumberInput, NumberInputProps } from '@mantine/core'
import { useRef, useState } from 'react'

import {
    bestFitIecUnitUtil,
    bytesToUnitUtil,
    IEC_UNITS,
    TIecUnit,
    unitToBytesUtil
} from '@shared/utils/bytes'

type TByteValue = null | number | string | undefined

interface IProps extends Omit<NumberInputProps, 'defaultValue' | 'onChange' | 'value'> {
    defaultValue?: TByteValue
    onChange: (bytes: number | undefined) => void
    value?: TByteValue
}

const toBytes = (value: TByteValue): number | undefined => {
    if (value === null || value === undefined || value === '') return undefined
    const num = Number(value)
    return Number.isFinite(num) ? num : undefined
}

export const TrafficLimitInput = ({ defaultValue, onChange, value, ...rest }: IProps) => {
    const initialBytes = toBytes(defaultValue ?? value)
    const initialUnit = bestFitIecUnitUtil(initialBytes)

    const [unit, setUnit] = useState<TIecUnit>(initialUnit)
    const [display, setDisplay] = useState<number | string>(
        () => bytesToUnitUtil(initialBytes, initialUnit) ?? ''
    )

    const bytesRef = useRef<number | undefined>(initialBytes)

    const handleValueChange = (next: number | string) => {
        setDisplay(next)
        bytesRef.current = unitToBytesUtil(next, unit)
        onChange(bytesRef.current)
    }

    const handleUnitChange = (next: TIecUnit) => {
        setUnit(next)
        setDisplay(bytesToUnitUtil(bytesRef.current, next) ?? '')
    }

    return (
        <Group align="flex-end" gap="xs" wrap="nowrap">
            <NumberInput
                allowNegative={false}
                hideControls
                thousandSeparator=","
                size={rest.size ? rest.size : undefined}
                {...rest}
                flex={1}
                onChange={handleValueChange}
                value={display}
            />
            <NativeSelect
                aria-label="Unit"
                data={IEC_UNITS}
                onChange={(event) => handleUnitChange(event.currentTarget.value as TIecUnit)}
                size={rest.size ? rest.size : undefined}
                styles={{ input: { fontWeight: 500 } }}
                value={unit}
                w={92}
            />
        </Group>
    )
}
