import { TbHeartFilled } from 'react-icons/tb'

import classes from './SupportControl.module.css'
import { HeaderControl } from './HeaderControl'

export function SupportControl() {
    return (
        <HeaderControl
            className={classes.support}
            component="a"
            href="https://docs.rw/docs/donate"
            rel="noopener noreferrer"
            target="_blank"
        >
            <TbHeartFilled />
        </HeaderControl>
    )
}
