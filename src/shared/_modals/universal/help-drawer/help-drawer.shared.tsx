import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { Box, Center, Code, Drawer, Stack, Title, Typography } from '@mantine/core'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TbAlertCircle, TbQuestionMark } from 'react-icons/tb'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'

import { useNiceMantineModal } from '@shared/_modals/use-nice-modal'
import { LoaderModalShared } from '@shared/ui/loader-modal'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'

import classes from './help-drawer.module.css'
import { THelpDrawerAvailableScreen } from './help-drawer.types'

const SUPPORTED_LANGUAGES = new Set(['en', 'fa', 'ru', 'zh'])

const resolveDocsUrl = (screen: THelpDrawerAvailableScreen, language: string) => {
    const lang = language.split('-')[0]
    const safeLang = SUPPORTED_LANGUAGES.has(lang) ? lang : 'en'
    return `https://raw.githubusercontent.com/remnawave/panel/refs/heads/main/_panel-docs/help-articles/${safeLang}/${screen}.md`
}

interface IProps {
    screen: THelpDrawerAvailableScreen
}

export const HelpDrawerShared = NiceModal.create((props: IProps) => {
    const { screen } = props

    const { t, i18n } = useTranslation()

    const modal = useModal()
    const { modalProps } = useNiceMantineModal({ modal })

    const [content, setContent] = useState('')
    const [loading, setLoading] = useState(false)
    const [showContent, setShowContent] = useState(false)
    const [error, setError] = useState<null | string>(null)

    useEffect(() => {
        setLoading(true)

        fetch(resolveDocsUrl(screen, i18n.language))
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
    }, [screen])

    return (
        <Drawer
            {...modalProps}
            position="right"
            size="lg"
            title={
                <BaseOverlayHeader
                    iconColor="yellow"
                    IconComponent={TbQuestionMark}
                    iconVariant="soft"
                    title={t('help-action-icon.shared.help-article')}
                />
            }
        >
            {loading && <LoaderModalShared mih="80vh" />}

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
