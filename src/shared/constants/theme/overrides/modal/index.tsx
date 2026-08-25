// oxlint-disable
import { Modal } from '@mantine/core'

import { scrollLockShards } from '@shared/utils/scroll-lock-shards'

import classes from './modal.module.css'

export default {
    Modal: Modal.extend({
        classNames: {
            root: classes.modalRoot,
            header: classes.modalHeader,
            body: classes.modalBody,
            content: classes.modalContent
        },
        defaultProps: {
            removeScrollProps: { shards: scrollLockShards },
            radius: 'md',
            centered: true
        }
    })
}
