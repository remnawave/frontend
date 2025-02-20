import { Group, Menu, Text, UnstyledButton, useDirection } from '@mantine/core'
import { IconChevronDown } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'

import classes from './LanguagePicker.module.css'

const data = [
    { label: 'English', emoji: '🇺🇸', value: 'en' },
    { label: 'Русский', emoji: '🇷🇺', value: 'ru' },
    { label: 'فارسی', emoji: '🇮🇷', value: 'fa' }
]

export function LanguagePicker() {
    const [opened, setOpened] = useState(false)
    const { toggleDirection, dir } = useDirection()

    const { i18n } = useTranslation()

    useEffect(() => {
        const savedLanguage = localStorage.getItem('i18nextLng')
        if (savedLanguage) {
            i18n.changeLanguage(savedLanguage)

            if (savedLanguage === 'fa') {
                if (dir === 'ltr') {
                    toggleDirection()
                }
            }
        }
    }, [i18n])

    const changeLanguage = (value: string) => {
        i18n.changeLanguage(value)

        if (value === 'fa' && dir === 'ltr') {
            toggleDirection()
        }

        if (dir === 'rtl' && value !== 'fa') {
            toggleDirection()
        }
    }

    const selected = data.find((item) => item.value === i18n.language) || data[0]

    const items = data.map((item) => (
        <Menu.Item
            key={item.value}
            leftSection={<Text>{item.emoji}</Text>}
            onClick={() => changeLanguage(item.value)}
        >
            {item.label}
        </Menu.Item>
    ))

    return (
        <Menu
            onClose={() => setOpened(false)}
            onOpen={() => setOpened(true)}
            radius="md"
            width="target"
            withinPortal
        >
            <Menu.Target>
                <UnstyledButton className={classes.control} data-expanded={opened || undefined}>
                    <Group gap="xs">
                        <Text>{selected.emoji}</Text>
                        <span className={classes.label}>{selected.label}</span>
                    </Group>
                    <IconChevronDown className={classes.icon} size={16} stroke={1.5} />
                </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>{items}</Menu.Dropdown>
        </Menu>
    )
}
