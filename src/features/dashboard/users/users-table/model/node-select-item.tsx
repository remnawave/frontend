import { ComboboxItem, Group, Text } from '@mantine/core'
import ReactCountryFlag from 'react-country-flag'
import { forwardRef } from 'react'

export interface NodeSelectItemProps extends ComboboxItem {
    countryCode?: null | string
}

export const NodeSelectItem = forwardRef<HTMLDivElement, NodeSelectItemProps>(
    ({ countryCode, label, ...others }, ref) => (
        <div ref={ref} {...others}>
            <Group gap="sm">
                {countryCode && countryCode !== 'XX' && (
                    <ReactCountryFlag
                        countryCode={countryCode}
                        style={{
                            fontSize: '1.1em',
                            borderRadius: '2px'
                        }}
                    />
                )}
                <Text size="sm">{label}</Text>
            </Group>
        </div>
    )
)
