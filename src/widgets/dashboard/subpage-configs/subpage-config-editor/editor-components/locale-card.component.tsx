import { getLanguageInfo, TSubscriptionPageLanguageCode } from '@remnawave/subscription-page-types'
import { Badge, Group, Text, UnstyledButton } from '@mantine/core'

import styles from '../subpage-config-visual-editor.module.css'

interface IProps {
    code: TSubscriptionPageLanguageCode
    isActive: boolean
    isToggleDisabled?: boolean
    onToggle: () => void
}

export function LocaleCard(props: IProps) {
    const { code, isActive, isToggleDisabled, onToggle } = props

    const localeInfo = getLanguageInfo(code)

    if (!localeInfo) {
        return null
    }

    return (
        <UnstyledButton
            className={isActive ? styles.localeCardActive : styles.localeCard}
            disabled={isToggleDisabled}
            onClick={onToggle}
        >
            <Group gap="xs" justify="space-between" wrap="nowrap">
                <Group gap="xs" style={{ flex: 1, minWidth: 0 }} wrap="nowrap">
                    <Text size="lg" style={{ lineHeight: 1 }}>
                        {localeInfo.emoji}
                    </Text>
                    <div style={{ minWidth: 0, flex: 1 }}>
                        <Text c={isActive ? 'white' : 'dimmed'} fw={500} size="xs" truncate>
                            {localeInfo.name}
                        </Text>
                        <Text c="dimmed" size="xs" truncate>
                            {localeInfo.nativeName}
                        </Text>
                    </div>
                </Group>
                <Badge
                    color={isActive ? 'teal' : 'gray'}
                    size="xs"
                    variant={isActive ? 'filled' : 'light'}
                >
                    {code.toUpperCase()}
                </Badge>
            </Group>
        </UnstyledButton>
    )
}
