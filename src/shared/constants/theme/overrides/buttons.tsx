import { ActionIcon, Button, CloseButton, Switch } from '@mantine/core'

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
        },
        styles: {
            root: {
                transition: 'all 0.2s ease'
            }
        }
    }),
    CloseButton: CloseButton.extend({
        defaultProps: {
            size: 'lg'
        }
    }),
    Switch: Switch.extend({
        defaultProps: {
            radius: 'md'
        }
    })
}
