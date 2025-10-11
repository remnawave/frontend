import { ActionIcon, Button, CloseButton } from '@mantine/core'

export default {
    ActionIcon: ActionIcon.extend({
        defaultProps: {
            radius: 'lg',
            variant: 'outline'
        }
    }),
    Button: Button.extend({
        defaultProps: {
            radius: 'lg',
            variant: 'outline'
        }
    }),
    CloseButton: CloseButton.extend({
        defaultProps: {
            size: 'lg'
        }
    })
}
