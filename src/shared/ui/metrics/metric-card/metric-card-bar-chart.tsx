import { BarChart, BarChartProps } from '@mantine/charts'

type MetricBarChartProps = BarChartProps

export function MetricCardBarChart(props: MetricBarChartProps) {
    return <BarChart {...props} style={{ flexShrink: 0, ...props.style }} />
}
