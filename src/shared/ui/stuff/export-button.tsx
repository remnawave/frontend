import { forwardRef } from 'react';
import { PiExport as ExportIcon } from 'react-icons/pi';
import { Button, createPolymorphicComponent, type ButtonProps } from '@mantine/core';

export type ExportButtonProps = Omit<ButtonProps, 'leftSection'>;

export const ExportButton = createPolymorphicComponent<'button', ExportButtonProps>(
    forwardRef<HTMLButtonElement, ExportButtonProps>((props, ref) => (
        <Button ref={ref} leftSection={<ExportIcon size="1rem" />} {...props} />
    ))
);
