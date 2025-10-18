import { ActionIcon, Button, CloseButton } from '@mantine/core'

export default {
    ActionIcon: ActionIcon.extend({
        defaultProps: {
            radius: 'md',
            variant: 'outline'
        }
    }),
    Button: Button.extend({
        defaultProps: {
            radius: 'md',
            variant: 'light'
        }
    }),
    CloseButton: CloseButton.extend({
        defaultProps: {
            size: 'lg'
        }
    })
}
