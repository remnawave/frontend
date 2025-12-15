import {
    TSubscriptionPageBlockConfig,
    TSubscriptionPageButtonConfig,
    TSubscriptionPageLanguageCode,
    TSubscriptionPageSvgLibrary
} from '@remnawave/subscription-page-types'
import { IconChevronRight, IconPalette, IconPlus } from '@tabler/icons-react'
import { Button, Card, Drawer, Stack, Text, TextInput } from '@mantine/core'
import { useTranslation } from 'react-i18next'

import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'

import { LocalizedTextEditor } from './localized-text-editor.component'
import styles from '../subpage-config-visual-editor.module.css'
import { SubpageTooltips } from './subpage-tooltips.component'
import { SvgIconSelect } from './svg-icon-select.component'
import { ButtonEditor } from './button-editor.component'

interface IProps {
    block: null | TSubscriptionPageBlockConfig
    enabledLocales: TSubscriptionPageLanguageCode[]
    onChange: (block: TSubscriptionPageBlockConfig) => void
    onClose: () => void
    onExited?: () => void
    opened: boolean
    svgLibrary: TSubscriptionPageSvgLibrary
}

const DEFAULT_COLOR = [
    'blue',
    'cyan',
    'dark',
    'grape',
    'gray',
    'green',
    'indigo',
    'lime',
    'orange',
    'pink',
    'red',
    'teal',
    'violet',
    'yellow'
] as const

export function BlockEditorModal(props: IProps) {
    const { block, enabledLocales, onChange, onClose, onExited, opened, svgLibrary } = props
    const { t } = useTranslation()

    const firstLocale = enabledLocales[0]
    const blockTitle =
        (firstLocale && block?.title[firstLocale]) ||
        t('block-editor.modal.component.untitled-block')

    const handleAddButton = () => {
        if (!block) return
        const emptyLocalizedText = firstLocale ? { [firstLocale]: '' } : {}

        const newButton: TSubscriptionPageButtonConfig = {
            link: '',
            svgIconKey: '',
            text: emptyLocalizedText,
            type: 'external'
        }
        onChange({ ...block, buttons: [...block.buttons, newButton] })
    }

    const handleButtonChange = (
        buttonIndex: number,
        updatedButton: TSubscriptionPageButtonConfig
    ) => {
        if (!block) return
        const newButtons = [...block.buttons]
        newButtons[buttonIndex] = updatedButton
        onChange({ ...block, buttons: newButtons })
    }

    const handleButtonDelete = (buttonIndex: number) => {
        if (!block) return
        const newButtons = block.buttons.filter((_, i) => i !== buttonIndex)
        onChange({ ...block, buttons: newButtons })
    }

    const handleButtonMoveUp = (buttonIndex: number) => {
        if (!block) return
        if (buttonIndex === 0) return
        const newButtons = [...block.buttons]
        ;[newButtons[buttonIndex - 1], newButtons[buttonIndex]] = [
            newButtons[buttonIndex],
            newButtons[buttonIndex - 1]
        ]
        onChange({ ...block, buttons: newButtons })
    }

    const handleButtonMoveDown = (buttonIndex: number) => {
        if (!block) return
        if (buttonIndex >= block.buttons.length - 1) return
        const newButtons = [...block.buttons]
        ;[newButtons[buttonIndex], newButtons[buttonIndex + 1]] = [
            newButtons[buttonIndex + 1],
            newButtons[buttonIndex]
        ]
        onChange({ ...block, buttons: newButtons })
    }

    return (
        <Drawer
            keepMounted={false}
            onClose={onClose}
            onExitTransitionEnd={onExited}
            opened={opened}
            position="left"
            size="xl"
            title={
                <BaseOverlayHeader
                    IconComponent={IconChevronRight}
                    iconVariant="gradient-violet"
                    subtitle={blockTitle}
                    title={t('block-editor.modal.component.edit-block')}
                />
            }
        >
            {block && (
                <Stack gap="md">
                    <Card className={styles.sectionCard} p="md" radius="md">
                        <Stack gap="md">
                            <BaseOverlayHeader
                                IconComponent={IconPalette}
                                iconSize={16}
                                iconVariant="gradient-cyan"
                                title={t('block-editor.modal.component.block-settings')}
                                titleOrder={5}
                            />

                            <SvgIconSelect
                                label={t('block-editor.modal.component.svg-icon')}
                                onChange={(svgIconKey) => onChange({ ...block, svgIconKey })}
                                svgLibrary={svgLibrary}
                                value={block.svgIconKey}
                            />

                            <TextInput
                                classNames={{ input: styles.inputDark }}
                                label={t('block-editor.modal.component.icon-color')}
                                leftSection={
                                    <SubpageTooltips>
                                        <Text size="sm">
                                            {t('block-editor.modal.component.icon-color-help', {
                                                colors: DEFAULT_COLOR.join(', ')
                                            })}
                                        </Text>
                                    </SubpageTooltips>
                                }
                                onChange={(e) =>
                                    onChange({ ...block, svgIconColor: e.target.value })
                                }
                                value={block.svgIconColor}
                            />

                            <LocalizedTextEditor
                                enabledLocales={enabledLocales}
                                label={t('block-editor.modal.component.title')}
                                onChange={(title) => onChange({ ...block, title })}
                                value={block.title}
                            />

                            <LocalizedTextEditor
                                enabledLocales={enabledLocales}
                                label={t('block-editor.modal.component.description')}
                                multiline
                                onChange={(description) => onChange({ ...block, description })}
                                value={block.description}
                            />
                        </Stack>
                    </Card>

                    <Card className={styles.sectionCard} p="md" radius="md">
                        <Stack gap="md">
                            <BaseOverlayHeader
                                IconComponent={IconPlus}
                                iconSize={16}
                                iconVariant="gradient-teal"
                                subtitle={`${block.buttons.length} buttons`}
                                title={t('block-editor.modal.component.buttons')}
                                titleOrder={5}
                            />

                            <Stack gap="xs">
                                {block.buttons.map((button, buttonIndex) => (
                                    <ButtonEditor
                                        button={button}
                                        canMoveDown={buttonIndex < block.buttons.length - 1}
                                        canMoveUp={buttonIndex > 0}
                                        enabledLocales={enabledLocales}
                                        index={buttonIndex}
                                        key={buttonIndex}
                                        onChange={(b) => handleButtonChange(buttonIndex, b)}
                                        onDelete={() => handleButtonDelete(buttonIndex)}
                                        onMoveDown={() => handleButtonMoveDown(buttonIndex)}
                                        onMoveUp={() => handleButtonMoveUp(buttonIndex)}
                                        svgLibrary={svgLibrary}
                                    />
                                ))}

                                <Button
                                    className={styles.addButton}
                                    fullWidth
                                    leftSection={<IconPlus size={14} />}
                                    onClick={handleAddButton}
                                    variant="default"
                                >
                                    {t('block-editor.modal.component.add-button')}
                                </Button>
                            </Stack>
                        </Stack>
                    </Card>
                </Stack>
            )}
        </Drawer>
    )
}
