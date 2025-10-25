import { NavLink as RouterLink, useLocation } from 'react-router-dom'
import { Box, Divider, NavLink, Stack, Title } from '@mantine/core'
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
        <Stack gap="md" pb="md" pt="md">
            {menu.map((item, index) => (
                <Box key={item.header}>
                    {index > 0 && <Divider color="cyan.4" mb="lg" opacity={0.3} variant="dashed" />}
                    <Title className={classes.sectionTitle} order={6}>
                        {item.header}
                    </Title>

                    <Stack gap={1}>
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
                                            leftSection={
                                                dropdownItem.icon ? (
                                                    <dropdownItem.icon />
                                                ) : (
                                                    <PiArrowRight />
                                                )
                                            }
                                            onClick={isMobile ? onClose : undefined}
                                            to={dropdownItem.href}
                                            variant="subtle"
                                        />
                                    ))}
                                </NavLink>
                            ) : (
                                <NavLink
                                    active={pathname === subItem.href}
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
                    </Stack>
                </Box>
            ))}
        </Stack>
    )
}
