import { Tooltip } from '@mantine/core'

export default {
    Tooltip: Tooltip.extend({
        defaultProps: {
            radius: 'md',
            withArrow: true,
            transitionProps: { transition: 'scale-x', duration: 300 },
            arrowSize: 2,
            color: 'dark.6',
            styles: {
                tooltip: {
                    border: '1px solid var(--mantine-color-dark-4)'
                }
            }
        }
    })
}
