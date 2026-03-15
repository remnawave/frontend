import {
    alpha,
    Button,
    Center,
    ColorPicker,
    Group,
    Loader,
    Stack,
    Switch,
    TextInput
} from '@mantine/core'
import { TbCheck, TbCopy, TbDownload, TbX } from 'react-icons/tb'
import { notifications } from '@mantine/notifications'
import { useTranslation } from 'react-i18next'
import { useRef, useState } from 'react'
import { motion } from 'motion/react'
import dayjs from 'dayjs'

import { copyScreenshotToClipboard, downloadScreenshot } from '@shared/utils/copy-screenshot.util'
import { useGetRecap } from '@shared/api/hooks/system/system.query.hooks'
import { prettyBytesToAnyUtil } from '@shared/utils/bytes'
import { Logo } from '@shared/ui/logo'

import type { BgStyle, MaskableField } from './recap.constants'

import {
    BG_STYLES,
    CARD_SECTIONS,
    DEFAULT_SECTIONS,
    MASKABLE_FIELDS,
    SWATCHES
} from './recap.constants'
import classes from './recap.content.module.css'

export function RecapContent() {
    const { data: recap, isLoading } = useGetRecap()
    const { t } = useTranslation()

    const [cardKey, setCardKey] = useState(0)
    const [sections, setSections] = useState<string[]>(DEFAULT_SECTIONS)
    const [accent, setAccent] = useState(SWATCHES[0])
    const [copying, setCopying] = useState(false)
    const [downloading, setDownloading] = useState(false)
    const [maskedFields, setMaskedFields] = useState<string[]>([])
    const [customNote, setCustomNote] = useState('')
    const [bgStyle, setBgStyle] = useState<BgStyle>('solid')

    const ref = useRef<HTMLDivElement>(null)

    const copy = async () => {
        setCopying(true)
        try {
            if (!ref.current) throw new Error('ref')
            setCardKey((k) => k + 1)

            await new Promise<void>((resolve) => {
                requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
            })

            await copyScreenshotToClipboard(ref.current)
        } catch (error) {
            notifications.show({
                color: 'red',
                message: `${error instanceof Error ? error.message : 'Unknown error'}`,
                title: 'Error'
            })
        } finally {
            setCopying(false)
        }
    }

    const download = async () => {
        setDownloading(true)
        try {
            setCardKey((k) => k + 1)
            await new Promise<void>((resolve) => {
                requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
            })

            if (!ref.current) throw new Error('ref')
            await downloadScreenshot(
                ref.current,
                `remnawave-recap-${dayjs().format('YYYY-MM-DD')}.png`
            )
        } catch {
            notifications.show({
                color: 'red',
                message: 'Could not download Recap',
                title: 'Error'
            })
        } finally {
            setDownloading(false)
        }
    }

    if (isLoading || !recap) {
        return (
            <Center h={600}>
                <Loader color="cyan" size="sm" />
            </Center>
        )
    }

    const gradientLine = {
        background: `linear-gradient(90deg, transparent, ${alpha(accent, 0.3)}, transparent)`
    }

    const formatInt = (value: number) => {
        return new Intl.NumberFormat('en', {
            notation: 'compact'
        }).format(value)
    }

    const getBgOverlay = (): null | React.CSSProperties => {
        switch (bgStyle) {
            case 'dots':
                return {
                    backgroundImage: `radial-gradient(${alpha(accent, 0.12)} 1px, transparent 1px)`,
                    backgroundSize: '16px 16px'
                }
            case 'gradient':
                return {
                    background: `linear-gradient(135deg, transparent 0%, ${alpha(accent, 0.08)} 50%, transparent 100%)`
                }
            case 'grid':
                return {
                    backgroundImage: `linear-gradient(${alpha(accent, 0.06)} 1px, transparent 1px), linear-gradient(90deg, ${alpha(accent, 0.06)} 1px, transparent 1px)`,
                    backgroundSize: '24px 24px'
                }
            default:
                return null
        }
    }

    const bgOverlay = getBgOverlay()

    const MASK = '\u{1F648}'
    const m = (field: MaskableField, value: number | string | undefined) =>
        maskedFields.includes(field) ? MASK : value

    return (
        <Group align="center" gap="sm" justify="center" wrap="nowrap">
            <motion.div
                animate={{ opacity: 1, scale: 1 }}
                initial={{ opacity: 0, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            >
                <Stack gap="sm" style={{ flexShrink: 0, width: 270 }}>
                    <div className={classes.controlPanel}>
                        <div className={classes.controlLabel}>Sections</div>
                        <Stack gap="xs">
                            {CARD_SECTIONS.map((s) => (
                                <Switch
                                    checked={sections.includes(s.value)}
                                    key={s.value}
                                    label={s.label}
                                    onChange={(e) => {
                                        const { checked } = e.currentTarget
                                        setSections((prev) =>
                                            checked
                                                ? [...prev, s.value]
                                                : prev.filter((v) => v !== s.value)
                                        )
                                    }}
                                    size="sm"
                                />
                            ))}
                        </Stack>
                    </div>

                    <div className={classes.controlPanel}>
                        <div className={classes.controlLabel}>Mask fields</div>
                        <Group gap={4}>
                            {MASKABLE_FIELDS.map((f) => {
                                const active = maskedFields.includes(f.value)
                                return (
                                    <Button
                                        color={!active ? 'teal' : 'gray'}
                                        key={f.value}
                                        leftSection={
                                            !active ? <TbCheck size={16} /> : <TbX size={16} />
                                        }
                                        onClick={() =>
                                            setMaskedFields((prev) =>
                                                active
                                                    ? prev.filter((v) => v !== f.value)
                                                    : [...prev, f.value]
                                            )
                                        }
                                        radius="md"
                                        size="compact-sm"
                                        variant="soft"
                                    >
                                        {f.label}
                                    </Button>
                                )
                            })}
                        </Group>
                    </div>
                </Stack>
            </motion.div>

            <motion.div
                animate={{ opacity: 1, scale: 1 }}
                initial={{ opacity: 0, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            >
                <div
                    className={classes.card}
                    key={cardKey}
                    ref={ref}
                    style={{ border: `3px solid ${alpha(accent, 0.3)}` }}
                >
                    {dayjs(recap.initDate).isBefore('2025-04-01') && (
                        <div className={classes.ribbon} style={{ background: accent }}>
                            Early Adopter
                        </div>
                    )}

                    <div
                        className={`${classes.glow} ${classes.glowTop}`}
                        style={{ background: accent }}
                    />
                    <div
                        className={`${classes.glow} ${classes.glowBottom}`}
                        style={{ background: accent }}
                    />

                    {bgOverlay && <div className={classes.bgOverlay} style={bgOverlay} />}

                    <div className={classes.brand}>
                        <Logo size={24} style={{ color: accent }} />
                        <span className={classes.brandName}>
                            <span style={{ color: accent }}>REMNA</span>WAVE
                        </span>
                    </div>

                    <div className={classes.hero}>
                        <div className={classes.heroValue} style={{ color: accent }}>
                            {m('totalUsers', formatInt(recap.total.users))}
                        </div>
                        <div className={classes.heroLabel}>total users</div>
                    </div>

                    {sections.includes('stats') && (
                        <div className={classes.statsRow}>
                            <div className={classes.stat}>
                                <div className={classes.statValue}>
                                    {m('nodes', formatInt(recap.total.nodes))}
                                </div>
                                <div className={classes.statLabel}>nodes</div>
                            </div>
                            <div className={classes.stat}>
                                <div className={classes.statValue}>
                                    {m(
                                        'totalTraffic',
                                        prettyBytesToAnyUtil(recap.total.traffic, true)
                                    )}
                                </div>
                                <div className={classes.statLabel}>traffic</div>
                            </div>
                        </div>
                    )}

                    {sections.includes('month') && (
                        <>
                            <div className={classes.divider} style={gradientLine} />
                            <div className={classes.section}>
                                <div className={classes.sectionTitle}>
                                    {dayjs().format('MMMM YYYY')}
                                </div>
                                <div className={classes.monthGrid}>
                                    <div className={classes.monthItem}>
                                        <div className={classes.monthValue}>
                                            {m('monthUsers', formatInt(recap.thisMonth.users))}
                                        </div>
                                        <div className={classes.monthLabel}>new users</div>
                                    </div>
                                    <div className={classes.monthItem}>
                                        <div className={classes.monthValue}>
                                            {m(
                                                'monthTraffic',
                                                prettyBytesToAnyUtil(recap.thisMonth.traffic)
                                            )}
                                        </div>
                                        <div className={classes.monthLabel}>traffic</div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {sections.includes('infra') && (
                        <>
                            <div className={classes.divider} style={gradientLine} />
                            <div className={classes.section}>
                                <div className={classes.sectionTitle}>Infrastructure</div>
                                <div className={classes.infraGrid}>
                                    <div>
                                        <div className={classes.infraValue}>
                                            {m(
                                                'countries',
                                                formatInt(recap.total.distinctCountries)
                                            )}
                                        </div>
                                        <div className={classes.infraLabel}>countries</div>
                                    </div>
                                    <div>
                                        <div className={classes.infraValue}>
                                            {m('cpuCores', formatInt(recap.total.nodesCpuCores))}
                                        </div>
                                        <div className={classes.infraLabel}>CPU cores</div>
                                    </div>
                                    <div>
                                        <div className={classes.infraValue}>
                                            {m(
                                                'ram',
                                                prettyBytesToAnyUtil(recap.total.nodesRam, true)
                                            )}
                                        </div>
                                        <div className={classes.infraLabel}>RAM</div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {sections.length > 0 && (
                        <div className={classes.divider} style={gradientLine} />
                    )}

                    {customNote && (
                        <div className={classes.customNote} style={{ color: accent }}>
                            {customNote}
                        </div>
                    )}

                    <div className={classes.footer}>
                        <span className={classes.since} style={{ color: accent }}>
                            Since {dayjs(recap.initDate).format('MMM D, YYYY')}
                        </span>
                        <span
                            className={classes.version}
                            style={{
                                background: alpha(accent, 0.1),
                                color: alpha(accent, 0.7)
                            }}
                        >
                            v{recap.version}
                        </span>
                    </div>
                </div>
            </motion.div>

            <motion.div
                animate={{ opacity: 1, scale: 1 }}
                initial={{ opacity: 0, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            >
                <Stack gap="sm" style={{ flexShrink: 0, width: 270 }}>
                    <div className={classes.controlPanel}>
                        <div className={classes.controlLabel}>Background</div>
                        <Group gap={4}>
                            {BG_STYLES.map((s) => (
                                <Button
                                    color={bgStyle === s.value ? 'teal' : 'gray'}
                                    key={s.value}
                                    onClick={() => setBgStyle(s.value)}
                                    radius="md"
                                    size="compact-sm"
                                    variant="soft"
                                >
                                    {s.label}
                                </Button>
                            ))}
                        </Group>
                    </div>

                    <div className={classes.controlPanel}>
                        <div className={classes.controlLabel}>Custom note</div>
                        <TextInput
                            maxLength={40}
                            onChange={(e) => setCustomNote(e.currentTarget.value)}
                            placeholder="RW <3"
                            size="xs"
                            value={customNote}
                        />
                    </div>

                    <div className={classes.controlPanel}>
                        <div className={classes.controlLabel}>Accent color</div>
                        <ColorPicker
                            format="rgb"
                            onChange={setAccent}
                            size="md"
                            swatches={SWATCHES}
                            swatchesPerRow={8}
                            value={accent}
                            withPicker
                        />
                    </div>

                    <Group gap="xs">
                        <Button
                            color={accent}
                            fullWidth
                            leftSection={<TbCopy size={14} />}
                            loading={copying}
                            onClick={copy}
                            radius="md"
                            size="sm"
                            variant="filled"
                        >
                            {t('common.copy')}
                        </Button>
                        <Button
                            fullWidth
                            leftSection={<TbDownload size={14} />}
                            loading={downloading}
                            onClick={download}
                            radius="md"
                            size="sm"
                            variant="default"
                        >
                            {t('common.download')}
                        </Button>
                    </Group>
                </Stack>
            </motion.div>
        </Group>
    )
}
