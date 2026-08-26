import type { GeocheckResult } from './use-node-geocheck'

import {
    ActionIcon,
    Anchor,
    Box,
    Button,
    Center,
    Group,
    SegmentedControl,
    Stack,
    Tooltip
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import clsx from 'clsx'
import { githubDarkTheme, JsonEditor } from 'json-edit-react'
import { useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
    TbArrowsMaximize,
    TbArrowsMinimize,
    TbBrandGithub,
    TbCode,
    TbCopy,
    TbDownload,
    TbEye,
    TbPhoto,
    TbRefresh
} from 'react-icons/tb'

import { usePseudoFullscreen } from '@shared/hooks'
import { fullscreenClasses } from '@shared/ui/fullscreen-toggle-button'
import { ZoomableImage } from '@shared/ui/zoomable-image'
import {
    copyImageScreenshotToClipboard,
    downloadImageScreenshot
} from '@shared/utils/copy-screenshot.util'

import classes from './GeocheckResult.module.css'

const GEOCHECK_REPO_URL = 'https://github.com/remnawave/geocheck'

interface IProps {
    onRestart: () => void
    result: GeocheckResult
}

export const GeocheckResultWidget = (props: IProps) => {
    const { onRestart, result } = props
    const { t } = useTranslation()

    const [view, setView] = useState<'image' | 'json'>('image')
    const [copying, setCopying] = useState(false)
    const [downloading, setDownloading] = useState(false)

    const imageRef = useRef<HTMLImageElement>(null)

    const { isFullscreen, toggle: toggleFullscreen } = usePseudoFullscreen()

    const imageSrc = useMemo(() => {
        if (!result.image) return null

        return `data:${result.image.media_type};base64,${result.image.data}`
    }, [result.image])

    const showError = (error: unknown) => {
        notifications.show({
            color: 'red',
            message: `${error instanceof Error ? error.message : 'Unknown error'}`,
            title: 'Error'
        })
    }

    const filename = `geocheck-${result.nodeUuid}.png`

    const resolveImage = () => {
        if (!imageRef.current) throw new Error('imageRef')

        return imageRef.current
    }

    const handleCopy = async () => {
        setCopying(true)
        try {
            await copyImageScreenshotToClipboard(resolveImage(), filename)
        } catch (error) {
            showError(error)
        } finally {
            setCopying(false)
        }
    }

    const handleDownload = async () => {
        setDownloading(true)
        try {
            await downloadImageScreenshot(resolveImage(), filename)
        } catch (error) {
            showError(error)
        } finally {
            setDownloading(false)
        }
    }

    return (
        <Stack className={clsx(isFullscreen && fullscreenClasses.overlay)} gap="sm">
            <Group gap="xs" justify="space-between" wrap="nowrap">
                <SegmentedControl
                    data={[
                        {
                            value: 'image',
                            label: (
                                <Center style={{ gap: 10 }}>
                                    <TbEye size={18} />
                                    <span>{t('node-geocheck.view-image')}</span>
                                </Center>
                            )
                        },
                        {
                            value: 'json',
                            label: (
                                <Center style={{ gap: 10 }}>
                                    <TbCode size={18} />
                                    <span>JSON</span>
                                </Center>
                            )
                        }
                    ]}
                    onChange={(next) => setView(next as 'image' | 'json')}
                    size="sm"
                    value={view}
                />

                <Group gap="xs" wrap="nowrap">
                    <ActionIcon variant="default" onClick={toggleFullscreen} size="lg">
                        {isFullscreen ? (
                            <TbArrowsMinimize size={18} />
                        ) : (
                            <TbArrowsMaximize size={18} />
                        )}
                    </ActionIcon>

                    {view === 'image' && imageSrc && (
                        <>
                            <Tooltip label={t('common.action.copy')}>
                                <ActionIcon
                                    loading={copying}
                                    onClick={handleCopy}
                                    size="lg"
                                    variant="default"
                                >
                                    <TbCopy size={18} />
                                </ActionIcon>
                            </Tooltip>

                            <Tooltip label={t('common.action.download')}>
                                <ActionIcon
                                    loading={downloading}
                                    onClick={handleDownload}
                                    size="lg"
                                    variant="default"
                                >
                                    <TbDownload size={18} />
                                </ActionIcon>
                            </Tooltip>
                        </>
                    )}

                    <Tooltip label={t('common.action.refresh')}>
                        <ActionIcon color="teal" onClick={onRestart} size="lg" variant="soft">
                            <TbRefresh size={18} />
                        </ActionIcon>
                    </Tooltip>
                </Group>
            </Group>

            <Box
                className={clsx(
                    classes.viewport,
                    isFullscreen && classes.fullscreenViewport,
                    isFullscreen && fullscreenClasses.fill
                )}
                pos="relative"
            >
                <Box className={classes.imageArea} display={view === 'image' ? 'block' : 'none'}>
                    {imageSrc ? (
                        <ZoomableImage alt="geocheck" ref={imageRef} src={imageSrc} />
                    ) : (
                        <Center className={classes.canvas}>
                            <Button
                                leftSection={<TbPhoto size={18} />}
                                onClick={() => setView('json')}
                                variant="subtle"
                            >
                                {t('node-geocheck.no-image')}
                            </Button>
                        </Center>
                    )}
                </Box>

                <Box display={view === 'json' ? 'block' : 'none'} p="xs">
                    <JsonEditor
                        collapse={2}
                        data={result.rawReport ?? {}}
                        indent={4}
                        maxWidth="100%"
                        rootName=""
                        theme={githubDarkTheme}
                        viewOnly
                    />
                </Box>
            </Box>

            <Group gap={6} justify="flex-end">
                <Anchor
                    c="dimmed"
                    href={GEOCHECK_REPO_URL}
                    rel="noopener noreferrer"
                    size="xs"
                    target="_blank"
                    underline="never"
                >
                    <Group gap={4} wrap="nowrap">
                        <TbBrandGithub size={14} />
                        Powered by GeoCheck
                    </Group>
                </Anchor>
            </Group>
        </Stack>
    )
}
