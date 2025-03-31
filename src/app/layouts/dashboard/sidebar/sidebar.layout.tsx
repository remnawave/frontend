import { NavLink as RouterLink, useLocation } from 'react-router-dom'
import { NavLink, Stack, Title } from '@mantine/core'

import { useMenuSections } from './menu-sections'
import classes from './sidebar.module.css'

export function SidebarLayout() {
    const { pathname } = useLocation()

    const menu = useMenuSections()

    return (
        <Stack gap="lg">
            {menu.map((item) => (
                <div key={item.header}>
                    <Title className={classes.sectionTitle} order={6}>
                        {item.header}
                    </Title>

                    {item.section.map((subItem) =>
                        subItem.dropdownItems ? (
                            <NavLink
                                active={pathname.includes(subItem.href)}
                                childrenOffset={0}
                                className={classes.sectionLink}
                                key={subItem.name}
                                label={subItem.name}
                                leftSection={subItem.icon && <subItem.icon />}
                                variant="subtle"
                            >
                                {subItem.dropdownItems?.map((dropdownItem) => (
                                    <NavLink
                                        active={pathname.includes(dropdownItem.href)}
                                        className={classes.sectionDropdownItemLink}
                                        component={RouterLink}
                                        key={dropdownItem.name}
                                        label={dropdownItem.name}
                                        leftSection={<span className="dot" />}
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
                                to={subItem.href}
                                variant="subtle"
                                {...(subItem.newTab
                                    ? { target: '_blank', rel: 'noopener noreferrer' }
                                    : {})}
                            />
                        )
                    )}
                </div>
            ))}
        </Stack>
    )
}
