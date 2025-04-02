import { NavLink as RouterLink, useLocation } from 'react-router-dom'
import { Box, NavLink, Stack, Title } from '@mantine/core'
import { PiArrowRight } from 'react-icons/pi'

import { useMenuSections } from '../menu-sections/menu-sections'
import classes from './Navigation.module.css'

interface NavigationProps {
    isMobile?: boolean
    onClose?: () => void
}

export const Navigation = ({ isMobile, onClose }: NavigationProps) => {
    const { pathname } = useLocation()

    const menu = useMenuSections()

    return (
        <Stack gap="lg">
            {menu.map((item) => (
                <Box key={item.header}>
                    <Title className={classes.sectionTitle} order={6}>
                        {item.header}
                    </Title>

                    {item.section.map((subItem) =>
                        subItem.dropdownItems ? (
                            <NavLink
                                active={false}
                                childrenOffset={0}
                                className={classes.sectionLink}
                                key={subItem.name}
                                label={subItem.name}
                                leftSection={subItem.icon && <subItem.icon />}
                                variant="light"
                            >
                                {subItem.dropdownItems?.map((dropdownItem) => (
                                    <NavLink
                                        active={pathname.includes(dropdownItem.href)}
                                        className={classes.sectionDropdownItemLink}
                                        component={RouterLink}
                                        key={dropdownItem.name}
                                        label={dropdownItem.name}
                                        leftSection={<PiArrowRight />}
                                        onClick={isMobile ? onClose : undefined}
                                        to={dropdownItem.href}
                                        variant="subtle"
                                    />
                                ))}
                            </NavLink>
                        ) : (
                            <NavLink
                                className={classes.sectionLink}
                                component={RouterLink}
                                key={subItem.name}
                                label={subItem.name}
                                leftSection={subItem.icon && <subItem.icon />}
                                onClick={isMobile ? onClose : undefined}
                                to={subItem.href}
                                variant="subtle"
                                {...(subItem.newTab
                                    ? { target: '_blank', rel: 'noopener noreferrer' }
                                    : {})}
                            />
                        )
                    )}
                </Box>
            ))}
        </Stack>
    )
}
