export interface ChipMultiSelectItem {
    icon?: React.ReactNode
    label: string
    value: string
}

export interface IProps {
    data: ChipMultiSelectItem[]
    defaultValue?: string[]
    description?: string
    error?: string
    label?: string
    onChange?: (value: string[]) => void
    value?: string[]
}
