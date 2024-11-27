import type { CenterProps, ElementProps } from '@mantine/core';

export interface IProps extends CenterProps, ElementProps<'div', keyof CenterProps> {
    text: string;
}
