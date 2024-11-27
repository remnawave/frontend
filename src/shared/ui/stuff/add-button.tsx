import { forwardRef } from 'react';
import { PiPlus as AddIcon } from 'react-icons/pi';
import { Button, createPolymorphicComponent, type ButtonProps } from '@mantine/core';

export type AddButtonProps = Omit<ButtonProps, 'leftSection'>;

export const AddButton = createPolymorphicComponent<'button', AddButtonProps>(
    forwardRef<HTMLButtonElement, AddButtonProps>((props, ref) => (
        <Button ref={ref} leftSection={<AddIcon size="1rem" />} {...props} />
    ))
);
