import type { HotkeyItemOptions } from '@mantine/hooks'

export const HOTKEY_OPTIONS: HotkeyItemOptions = { preventDefault: true, usePhysicalKeys: true }

export const CLOSE_TAB_HOTKEY = 'alt+W'
export const ZOOM_IN_HOTKEY = 'mod+equal'
export const ZOOM_IN_SHIFT_HOTKEY = 'mod+shift+equal'
export const ZOOM_OUT_HOTKEY = 'mod+minus'
export const ZOOM_RESET_HOTKEY = 'mod+digit0'

const ZOOM_CODES = ['Digit0', 'Equal', 'Minus']

const isCloseTabHotkey = (event: KeyboardEvent): boolean =>
    event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey && event.code === 'KeyW'

const isZoomHotkey = (event: KeyboardEvent): boolean =>
    (event.ctrlKey || event.metaKey) &&
    !event.altKey &&
    ZOOM_CODES.includes(event.code) &&
    (!event.shiftKey || event.code === 'Equal')

export const isWindowHotkey = (event: KeyboardEvent): boolean =>
    isCloseTabHotkey(event) || isZoomHotkey(event)
