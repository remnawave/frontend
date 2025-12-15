import {
    BUTTON_TYPES_VALUES,
    SUBSCRIPTION_PAGE_TEMPLATE_KEYS,
    TButtonType,
    TSubscriptionPageButtonConfig,
    TSubscriptionPageLocales,
    TSubscriptionPageSvgLibrary
} from '@remnawave/subscription-page-types'
import {
    ActionIcon,
    Badge,
    Card,
    Collapse,
    CopyButton,
    Group,
    Select,
    Stack,
    Text,
    TextInput
} from '@mantine/core'
import { IconArrowDown, IconArrowUp, IconChevronRight, IconTrash } from '@tabler/icons-react'
import { PiCheck, PiCopy } from 'react-icons/pi'
import { useDisclosure } from '@mantine/hooks'
import { useTranslation } from 'react-i18next'

import { LocalizedTextEditor } from './localized-text-editor.component'
import styles from '../subpage-config-visual-editor.module.css'
import { SubpageTooltips } from './subpage-tooltips.component'
import { SvgIconSelect } from './svg-icon-select.component'

interface IProps {
    button: TSubscriptionPageButtonConfig
    canMoveDown: boolean
    canMoveUp: boolean
    enabledLocales: TSubscriptionPageLocales[]
    index: number
    onChange: (button: TSubscriptionPageButtonConfig) => void
    onDelete: () => void
    onMoveDown: () => void
    onMoveUp: () => void
    svgLibrary: TSubscriptionPageSvgLibrary
}

export function ButtonEditor(props: IProps) {
    const {
        button,
        canMoveDown,
        canMoveUp,
        enabledLocales,
        index,
        onChange,
        onDelete,
        onMoveDown,
        onMoveUp,
        svgLibrary
    } = props
    const { t } = useTranslation()
    const [opened, { toggle }] = useDisclosure(false)

    return (
        <Card className={styles.buttonCard} p="sm" radius="md">
            <Stack gap="sm">
                <Group className={styles.collapseHeader} justify="space-between" onClick={toggle}>
                    <Group gap="xs">
                        <IconChevronRight
                            className={`${styles.chevron} ${opened ? styles.chevronOpen : ''}`}
                            size={16}
                        />
                        <Text c="white" fw={500} size="sm">
                            Button {index + 1}: {button.text.en || 'Untitled'}
                        </Text>
                        <Badge
                            color={button.type === 'external' ? 'blue' : 'cyan'}
                            size="xs"
                            variant="light"
                        >
                            {button.type}
                        </Badge>
                    </Group>
                    <Group gap={4}>
                        <ActionIcon
                            color="gray"
                            disabled={!canMoveUp}
                            onClick={(e) => {
                                e.stopPropagation()
                                onMoveUp()
                            }}
                            size="sm"
                            variant="subtle"
                        >
                            <IconArrowUp size={14} />
                        </ActionIcon>
                        <ActionIcon
                            color="gray"
                            disabled={!canMoveDown}
                            onClick={(e) => {
                                e.stopPropagation()
                                onMoveDown()
                            }}
                            size="sm"
                            variant="subtle"
                        >
                            <IconArrowDown size={14} />
                        </ActionIcon>
                        <ActionIcon
                            className={styles.deleteButton}
                            color="red"
                            onClick={(e) => {
                                e.stopPropagation()
                                onDelete()
                            }}
                            size="sm"
                            variant="subtle"
                        >
                            <IconTrash size={14} />
                        </ActionIcon>
                    </Group>
                </Group>

                <Collapse in={opened}>
                    <Stack gap="sm" pt="sm">
                        <Group grow>
                            <TextInput
                                classNames={{ input: styles.inputDark }}
                                label={t('button-editor.component.link')}
                                leftSection={
                                    <SubpageTooltips>
                                        <Group gap="xs" key="subpage-template-keys">
                                            <Text size="sm">
                                                {t('remark-info.widget.supports-templates')}
                                            </Text>

                                            {SUBSCRIPTION_PAGE_TEMPLATE_KEYS.map((key) => (
                                                <CopyButton key={key} value={`{{${key}}}`}>
                                                    {({ copied, copy }) => (
                                                        <Badge
                                                            color={copied ? 'teal' : 'blue'}
                                                            key={key}
                                                            leftSection={
                                                                copied ? (
                                                                    <PiCheck size="16px" />
                                                                ) : (
                                                                    <PiCopy size="16px" />
                                                                )
                                                            }
                                                            onClick={copy}
                                                            size="md"
                                                        >
                                                            {`{{${key}}}`}
                                                        </Badge>
                                                    )}
                                                </CopyButton>
                                            ))}
                                        </Group>
                                    </SubpageTooltips>
                                }
                                onChange={(e) => onChange({ ...button, link: e.target.value })}
                                placeholder="https:// or app://"
                                value={button.link}
                            />
                            <Select
                                allowDeselect={false}
                                classNames={{ input: styles.selectDark }}
                                data={BUTTON_TYPES_VALUES}
                                label={t('button-editor.component.type')}
                                onChange={(v) =>
                                    onChange({
                                        ...button,
                                        type: v as TButtonType
                                    })
                                }
                                value={button.type}
                            />
                        </Group>

                        <SvgIconSelect
                            label={t('button-editor.component.svg-icon')}
                            onChange={(svgIconKey) => onChange({ ...button, svgIconKey })}
                            svgLibrary={svgLibrary}
                            value={button.svgIconKey}
                        />

                        <LocalizedTextEditor
                            enabledLocales={enabledLocales}
                            label={t('button-editor.component.button-text')}
                            onChange={(text) => onChange({ ...button, text })}
                            value={button.text}
                        />
                    </Stack>
                </Collapse>
            </Stack>
        </Card>
    )
}
