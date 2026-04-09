import { Box, Button, ColorPicker, Group, Stack } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { TbCopy, TbDownload } from 'react-icons/tb'
import { useTranslation } from 'react-i18next'
import { useRef, useState } from 'react'
import { renderSVG } from 'uqr'

import {
    copyScreenshotToClipboard,
    downloadScreenshot,
    isScreenshotSupported
} from '@shared/utils/copy-screenshot.util'

import classes from './qr-code-builder.module.css'

const SWATCHES = [
    '#3CC9DB',
    '#A78BFA',
    '#38BDF8',
    '#FB923C',
    '#34D399',
    '#F472B6',
    '#FACC15',
    '#EF4444',
    '#2DD4BF',
    '#C084FC',
    '#FBB324',
    '#4ADE80',
    '#F97316',
    '#EC4899',
    '#6366F1',
    '#E9ECEF'
]

const BG_SWATCHES = [
    '#000000',
    '#0D1117',
    '#161B22',
    '#1A1B26',
    '#1E1E2E',
    '#1E293B',
    '#2E3440',
    '#282A36',
    '#0F172A',
    '#18181B',
    '#1C1917',
    '#172554',
    '#14532D',
    '#7F1D1D',
    '#FFFFFF',
    '#F5F5F4'
]

interface IProps {
    data: string
    title?: string
}

export function QrCodeBuilder({ data, title }: IProps) {
    const { t } = useTranslation()

    const [fgColor, setFgColor] = useState('#3CC9DB')
    const [bgColor, setBgColor] = useState('#161B22')
    const [copying, setCopying] = useState(false)
    const [downloading, setDownloading] = useState(false)

    const qrRef = useRef<HTMLDivElement>(null)

    const svgHtml = renderSVG(data, {
        whiteColor: bgColor,
        blackColor: fgColor
    })

    const handleCopy = async () => {
        if (!qrRef.current) return
        setCopying(true)
        try {
            await new Promise<void>((resolve) => {
                requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
            })
            await copyScreenshotToClipboard(qrRef.current)
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

    const handleDownload = async () => {
        if (!qrRef.current) return
        setDownloading(true)
        try {
            await new Promise<void>((resolve) => {
                requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
            })
            const filename = title ? `qr-${title}.png` : 'qr-code.png'
            await downloadScreenshot(qrRef.current, filename)
        } catch (error) {
            notifications.show({
                color: 'red',
                message: `${error instanceof Error ? error.message : 'Unknown error'}`,
                title: 'Error'
            })
        } finally {
            setDownloading(false)
        }
    }

    const leftControls = (
        <Stack gap="sm" style={{ flexShrink: 0 }}>
            <div className={classes.controlPanel}>
                <div className={classes.controlLabel}>Foreground color</div>
                <ColorPicker
                    format="hex"
                    fullWidth
                    onChange={setFgColor}
                    size="xs"
                    swatches={SWATCHES}
                    swatchesPerRow={8}
                    value={fgColor}
                    withPicker={false}
                />
            </div>

            <div className={classes.controlPanel}>
                <div className={classes.controlLabel}>Background color</div>
                <ColorPicker
                    format="hex"
                    fullWidth
                    onChange={setBgColor}
                    size="xs"
                    swatches={BG_SWATCHES}
                    swatchesPerRow={8}
                    value={bgColor}
                    withPicker={false}
                />
            </div>
        </Stack>
    )

    const centerPreview = (
        <Stack gap="xs" style={{ minWidth: 320, maxWidth: 400, flex: 1 }}>
            <Box
                ref={qrRef}
                style={{
                    position: 'relative',
                    borderRadius: 'var(--mantine-radius-md)',
                    overflow: 'hidden',
                    backgroundColor: bgColor,
                    lineHeight: 0
                }}
            >
                <div
                    dangerouslySetInnerHTML={{ __html: svgHtml }}
                    style={{ lineHeight: 0, fontSize: 0 }}
                />
            </Box>

            {isScreenshotSupported && (
                <Group gap="xs">
                    <Button
                        color={fgColor}
                        fullWidth
                        leftSection={<TbCopy size={14} />}
                        loading={copying}
                        onClick={handleCopy}
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
                        onClick={handleDownload}
                        radius="md"
                        size="sm"
                        variant="default"
                    >
                        {t('common.download')}
                    </Button>
                </Group>
            )}
        </Stack>
    )

    return (
        <Group align="flex-start" gap="md" justify="center" wrap="nowrap">
            <Box hiddenFrom="sm" w="100%">
                <Stack gap="md">
                    {centerPreview}
                    {leftControls}
                </Stack>
            </Box>

            <Group align="flex-start" gap="md" justify="center" visibleFrom="sm" wrap="nowrap">
                {leftControls}
                {centerPreview}
            </Group>
        </Group>
    )
}
