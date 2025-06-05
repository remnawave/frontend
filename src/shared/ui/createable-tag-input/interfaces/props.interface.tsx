import type { InputBaseProps } from '@mantine/core'

export interface IProps extends InputBaseProps {
    defaultValue?: null | string
    onChange?: (value: null | string) => void
    tags: string[]
    value?: null | string
}
