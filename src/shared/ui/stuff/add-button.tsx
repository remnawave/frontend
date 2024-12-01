import { Button, type ButtonProps, createPolymorphicComponent } from '@mantine/core'
import { PiPlus as AddIcon } from 'react-icons/pi'
import { forwardRef } from 'react'

export type AddButtonProps = Omit<ButtonProps, 'leftSection'>

export const AddButton = createPolymorphicComponent<'button', AddButtonProps>(
    forwardRef<HTMLButtonElement, AddButtonProps>((props, ref) => (
        <Button leftSection={<AddIcon size="1rem" />} ref={ref} {...props} />
    ))
)
