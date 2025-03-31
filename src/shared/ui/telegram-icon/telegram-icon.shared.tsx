import { IconBrandTelegram } from '@tabler/icons-react'
import { Box } from '@mantine/core'

import classes from './TelegramIcon.module.css'

export function TelegramIconShared() {
    return (
        <Box
            className={classes.telegramButton}
            onClick={() => window.open('https://t.me/remnawave', '_blank')}
        >
            <IconBrandTelegram color="white" size="1.2rem" />
        </Box>
    )
}
