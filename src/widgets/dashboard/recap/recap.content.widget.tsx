import {
    alpha,
    Button,
    Center,
    ColorPicker,
    Divider,
    Group,
    Loader,
    Stack,
    Switch
} from '@mantine/core'
import { domToBlob, domToPng } from 'modern-screenshot'
import { notifications } from '@mantine/notifications'
import { TbCopy, TbDownload } from 'react-icons/tb'
import { useTranslation } from 'react-i18next'
import { useRef, useState } from 'react'
import { motion } from 'motion/react'
import dayjs from 'dayjs'

import { useGetRecap } from '@shared/api/hooks/system/system.query.hooks'
import { prettyBytesToAnyUtil } from '@shared/utils/bytes'
import { Logo } from '@shared/ui/logo'

import { CARD_SECTIONS, DEFAULT_SECTIONS, SWATCHES } from './recap.constants'
import classes from './recap.content.module.css'

export function RecapContent() {
    const { data: recap, isLoading } = useGetRecap()
    const { t } = useTranslation()

    const [sections, setSections] = useState<string[]>(DEFAULT_SECTIONS)
    const [accent, setAccent] = useState(SWATCHES[0])
    const [copying, setCopying] = useState(false)
    const [downloading, setDownloading] = useState(false)

    const ref = useRef<HTMLDivElement>(null)

    const getEl = async () => {
        if (!ref.current) throw new Error('ref')
        await new Promise<void>((resolve) => {
            setTimeout(resolve, 100)
        })
        return ref.current
    }

    const copy = async () => {
        setCopying(true)
        try {
            const el = await getEl()
            const blob = await domToBlob(el, {
                backgroundColor: '#08080f',
                scale: 2
            })
            if (!blob) throw new Error('blob')
            await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
        } catch {
            notifications.show({
                color: 'red',
                message: 'Could not copy Recap',
                title: 'Error'
            })
        } finally {
            setCopying(false)
        }
    }

    const download = async () => {
        setDownloading(true)
        try {
            const el = await getEl()
            const url = await domToPng(el, {
                backgroundColor: '#08080f',
                scale: 3
            })
            const a = document.createElement('a')
            a.download = `remnawave-recap-${dayjs().format('YYYY-MM-DD')}.png`
            a.href = url
            a.click()
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

    return (
        <Group align="center" gap="xl" justify="center" wrap="nowrap">
            <motion.div
                animate={{ opacity: 1, scale: 1 }}
                initial={{ opacity: 0, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            >
                <Stack gap="md" style={{ flexShrink: 0 }}>
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

                    <Divider />

                    <ColorPicker
                        format="rgb"
                        onChange={setAccent}
                        swatches={SWATCHES}
                        swatchesPerRow={8}
                        value={accent}
                        withPicker
                    />

                    <Divider />

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

            <motion.div
                animate={{ opacity: 1, scale: 1 }}
                initial={{ opacity: 0, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            >
                <div
                    className={classes.card}
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

                    <div className={classes.brand}>
                        <Logo size={24} style={{ color: accent }} />
                        <span className={classes.brandName}>
                            <span style={{ color: accent }}>REMNA</span>WAVE
                        </span>
                    </div>

                    <div className={classes.hero}>
                        <div className={classes.heroValue} style={{ color: accent }}>
                            {formatInt(recap.total.users)}
                        </div>
                        <div className={classes.heroLabel}>total users</div>
                    </div>

                    {sections.includes('stats') && (
                        <div className={classes.statsRow}>
                            <div className={classes.stat}>
                                <div className={classes.statValue}>
                                    {formatInt(recap.total.nodes)}
                                </div>
                                <div className={classes.statLabel}>nodes</div>
                            </div>
                            <div className={classes.stat}>
                                <div className={classes.statValue}>
                                    {prettyBytesToAnyUtil(recap.total.traffic, true)}
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
                                            {formatInt(recap.thisMonth.users)}
                                        </div>
                                        <div className={classes.monthLabel}>new users</div>
                                    </div>
                                    <div className={classes.monthItem}>
                                        <div className={classes.monthValue}>
                                            {prettyBytesToAnyUtil(recap.thisMonth.traffic)}
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
                                            {formatInt(recap.total.distinctCountries)}
                                        </div>
                                        <div className={classes.infraLabel}>countries</div>
                                    </div>
                                    <div>
                                        <div className={classes.infraValue}>
                                            {formatInt(recap.total.nodesCpuCores)}
                                        </div>
                                        <div className={classes.infraLabel}>CPU cores</div>
                                    </div>
                                    <div>
                                        <div className={classes.infraValue}>
                                            {prettyBytesToAnyUtil(recap.total.nodesRam, true)}
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
        </Group>
    )
}
