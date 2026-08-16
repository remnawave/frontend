import { Button, CheckIcon, ColorSwatch, Group, Stack, Text, TextInput } from '@mantine/core'
import { modals } from '@mantine/modals'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TbDeviceFloppy } from 'react-icons/tb'

import {
    UsersTableTemplateSnapshot,
    useUsersTableTemplatesActions
} from '@entities/dashboard/users/users-table-templates-store'

import { DEFAULT_TEMPLATE_COLOR, getSwatchColor, TEMPLATE_COLORS } from '../lib/constants'

interface IProps {
    getSnapshot: () => UsersTableTemplateSnapshot
}

export const SaveTemplateModal = (props: IProps) => {
    const { getSnapshot } = props
    const { t } = useTranslation()
    const { addTemplate } = useUsersTableTemplatesActions()

    const [name, setName] = useState('')
    const [color, setColor] = useState<string>(DEFAULT_TEMPLATE_COLOR)

    const handleSave = () => {
        const trimmed = name.trim()
        if (!trimmed) return

        addTemplate(trimmed, color, getSnapshot())
        modals.closeAll()
    }

    return (
        <Stack gap="md">
            <TextInput
                data-autofocus
                label={t('header-action-buttons.feature.template-name')}
                maxLength={40}
                onChange={(event) => setName(event.currentTarget.value)}
                onKeyDown={(event) => {
                    if (event.key === 'Enter') handleSave()
                }}
                placeholder="ACTIVE users with sort"
                value={name}
            />

            <Stack gap="xs">
                <Text fw={500} size="sm">
                    {t('common.color')}
                </Text>
                <Group gap="xs">
                    {TEMPLATE_COLORS.map((colorSelected) => (
                        <ColorSwatch
                            color={getSwatchColor(colorSelected)}
                            component="button"
                            key={colorSelected}
                            onClick={() => setColor(colorSelected)}
                            style={{ color: '#fff', cursor: 'pointer' }}
                            type="button"
                        >
                            {color === colorSelected && <CheckIcon size={12} />}
                        </ColorSwatch>
                    ))}
                </Group>
            </Stack>

            <Button
                color={color}
                disabled={!name.trim()}
                fullWidth
                leftSection={<TbDeviceFloppy size={16} />}
                onClick={handleSave}
                variant="soft"
            >
                {t('common.save')}
            </Button>
        </Stack>
    )
}
