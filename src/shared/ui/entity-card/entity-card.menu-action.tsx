import { useDisclosure, useId } from '@mantine/hooks'
import { ActionIcon, Menu } from '@mantine/core'
import { TbChevronDown } from 'react-icons/tb'
import clsx from 'clsx'

// import { useEntityCardContext } from './entity-card.context'
import classes from './entity-card.module.css'

interface MenuActionProps {
    children: React.ReactNode
    color?: string
}

export function EntityCardMenuAction({ children, color = 'cyan' }: MenuActionProps) {
    const uuid = useId()
    // const { menuOpened, setMenuOpened } = useEntityCardContext()
    const [opened, handlers] = useDisclosure()

    return (
        <Menu
            key={uuid}
            onClose={handlers.close}
            onOpen={handlers.open}
            position="bottom-end"
            radius="md"
            trigger="click-hover"
            withinPortal
        >
            <Menu.Target>
                <ActionIcon className={classes.menuControl} color={color} size="36" variant="light">
                    <TbChevronDown
                        className={clsx(classes.menuControlIcon, {
                            [classes.menuControlIconOpen]: opened,
                            [classes.menuControlIconClosed]: !opened
                        })}
                        size={20}
                    />
                </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>{children}</Menu.Dropdown>
        </Menu>
    )
}
