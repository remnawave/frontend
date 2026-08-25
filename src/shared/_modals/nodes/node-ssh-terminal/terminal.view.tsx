import { CanvasAddon } from '@xterm/addon-canvas'
import { FitAddon } from '@xterm/addon-fit'
import { Unicode11Addon } from '@xterm/addon-unicode11'
import { loadFonts, WebFontsAddon } from '@xterm/addon-web-fonts'
import { WebLinksAddon } from '@xterm/addon-web-links'
import { WebglAddon } from '@xterm/addon-webgl'
import { ITheme, Terminal } from '@xterm/xterm'
import { useEffect, useEffectEvent, useRef } from 'react'
import '@xterm/xterm/css/xterm.css'

import classes from './NodeSshTerminal.module.css'

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

function createTerminal(fontFamily: string): { fit: () => void; terminal: Terminal } {
    const terminal = new Terminal({
        allowProposedApi: true,
        cursorBlink: true,
        fontFamily,
        fontSize: 13,
        lineHeight: 1.2,
        scrollback: 10_000,
        theme: THEME
    })

    const fitAddon = new FitAddon()
    terminal.loadAddon(fitAddon)
    terminal.loadAddon(new WebLinksAddon())
    terminal.loadAddon(new Unicode11Addon())
    terminal.loadAddon(new WebFontsAddon())
    terminal.unicode.activeVersion = '11'

    return {
        terminal,
        fit: () => {
            try {
                fitAddon.fit()
            } catch {
                // silence
            }
        }
    }
}

function loadRenderer(terminal: Terminal): void {
    try {
        const webgl = new WebglAddon()
        webgl.onContextLoss(() => {
            webgl.dispose()
            terminal.loadAddon(new CanvasAddon())
        })
        terminal.loadAddon(webgl)
    } catch {
        terminal.loadAddon(new CanvasAddon())
    }
}

interface IProps {
    onInput: (data: string) => void
    onReady: (terminal: Terminal) => void
    onResize: (cols: number, rows: number) => void
}

export const TerminalView = (props: IProps) => {
    const { onInput, onReady, onResize } = props

    const containerRef = useRef<HTMLDivElement | null>(null)

    const handleInput = useEffectEvent((data: string) => onInput(data))
    const handleResize = useEffectEvent((cols: number, rows: number) => onResize(cols, rows))
    const handleReady = useEffectEvent((terminal: Terminal) => onReady(terminal))

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
        container.addEventListener('keydown', swallowEscape)

        void (async () => {
            const fontFamily = await loadFonts([TERMINAL_FONT]).then(
                () => TERMINAL_STACK,
                () => FALLBACK_STACK
            )

            if (disposed) return

            const created = createTerminal(fontFamily)
            terminal = created.terminal

            terminal.onData((data) => handleInput(data))
            terminal.onResize(({ cols, rows }) => handleResize(cols, rows))

            terminal.open(container)
            loadRenderer(terminal)

            frame = requestAnimationFrame(() => {
                created.fit()
                created.terminal.focus()
                handleReady(created.terminal)
            })

            observer = new ResizeObserver(() => created.fit())
            observer.observe(container)
        })()

        return () => {
            disposed = true
            container.removeEventListener('keydown', swallowEscape)
            cancelAnimationFrame(frame)
            observer?.disconnect()
            terminal?.dispose()
        }
    }, [])

    return <div className={classes.terminalHost} ref={containerRef} />
}
