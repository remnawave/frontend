export const SWATCHES = [
    'rgb(21, 170, 191)',
    'rgb(167, 139, 250)',
    'rgb(56, 189, 248)',
    'rgb(251, 146, 60)',
    'rgb(52, 211, 153)',
    'rgb(244, 114, 182)',
    'rgb(250, 204, 21)',
    'rgb(239, 68, 68)',
    'rgb(45, 212, 191)',
    'rgb(192, 132, 252)',
    'rgb(251, 191, 36)',
    'rgb(74, 222, 128)',
    'rgb(249, 115, 22)',
    'rgb(236, 72, 153)',
    'rgb(99, 102, 241)',
    'rgb(14, 165, 233)'
]

export type CardSection = 'infra' | 'month' | 'stats'

export const CARD_SECTIONS: { label: string; value: CardSection }[] = [
    { label: 'Nodes & Traffic', value: 'stats' },
    { label: 'This Month', value: 'month' },
    { label: 'Infrastructure', value: 'infra' }
]

export const DEFAULT_SECTIONS: CardSection[] = ['stats', 'month', 'infra']

export type BgStyle = 'dots' | 'gradient' | 'grid' | 'solid'

export const BG_STYLES: { label: string; value: BgStyle }[] = [
    { label: 'Solid', value: 'solid' },
    { label: 'Gradient', value: 'gradient' },
    { label: 'Dots', value: 'dots' },
    { label: 'Grid', value: 'grid' }
]

export type MaskableField =
    | 'countries'
    | 'cpuCores'
    | 'monthTraffic'
    | 'monthUsers'
    | 'nodes'
    | 'ram'
    | 'totalTraffic'
    | 'totalUsers'

export const MASKABLE_FIELDS: { label: string; value: MaskableField }[] = [
    { label: 'Users', value: 'totalUsers' },
    { label: 'Nodes', value: 'nodes' },
    { label: 'Traffic', value: 'totalTraffic' },
    { label: 'New users', value: 'monthUsers' },
    { label: 'Month traffic', value: 'monthTraffic' },
    { label: 'Countries', value: 'countries' },
    { label: 'CPU cores', value: 'cpuCores' },
    { label: 'RAM', value: 'ram' }
]
