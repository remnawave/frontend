import { Menu, Menubar } from '@mantine/core'
import clsx from 'clsx'
import { ElementType, Fragment } from 'react'
import { PiCaretDownBold } from 'react-icons/pi'
import { Link, matchPath, useLocation, useNavigate } from 'react-router'

import { useDesktopMenuSections } from '../menu-sections/desktop-menu-sections'
import classes from './desktop-navigation.module.css'

const NavIcon = ({ icon: Icon }: { icon?: ElementType }) =>
    Icon ? (
        <span className={classes.icon}>
            <Icon />
        </span>
    ) : null

const isPathActive = (pathname: string, href: string): boolean =>
    matchPath({ path: href, end: false }, pathname) !== null

const externalLinkProps = (newTab?: boolean) =>
    newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}

export const DesktopNavigation = () => {
    const { pathname } = useLocation()
    const navigate = useNavigate()
    const menu = useDesktopMenuSections()

    return (
        <Menubar className={classes.navBar} trigger="hover">
            {menu.map((section) => {
                const sectionActive = section.section.some((item) => {
                    if (item.newTab) {
                        return false
                    }
                    const hrefs = [
                        item.href,
                        ...(item.dropdownItems?.map((child) => child.href) ?? [])
                    ]
                    return hrefs.some((href) => isPathActive(pathname, href))
                })

                const singleItem =
                    section.section.length === 1 &&
                    !section.section[0].dropdownItems &&
                    !section.section[0].newTab
                        ? section.section[0]
                        : null

                if (singleItem) {
                    return (
                        <Menubar.Menu key={section.id}>
                            <Menubar.Target
                                className={clsx(classes.navItem, {
                                    [classes.navItemActive]: sectionActive
                                })}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter' || event.key === ' ') {
                                        navigate(singleItem.href)
                                    }
                                }}
                                {...{ component: Link, to: singleItem.href }}
                            >
                                <NavIcon icon={section.icon ?? singleItem.icon} />
                                <span>{section.header}</span>
                            </Menubar.Target>
                        </Menubar.Menu>
                    )
                }

                const firstItem = section.section.find((item) => !item.newTab)
                const firstSectionHref = firstItem?.dropdownItems?.[0]?.href ?? firstItem?.href

                return (
                    <Menubar.Menu key={section.id} width={250} withinPortal>
                        <Menubar.Target
                            className={clsx(classes.navItem, {
                                [classes.navItemActive]: sectionActive
                            })}
                            {...(firstSectionHref ? { component: Link, to: firstSectionHref } : {})}
                        >
                            <NavIcon icon={section.icon} />
                            <span>{section.header}</span>
                            <PiCaretDownBold className={classes.caret} size={11} />
                        </Menubar.Target>
                        <Menubar.Dropdown>
                            {section.section.map((item, index) =>
                                item.dropdownItems ? (
                                    <Fragment key={item.id}>
                                        {index > 0 && <Menu.Divider />}
                                        <Menu.Label>{item.name}</Menu.Label>
                                        {item.dropdownItems.map((dropdownItem) => (
                                            <Menu.Item
                                                className={clsx({
                                                    [classes.menuItemActive]: isPathActive(
                                                        pathname,
                                                        dropdownItem.href
                                                    )
                                                })}
                                                component={Link}
                                                key={dropdownItem.id}
                                                leftSection={<NavIcon icon={dropdownItem.icon} />}
                                                to={dropdownItem.href}
                                            >
                                                {dropdownItem.name}
                                            </Menu.Item>
                                        ))}
                                        {index < section.section.length - 1 && <Menu.Divider />}
                                    </Fragment>
                                ) : (
                                    <Menu.Item
                                        className={clsx({
                                            [classes.menuItemActive]:
                                                !item.newTab && isPathActive(pathname, item.href)
                                        })}
                                        component={Link}
                                        key={item.id}
                                        leftSection={<NavIcon icon={item.icon} />}
                                        to={item.href}
                                        {...externalLinkProps(item.newTab)}
                                    >
                                        {item.name}
                                    </Menu.Item>
                                )
                            )}
                        </Menubar.Dropdown>
                    </Menubar.Menu>
                )
            })}
        </Menubar>
    )
}
