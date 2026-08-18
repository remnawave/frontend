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
import clsx from 'clsx'
import { githubDarkTheme, JsonEditor } from 'json-edit-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
    TbArrowsMaximize,
    TbArrowsMinimize,
    TbBrandGithub,
    TbCode,
    TbDownload,
    TbEye,
    TbPhoto,
    TbRefresh
} from 'react-icons/tb'

import { usePseudoFullscreen } from '@shared/hooks'
import { fullscreenClasses } from '@shared/ui/fullscreen-toggle-button'

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

    const { isFullscreen, toggle: toggleFullscreen } = usePseudoFullscreen()

    const imageSrc = useMemo(() => {
        if (!result.image) return null

        return `data:${result.image.media_type};base64,${result.image.data}`
    }, [result.image])

    const handleDownload = () => {
        if (!imageSrc) return

        const link = document.createElement('a')
        link.href = imageSrc
        link.download = `geocheck-${result.nodeUuid}.svg`
        link.click()
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
                        <ActionIcon onClick={handleDownload} variant="default" size="lg">
                            <TbDownload size={18} />
                        </ActionIcon>
                    )}

                    <Tooltip label={t('common.refresh')}>
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
                <Box className={classes.canvas} display={view === 'image' ? 'flex' : 'none'}>
                    {imageSrc ? (
                        <img
                            alt="geocheck"
                            className={classes.image}
                            src={imageSrc}
                            style={{ width: `100%` }}
                        />
                    ) : (
                        <Button
                            leftSection={<TbPhoto size={18} />}
                            onClick={() => setView('json')}
                            variant="subtle"
                        >
                            {t('node-geocheck.no-image')}
                        </Button>
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
