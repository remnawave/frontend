// oxlint-disable
import { Drawer, DrawerOverlay } from '@mantine/core'

import { scrollLockShards } from '@shared/utils/scroll-lock-shards'

import classes from './drawer.module.css'

export default {
    Drawer: Drawer.extend({
        classNames: {
            content: classes.drawerContent,
            header: classes.drawerHeader,
            body: classes.drawerBody
        },
        defaultProps: {
            removeScrollProps: { shards: scrollLockShards },
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
