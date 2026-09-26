import { notifications } from '@mantine/notifications'
import { FitAddon } from '@xterm/addon-fit'
import { Unicode11Addon } from '@xterm/addon-unicode11'
import { WebLinksAddon } from '@xterm/addon-web-links'
import { WebglAddon } from '@xterm/addon-webgl'
import { ITheme, Terminal } from '@xterm/xterm'
import { useEffect, useEffectEvent, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import '@xterm/xterm/css/xterm.css'

import { isWindowHotkey } from '../hotkeys'
import classes from '../NodeSshTerminal.module.css'
import { useTerminalFontSize } from '../terminal-font.store'

const TERMINAL_FONT = 'Fira Mono'
const FALLBACK_STACK = 'ui-monospace, SFMono-Regular, Menlo, monospace'
const TERMINAL_STACK = `'${TERMINAL_FONT}', ${FALLBACK_STACK}`

const THEME: ITheme = {
    background: '#1a1b26',
    black: '#15161e',
    blue: '#7aa2f7',
    brightBlack: '#414868',
    brightBlue: '#7aa2f7',
    brightCyan: '#7dcfff',
    brightGreen: '#9ece6a',
    brightMagenta: '#bb9af7',
    brightRed: '#f7768e',
    brightWhite: '#c0caf5',
    brightYellow: '#e0af68',
    cursor: '#c0caf5',
    cursorAccent: '#1a1b26',
    cyan: '#7dcfff',
    foreground: '#c0caf5',
    green: '#9ece6a',
    magenta: '#bb9af7',
    red: '#f7768e',
    selectionBackground: '#33467c',
    white: '#a9b1d6',
    yellow: '#e0af68'
}

async function loadTerminalFont(family: string): Promise<void> {
    await document.fonts.ready

    const faces = [...document.fonts].filter(
        (face) => face.family.replaceAll(/["']/gu, '') === family
    )

    if (faces.length === 0) throw new Error(`Font family "${family}" is not registered`)

    await Promise.all(faces.map((face) => face.load()))
}

function createTerminal(
    fontFamily: string,
    fontSize: number
): { fit: () => void; terminal: Terminal } {
    const terminal = new Terminal({
        allowProposedApi: true,
        cursorBlink: true,
        fontFamily,
        fontSize,
        lineHeight: 1.2,
        scrollback: 10_000,
        theme: THEME
    })

    const fitAddon = new FitAddon()
    terminal.loadAddon(fitAddon)
    terminal.loadAddon(new WebLinksAddon())
    terminal.loadAddon(new Unicode11Addon())
    terminal.unicode.activeVersion = '11'

    return {
        terminal,
        fit: () => {
            try {
                const next = fitAddon.proposeDimensions()
                if (!next) return
                if (next.cols === terminal.cols && next.rows === terminal.rows) return

                fitAddon.fit()
            } catch {
                // silence
            }
        }
    }
}

function loadRenderer(terminal: Terminal, onUnavailable: () => void): void {
    try {
        const webgl = new WebglAddon()

        webgl.onContextLoss(() => {
            webgl.dispose()
            onUnavailable()
        })

        terminal.loadAddon(webgl)
    } catch {
        onUnavailable()
    }
}

interface IProps {
    isPaused: boolean
    onInput: (data: string) => void
    onResize: (cols: number, rows: number) => void
    onTerminal: (terminal: null | Terminal) => void
}

export const TerminalView = (props: IProps) => {
    const { isPaused, onInput, onResize, onTerminal } = props
    const { t } = useTranslation()

    const warnAboutRenderer = useEffectEvent(() =>
        notifications.show({
            color: 'red',
            message:
                'This browser has no WebGL, which the terminal needs to draw. It keeps working, ' +
                'but redrawing stays noticeably slower until WebGL is enabled.',
            title: t('node-ssh.title')
        })
    )

    const fontSize = useTerminalFontSize()

    const containerRef = useRef<HTMLDivElement | null>(null)
    const fitRef = useRef<(() => void) | null>(null)
    const terminalRef = useRef<null | Terminal>(null)

    const isVisible = useEffectEvent(() => !isPaused)
    const currentFontSize = useEffectEvent(() => fontSize)

    useEffect(() => {
        if (isPaused) return

        fitRef.current?.()
        terminalRef.current?.focus()
    }, [isPaused])

    useEffect(() => {
        if (!terminalRef.current) return

        terminalRef.current.options.fontSize = fontSize
        fitRef.current?.()
    }, [fontSize])

    const handleInput = useEffectEvent((data: string) => onInput(data))
    const handleResize = useEffectEvent((cols: number, rows: number) => onResize(cols, rows))
    const handleTerminal = useEffectEvent((terminal: null | Terminal) => onTerminal(terminal))

    useEffect(() => {
        const container = containerRef.current
        if (!container) return undefined

        let terminal: Terminal | undefined
        let observer: ResizeObserver | undefined
        let frame = 0
        let disposed = false

        const swallowEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') event.stopPropagation()
        }

        const stopScrollChaining = (event: WheelEvent) => {
            if (!event.ctrlKey) event.preventDefault()
        }

        container.addEventListener('keydown', swallowEscape)
        container.addEventListener('wheel', stopScrollChaining, { passive: false })

        void (async () => {
            const fontFamily = await loadTerminalFont(TERMINAL_FONT).then(
                () => TERMINAL_STACK,
                () => FALLBACK_STACK
            )

            if (disposed) return

            const created = createTerminal(fontFamily, currentFontSize())
            terminal = created.terminal

            terminal.attachCustomKeyEventHandler((event) => !isWindowHotkey(event))
            terminal.onData((data) => handleInput(data))
            terminal.onResize(({ cols, rows }) => handleResize(cols, rows))

            terminal.open(container)
            loadRenderer(terminal, warnAboutRenderer)

            frame = requestAnimationFrame(() => {
                created.fit()
                if (isVisible()) created.terminal.focus()
                handleTerminal(created.terminal)
            })

            fitRef.current = created.fit
            terminalRef.current = created.terminal

            observer = new ResizeObserver(() => {
                if (isVisible()) created.fit()
            })
            observer.observe(container)
        })()

        return () => {
            disposed = true
            container.removeEventListener('keydown', swallowEscape)
            container.removeEventListener('wheel', stopScrollChaining)
            cancelAnimationFrame(frame)
            fitRef.current = null
            terminalRef.current = null
            observer?.disconnect()
            if (terminal) handleTerminal(null)
            terminal?.dispose()
        }
    }, [])

    return <div className={classes.terminalHost} ref={containerRef} />
}
