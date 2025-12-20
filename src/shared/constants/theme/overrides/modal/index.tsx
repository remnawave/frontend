import { Modal } from '@mantine/core'

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
            radius: 'md',
            centered: true
        }
    })
}
