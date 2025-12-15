import { Drawer, DrawerOverlay } from '@mantine/core'

import classes from './drawer.module.css'

export default {
    Drawer: Drawer.extend({
        classNames: {
            header: classes.drawerHeader,
            body: classes.drawerBody
        },
        defaultProps: {
            radius: 'md'
        }
    }),
    DrawerOverlay: DrawerOverlay.extend({
        defaultProps: {
            backgroundOpacity: 0.6,
            blur: 0
        }
    })
}
