import { JSX } from 'react/jsx-runtime'

export interface MetricWithIconProps {
    color?: string
    icon: React.ElementType
    title: string
    value: JSX.Element | number | string
}
