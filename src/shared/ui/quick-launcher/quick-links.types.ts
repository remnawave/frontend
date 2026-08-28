import type { ComponentType } from 'react'

export interface ILauncherPosition {
    x: number
    y: number
}

export interface IQuickLauncherRoute {
    href: string
    icon: ComponentType<{ size?: number }>
    name: string
}

export const QUICK_MODAL_IDS = ['snippets', 'sshTerminal'] as const

export type TQuickModalId = (typeof QUICK_MODAL_IDS)[number]

export const QUICK_ICON_NAMES = [
    'TbExternalLink',
    'TbLink',
    'TbWorld',
    'TbChartLine',
    'TbChartArcs',
    'TbActivity',
    'TbGauge',
    'TbServer',
    'TbDatabase',
    'TbCloud',
    'TbBrandDocker',
    'TbBrandGithub',
    'TbBrandTelegram',
    'TbMail',
    'TbBell',
    'TbBook',
    'TbUsers',
    'TbUser',
    'TbKey',
    'TbLock',
    'TbShieldLock',
    'TbTerminal2',
    'TbCode',
    'TbBug',
    'TbFlame',
    'TbStar',
    'TbRocket',
    'TbBolt',
    'TbFolder',
    'TbCalendar',
    'TbCreditCard',
    'TbRadar',
    'TbNumber1',
    'TbNumber2',
    'TbNumber3',
    'TbNumber4',
    'TbNumber5',
    'TbNumber6',
    'TbNumber7',
    'TbNumber8',
    'TbNumber9'
] as const

export type TQuickIconName = (typeof QUICK_ICON_NAMES)[number]

export const DEFAULT_QUICK_ICON: TQuickIconName = 'TbExternalLink'

export const MAX_QUICK_LINKS = 12
export const MAX_QUICK_COLUMNS = 12
export const MAX_QUICK_LABEL = 40

export type TQuickLink =
    | { icon: TQuickIconName; kind: 'external'; label: string; url: string }
    | { id: TQuickModalId; kind: 'modal' }
    | { kind: 'route'; path: string }

export function isSafeExternalUrl(value: string): boolean {
    try {
        const url = new URL(value)

        return url.protocol === 'https:' && !url.username && !url.password
    } catch {
        return false
    }
}

export function sanitizeLauncherColumns(value: unknown): null | number {
    if (!Number.isInteger(value)) return null

    return Math.min(Math.max(value as number, 1), MAX_QUICK_COLUMNS)
}

export function sanitizeLauncherPosition(value: unknown): ILauncherPosition | null {
    if (typeof value !== 'object' || value === null) return null

    const { x, y } = value as Partial<ILauncherPosition>
    if (!Number.isFinite(x) || !Number.isFinite(y)) return null

    return { x: x as number, y: y as number }
}

function isQuickModalId(value: unknown): value is TQuickModalId {
    return QUICK_MODAL_IDS.includes(value as TQuickModalId)
}

function isQuickIconName(value: unknown): value is TQuickIconName {
    return QUICK_ICON_NAMES.includes(value as TQuickIconName)
}

export function sanitizeQuickLinks(value: unknown): TQuickLink[] {
    if (!Array.isArray(value)) return []

    const out: TQuickLink[] = []

    value.forEach((item) => {
        if (out.length >= MAX_QUICK_LINKS) return

        if (typeof item !== 'object' || item === null) return

        const link = item as Record<string, unknown>
        const kind = link.kind === 'builtin' ? 'modal' : link.kind

        if (kind === 'modal') {
            if (isQuickModalId(link.id)) out.push({ id: link.id, kind: 'modal' })

            return
        }

        if (kind === 'route') {
            if (typeof link.path === 'string' && link.path.startsWith('/')) {
                out.push({ kind: 'route', path: link.path })
            }

            return
        }

        if (kind !== 'external') return
        if (typeof link.url !== 'string' || !isSafeExternalUrl(link.url)) return
        if (typeof link.label !== 'string') return

        const label = link.label.trim().slice(0, MAX_QUICK_LABEL)
        if (label.length === 0) return

        out.push({
            icon: isQuickIconName(link.icon) ? link.icon : DEFAULT_QUICK_ICON,
            kind: 'external',
            label,
            url: link.url
        })
    })

    return out
}

export const DEFAULT_QUICK_LINKS: TQuickLink[] = []
