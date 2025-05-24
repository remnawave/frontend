import {
    Badge,
    Box,
    Button,
    Card,
    Group,
    ScrollArea,
    Stack,
    Text,
    TextInput,
    UnstyledButton
} from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import ColorHash from 'color-hash'
import { useState } from 'react'

import type { DownloadableSubscriptionTemplate } from '@shared/constants/templates/template-list'

import { TemplateSelectorProps } from './interfaces'

export const TemplateSelector = (props: TemplateSelectorProps) => {
    const { onSelect, selectedTemplate, templates, templateType } = props
    const { t } = useTranslation()

    const ch = new ColorHash()

    const [searchQuery, setSearchQuery] = useState('')

    const filteredTemplates = templates.filter(
        (template) =>
            template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            template.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
            template.type.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const actualTemplates = filteredTemplates.filter((template) => {
        if (templateType === template.type) {
            return true
        }
        return false
    })

    const groupedTemplates = actualTemplates.reduce(
        (acc, template) => {
            if (!acc[template.author]) {
                acc[template.author] = []
            }
            acc[template.author].push(template)
            return acc
        },
        {} as Record<string, DownloadableSubscriptionTemplate[]>
    )

    return (
        <Stack gap="md">
            <Group grow justify="space-between">
                <Button
                    component="a"
                    href="https://github.com/remnawave/templates"
                    target="_blank"
                    variant="light"
                >
                    {t('template-selector.add-template')}
                </Button>
            </Group>
            <TextInput
                leftSection={<IconSearch size={16} />}
                onChange={(event) => setSearchQuery(event.currentTarget.value)}
                placeholder={t('template-selector.search-templates')}
                value={searchQuery}
            />

            <ScrollArea h={400}>
                <Stack gap="lg">
                    {Object.entries(groupedTemplates).map(([author, templates]) => (
                        <Box key={author}>
                            <Text c="dimmed" fw={600} mb="xs" size="sm">
                                {author === 'remnawave'
                                    ? t('template-selector.official-templates')
                                    : t('template-selector.author-templates', { author })}
                            </Text>
                            <Stack gap="xs">
                                {templates.map((template) => (
                                    <UnstyledButton
                                        key={`${template.author}-${template.name}`}
                                        onClick={() => onSelect(template)}
                                        w="100%"
                                    >
                                        <Card
                                            className="hover:shadow-sm"
                                            padding="sm"
                                            style={{
                                                borderColor:
                                                    selectedTemplate === template
                                                        ? 'var(--mantine-color-blue-5)'
                                                        : undefined,
                                                transition: 'all 0.2s ease'
                                            }}
                                            withBorder
                                        >
                                            <Group justify="space-between" wrap="nowrap">
                                                <Box style={{ flex: 1, minWidth: 0 }}>
                                                    <Text fw={500} size="sm" truncate>
                                                        {template.name}
                                                    </Text>
                                                    <Text c="dimmed" size="xs" truncate>
                                                        by {template.author}
                                                    </Text>
                                                </Box>
                                                <Badge
                                                    color={ch.hex(template.type)}
                                                    size="sm"
                                                    variant="light"
                                                >
                                                    {template.type}
                                                </Badge>
                                            </Group>
                                        </Card>
                                    </UnstyledButton>
                                ))}
                            </Stack>
                        </Box>
                    ))}
                </Stack>
            </ScrollArea>
        </Stack>
    )
}
