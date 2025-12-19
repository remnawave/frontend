import {
    ActionIcon,
    Box,
    Group,
    Popover,
    ScrollArea,
    SimpleGrid,
    Text,
    Tooltip
} from '@mantine/core'
import { TSubscriptionPageSvgLibrary } from '@remnawave/subscription-page-types'
import { IconCheck, IconPhoto, IconX } from '@tabler/icons-react'
import { useDisclosure } from '@mantine/hooks'
import { useTranslation } from 'react-i18next'
import { useMemo } from 'react'
import isSvg from 'is-svg'

import styles from '../subpage-config-visual-editor.module.css'
import { RequiredAsterisk } from './required-asterisk'

interface BaseProps {
    label?: string
    svgLibrary: TSubscriptionPageSvgLibrary
}

interface RequiredProps extends BaseProps {
    onChange: (key: string) => void
    required?: true
    value: string
}

interface OptionalProps extends BaseProps {
    onChange: (key: string | undefined) => void
    required: false
    value: string | undefined
}

type IProps = OptionalProps | RequiredProps

export function SvgIconSelect(props: IProps) {
    const { label, onChange, svgLibrary, value, required = true } = props
    const { t } = useTranslation()

    const [opened, { close, toggle }] = useDisclosure(false)

    const entries = useMemo(() => Object.entries(svgLibrary), [svgLibrary])

    const selectedSvg = value ? svgLibrary[value] : undefined
    const isValidSelectedSvg = isSvg(selectedSvg ?? '')

    const handleSelect = (key: string) => {
        onChange(key)
        close()
    }

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation()
        // Safe: handleClear is only rendered when required={false}
        ;(onChange as (key: string | undefined) => void)(undefined)
    }

    return (
        <Box>
            {label && (
                <Text c="dimmed" fw={500} mb={4} size="sm">
                    {label}
                    {required && <RequiredAsterisk />}
                </Text>
            )}
            <Popover
                offset={4}
                onDismiss={close}
                opened={opened}
                position="bottom-start"
                shadow="lg"
                width={320}
            >
                <Popover.Target>
                    <Box className={styles.iconSelectTrigger} onClick={toggle}>
                        <Group gap="sm" wrap="nowrap">
                            <Box className={styles.iconSelectPreview}>
                                {isValidSelectedSvg && selectedSvg ? (
                                    <Box
                                        className={styles.iconSelectSvg}
                                        dangerouslySetInnerHTML={{ __html: selectedSvg }}
                                    />
                                ) : (
                                    <IconPhoto color="var(--mantine-color-dimmed)" size={20} />
                                )}
                            </Box>
                            <Box style={{ flex: 1, minWidth: 0 }}>
                                <Text c={value ? 'white' : 'dimmed'} size="sm" truncate>
                                    {value || t('svg-icon-select.component.select-icon')}
                                </Text>
                            </Box>
                            {!required && value && (
                                <ActionIcon
                                    color="gray"
                                    onClick={handleClear}
                                    size="sm"
                                    variant="subtle"
                                >
                                    <IconX size={14} />
                                </ActionIcon>
                            )}
                        </Group>
                    </Box>
                </Popover.Target>

                <Popover.Dropdown className={styles.iconSelectDropdown}>
                    {entries.length === 0 ? (
                        <Box className={styles.iconSelectEmpty}>
                            <IconPhoto color="var(--mantine-color-dimmed)" size={24} />
                            <Text c="dimmed" mt="xs" size="xs">
                                {t('svg-icon-select.component.no-icons-in-library')}
                            </Text>
                        </Box>
                    ) : (
                        <ScrollArea.Autosize mah={200} styles={{ scrollbar: { width: '8px' } }}>
                            <SimpleGrid cols={5} m={10} spacing={6}>
                                {entries.map(([key, svg]) => {
                                    const isSelected = key === value

                                    return (
                                        <Tooltip
                                            key={key}
                                            label={key}
                                            openDelay={400}
                                            position="top"
                                            withArrow
                                        >
                                            <ActionIcon
                                                className={styles.iconSelectItem}
                                                data-selected={isSelected}
                                                onClick={() => handleSelect(key)}
                                                size={52}
                                                variant="subtle"
                                            >
                                                <Box
                                                    className={styles.iconSelectItemSvg}
                                                    dangerouslySetInnerHTML={{ __html: svg }}
                                                />

                                                {isSelected && (
                                                    <Box className={styles.iconSelectCheck}>
                                                        <IconCheck size={12} />
                                                    </Box>
                                                )}
                                            </ActionIcon>
                                        </Tooltip>
                                    )
                                })}
                            </SimpleGrid>
                        </ScrollArea.Autosize>
                    )}
                </Popover.Dropdown>
            </Popover>
        </Box>
    )
}
