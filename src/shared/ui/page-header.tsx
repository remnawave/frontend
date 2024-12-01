import { Anchor, Breadcrumbs, ElementProps, Group, GroupProps, Text, Title } from '@mantine/core'
import { NavLink } from 'react-router-dom'
import { ReactNode } from 'react'

interface PageHeaderProps
    extends ElementProps<'header', keyof GroupProps>,
        Omit<GroupProps, 'title'> {
    breadcrumbs?: { href?: string; label: string }[]
    title: ReactNode
}

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
                <Title component="h2" order={2}>
                    {title}
                </Title>

                {breadcrumbs && (
                    <Breadcrumbs mt="sm">
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
                )}
            </div>

            {children}
        </Group>
    )
}
