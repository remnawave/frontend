import { Box, Center, Code, Drawer, Stack, Title, Typography } from '@mantine/core'
import { memo, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TbAlertCircle } from 'react-icons/tb'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'

import { MODALS, useModalClose, useModalState } from '@entities/dashboard/modal-store'

import { THelpDrawerAvailableScreen } from './help-drawer.types'
import { LoaderModalShared } from '../loader-modal'
import classes from './help-drawer.module.css'

const SUPPORTED_LANGUAGES = new Set(['en', 'fa', 'ru', 'zh'])

const resolveDocsUrl = (screen: THelpDrawerAvailableScreen, language: string) => {
    const lang = language.split('-')[0]
    const safeLang = SUPPORTED_LANGUAGES.has(lang) ? lang : 'en'
    return `https://raw.githubusercontent.com/remnawave/panel/refs/heads/main/_panel-docs/help-articles/${safeLang}/${screen}.md`
}

export const HelpDrawerShared = memo(() => {
    const { t, i18n } = useTranslation()

    const { isOpen, internalState } = useModalState(MODALS.HELP_DRAWER)
    const close = useModalClose(MODALS.HELP_DRAWER)

    const [content, setContent] = useState('')
    const [loading, setLoading] = useState(false)
    const [showContent, setShowContent] = useState(false)
    const [error, setError] = useState<null | string>(null)

    useEffect(() => {
        if (!isOpen || !internalState) {
            return
        }

        setLoading(true)
        setError(null)
        setContent('')
        setShowContent(false)

        fetch(resolveDocsUrl(internalState.screen, i18n.language))
            .then((res) => {
                if (!res.ok) throw new Error(t('help-drawer.shared.failed-to-load-documentation'))
                return res.text()
            })
            .then((text) => {
                setContent(text)
            })
            .catch((err) => {
                setError(err.message)
                setLoading(false)
            })
            .finally(() => {
                setTimeout(() => {
                    setLoading(false)
                    setShowContent(true)
                }, 300)
            })
    }, [isOpen])

    const cleanContent = () => {
        setContent('')
        setShowContent(false)
        setLoading(false)
        setError(null)
    }

    return (
        <Drawer
            keepMounted={false}
            onClose={close}
            onExitTransitionEnd={cleanContent}
            opened={isOpen}
            overlayProps={{ backgroundOpacity: 0.6, blur: 0 }}
            position="right"
            size="lg"
            title={t('help-action-icon.shared.help-article')}
        >
            {loading && (
                <LoaderModalShared
                    h="80vh"
                    text={t('help-drawer.shared.loading-documentation')}
                    w="100%"
                />
            )}

            {error && (
                <Center h="80vh" w="100%">
                    <Stack align="center" gap="xs">
                        <TbAlertCircle color="var(--mantine-color-red-5)" size="4rem" />
                        <Title c="dimmed" order={4} size="lg">
                            {t('help-drawer.shared.failed-to-load-documentation')}
                        </Title>
                        <Code color="var(--mantine-color-red-light)">{error}</Code>
                    </Stack>
                </Center>
            )}

            <Box
                style={{
                    opacity: showContent ? 1 : 0,
                    pointerEvents: showContent ? 'auto' : 'none',
                    transition: 'opacity 0.3s ease'
                }}
            >
                {!loading && content && (
                    <Typography className={classes.root}>
                        <ReactMarkdown rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}>
                            {content}
                        </ReactMarkdown>
                    </Typography>
                )}
            </Box>
        </Drawer>
    )
})
