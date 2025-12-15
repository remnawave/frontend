import { ActionIcon, Box, Group, Popover, SimpleGrid, Text, Tooltip } from '@mantine/core'
import { TSubscriptionPageSvgLibrary } from '@remnawave/subscription-page-types'
import { IconCheck, IconPhoto } from '@tabler/icons-react'
import { useDisclosure } from '@mantine/hooks'
import { useTranslation } from 'react-i18next'
import { useMemo } from 'react'
import isSvg from 'is-svg'

import styles from '../subpage-config-visual-editor.module.css'
import { RequiredAsterisk } from './required-asterisk'

interface IProps {
    label?: string
    onChange: (key: string) => void
    svgLibrary: TSubscriptionPageSvgLibrary
    value: string
}

export function SvgIconSelect(props: IProps) {
    const { label, onChange, svgLibrary, value } = props
    const { t } = useTranslation()

    const [opened, { close, toggle }] = useDisclosure(false)

    const entries = useMemo(() => Object.entries(svgLibrary), [svgLibrary])

    const selectedSvg = svgLibrary[value]
    const isValidSelectedSvg = isSvg(selectedSvg ?? '')

    const handleSelect = (key: string) => {
        onChange(key)
        close()
    }

    return (
        <Box>
            {label && (
                <Text c="dimmed" fw={500} mb={4} size="sm">
                    {label}
                    <RequiredAsterisk />
                </Text>
            )}
            <Popover
                offset={4}
                onClose={close}
                opened={opened}
                position="bottom-start"
                shadow="lg"
                width={320}
            >
                <Popover.Target>
                    <Box className={styles.iconSelectTrigger} onClick={toggle}>
                        <Group gap="sm" wrap="nowrap">
                            <Box className={styles.iconSelectPreview}>
                                {isValidSelectedSvg ? (
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
                        <SimpleGrid cols={5} spacing={6}>
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
                    )}
                </Popover.Dropdown>
            </Popover>
        </Box>
    )
}
