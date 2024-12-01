import { Button, type ButtonProps, createPolymorphicComponent } from '@mantine/core'
import { PiExport as ExportIcon } from 'react-icons/pi'
import { forwardRef } from 'react'

export type ExportButtonProps = Omit<ButtonProps, 'leftSection'>

export const ExportButton = createPolymorphicComponent<'button', ExportButtonProps>(
    forwardRef<HTMLButtonElement, ExportButtonProps>((props, ref) => (
        <Button leftSection={<ExportIcon size="1rem" />} ref={ref} {...props} />
    ))
)
