import { Menu, Text, useDirection } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'

const data = [
    { label: 'English', emoji: '🇬🇧', value: 'en' },
    { label: 'Русский', emoji: '🇷🇺', value: 'ru' },
    { label: 'فارسی', emoji: '🇮🇷', value: 'fa' }
]

export function LanguagePicker() {
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
        <Menu position="bottom-end" width={150} withinPortal>
            <Menu.Target>
                {/* <ActionIcon color="gray" size="xl"> */}
                <Text size="xl">{selected.emoji}</Text>
                {/* </ActionIcon> */}
            </Menu.Target>
            <Menu.Dropdown>{items}</Menu.Dropdown>
        </Menu>
    )
}
