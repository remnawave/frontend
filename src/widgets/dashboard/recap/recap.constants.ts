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
