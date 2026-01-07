import {
    BUTTON_TYPES_VALUES,
    SUBSCRIPTION_PAGE_TEMPLATE_KEYS,
    TButtonType,
    TSubscriptionPageButtonConfig,
    TSubscriptionPageLanguageCode,
    TSubscriptionPageSvgLibrary
} from '@remnawave/subscription-page-types'
import {
    ActionIcon,
    Badge,
    Card,
    Collapse,
    Group,
    Select,
    Stack,
    Text,
    TextInput
} from '@mantine/core'
import { IconArrowDown, IconArrowUp, IconChevronRight, IconTrash } from '@tabler/icons-react'
import { TbExternalLink } from 'react-icons/tb'
import { useDisclosure } from '@mantine/hooks'
import { useTranslation } from 'react-i18next'

import { TemplateInfoPopoverShared } from '@shared/ui/popovers'

import { LocalizedTextEditor } from './localized-text-editor.component'
import styles from '../subpage-config-visual-editor.module.css'
import { SvgIconSelect } from './svg-icon-select.component'

interface IProps {
    button: TSubscriptionPageButtonConfig
    canMoveDown: boolean
    canMoveUp: boolean
    enabledLocales: TSubscriptionPageLanguageCode[]
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

    const firstLocale = enabledLocales[0]
    const buttonTitle = (firstLocale && button.text[firstLocale]) || 'Untitled'

    return (
        <Card className={styles.buttonCard} p="sm" radius="md">
            <Stack gap="sm">
                <Group
                    className={styles.collapseHeader}
                    justify="space-between"
                    onClick={toggle}
                    wrap="nowrap"
                >
                    <Group gap="xs">
                        <IconChevronRight
                            className={`${styles.chevron} ${opened ? styles.chevronOpen : ''}`}
                            size={16}
                        />
                        <Text c="white" fw={500} size="sm" style={{ flex: 1 }} truncate="start">
                            Button {index + 1}: {buttonTitle}
                        </Text>
                    </Group>
                    <Group gap={4} wrap="nowrap">
                        <Badge
                            color={button.type === 'external' ? 'blue' : 'cyan'}
                            size="xs"
                            variant="light"
                        >
                            {button.type}
                        </Badge>
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
                        <Select
                            allowDeselect={false}
                            classNames={{ input: styles.selectDark }}
                            data={BUTTON_TYPES_VALUES}
                            label={t('button-editor.component.type')}
                            leftSection={<TbExternalLink size={16} />}
                            onChange={(v) =>
                                onChange({
                                    ...button,
                                    type: v as TButtonType
                                })
                            }
                            value={button.type}
                        />

                        <TextInput
                            classNames={{ input: styles.inputDark }}
                            label={t('button-editor.component.link')}
                            leftSection={
                                <TemplateInfoPopoverShared
                                    templateKeys={SUBSCRIPTION_PAGE_TEMPLATE_KEYS}
                                />
                            }
                            onChange={(e) => onChange({ ...button, link: e.target.value })}
                            placeholder="https:// or app://"
                            value={button.link}
                        />

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
