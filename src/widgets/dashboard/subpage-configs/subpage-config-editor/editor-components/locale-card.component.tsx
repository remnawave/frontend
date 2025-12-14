import { TSubscriptionPageLocales } from '@remnawave/subscription-page-types'
import { Badge, Group, Text, UnstyledButton } from '@mantine/core'

import styles from '../subpage-config-visual-editor.module.css'

interface IProps {
    code: TSubscriptionPageLocales
    flag: string
    isActive: boolean
    isDefault?: boolean
    name: string
    nativeName: string
    onToggle: () => void
}

export function LocaleCard(props: IProps) {
    const { code, flag, isActive, isDefault, name, nativeName, onToggle } = props

    const getBadgeColor = () => {
        if (isDefault) return 'cyan'
        return isActive ? 'teal' : 'gray'
    }

    return (
        <UnstyledButton
            className={isActive ? styles.localeCardActive : styles.localeCard}
            disabled={isDefault}
            onClick={onToggle}
        >
            <Group gap="xs" justify="space-between">
                <Group gap="xs">
                    <Text fw={600} size="lg">
                        {flag}
                    </Text>
                    <div>
                        <Text c="white" fw={500} size="sm">
                            {name}
                        </Text>
                        <Text c="dimmed" size="xs">
                            {nativeName}
                        </Text>
                    </div>
                </Group>
                <Badge color={getBadgeColor()} size="xs" variant="filled">
                    {code.toUpperCase()}
                </Badge>
            </Group>
        </UnstyledButton>
    )
}
