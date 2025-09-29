import { Anchor, Breadcrumbs, ElementProps, Group, GroupProps, Text, Title } from '@mantine/core'
import { PiCaretRight } from 'react-icons/pi'
import { NavLink } from 'react-router-dom'
import { motion } from 'motion/react'
import { ReactNode } from 'react'

/* eslint-disable @stylistic/indent */
interface PageHeaderProps
    extends ElementProps<'header', keyof GroupProps>,
        Omit<GroupProps, 'title'> {
    breadcrumbs?: { href?: string; label: string }[]
    title: ReactNode
}
/* eslint-enable @stylistic/indent */

export function PageHeader({
    children,
    title,
    breadcrumbs,
    className,
    mb = 'xl',
    ...props
}: PageHeaderProps) {
    return (
        <Group className={className} component="header" justify="space-between" mb={mb} {...props}>
            <div>
                <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    initial={{ opacity: 0, y: -20 }}
                    transition={{
                        duration: 0.5,
                        ease: [0, 0.71, 0.2, 1.01]
                    }}
                >
                    <Title component="h2" order={2}>
                        {title}
                    </Title>
                </motion.div>

                {breadcrumbs && (
                    <motion.div
                        animate={{ opacity: 1, y: 0 }}
                        initial={{ opacity: 0, y: -10 }}
                        transition={{
                            duration: 0.5,
                            ease: [0, 0.71, 0.2, 1.01]
                        }}
                    >
                        <Breadcrumbs
                            mt="sm"
                            separator={<PiCaretRight size={14} />}
                            separatorMargin="xs"
                        >
                            {breadcrumbs.map((breadcrumb) =>
                                breadcrumb.href ? (
                                    <Anchor
                                        c="inherit"
                                        component={NavLink}
                                        fz="sm"
                                        key={breadcrumb.label}
                                        to={breadcrumb.href}
                                        underline="never"
                                    >
                                        {breadcrumb.label}
                                    </Anchor>
                                ) : (
                                    <Text c="dimmed" fz="sm" key={breadcrumb.label}>
                                        {breadcrumb.label}
                                    </Text>
                                )
                            )}
                        </Breadcrumbs>
                    </motion.div>
                )}
            </div>

            {children}
        </Group>
    )
}
