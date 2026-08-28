import type { ILauncherPosition, IQuickLauncherRoute, TQuickLink } from './quick-links.types'
import type { SetFloatingWindowPosition } from '@mantine/hooks'

import { ActionIcon, FloatingWindow } from '@mantine/core'
import {
    CSSProperties,
    ComponentType,
    useCallback,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState
} from 'react'
import { useTranslation } from 'react-i18next'
import { TbArrowsMove, TbGripHorizontal, TbPlus, TbSettings } from 'react-icons/tb'
import { useNavigate } from 'react-router'

import { showModal } from '@shared/_modals/show-modal'
import { registerScrollLockShard } from '@shared/utils/scroll-lock-shards'

import {
    useExperimentalFeature,
    useExperimentalFeatures,
    useLauncherColumns,
    useLauncherPosition,
    useQuickLinks,
    useViewPreferencesStoreActions
} from '@entities/dashboard/view-preferences-store'

import { QUICK_ICONS, QUICK_MODALS } from './quick-links.catalog'
import { isSafeExternalUrl, MAX_QUICK_COLUMNS } from './quick-links.types'
import classes from './QuickLauncher.module.css'

const OFFSET = 5
const AUTO_COLUMNS = 3
const CELL_SIZE = 58
const HEADER_HEIGHT = 29
const HOLD_DELAY = 320
const HOLD_TOLERANCE = 6

interface IProps {
    routes: IQuickLauncherRoute[]
}

interface IResolvedLink {
    Icon: ComponentType<{ size?: number }>
    key: string
    label: string
    run: () => void
}

export const QuickLauncher = ({ routes }: IProps) => {
    const { t } = useTranslation()
    const navigate = useNavigate()

    const isEnabled = useExperimentalFeature('quickLauncher')
    const experimental = useExperimentalFeatures()

    const storedPosition = useLauncherPosition()
    const storedColumns = useLauncherColumns()
    const links = useQuickLinks()
    const { setLauncherColumns, setLauncherPosition } = useViewPreferencesStoreActions()

    const positionRef = useRef<ILauncherPosition | null>(null)
    const nodeRef = useRef<HTMLDivElement | null>(null)
    const setPositionRef = useRef<null | SetFloatingWindowPosition>(null)
    const pendingShiftRef = useRef(0)
    const grabRef = useRef<null | {
        offsetX: number
        offsetY: number
        pointerId: number
        startX: number
        startY: number
    }>(null)
    const holdTimerRef = useRef<null | number>(null)
    const suppressClickRef = useRef(false)

    const [isHeaderVisible, setIsHeaderVisible] = useState(false)
    const [isGrabbing, setIsGrabbing] = useState(false)

    const cancelHold = () => {
        if (holdTimerRef.current === null) return

        window.clearTimeout(holdTimerRef.current)
        holdTimerRef.current = null
    }

    const toggleHeader = (isPinned: boolean) => {
        pendingShiftRef.current = isPinned ? 0 : isHeaderVisible ? HEADER_HEIGHT : -HEADER_HEIGHT
        setIsHeaderVisible(!isHeaderVisible)
    }

    useLayoutEffect(() => {
        const shift = pendingShiftRef.current
        const node = nodeRef.current

        pendingShiftRef.current = 0

        if (!shift || !node) return

        const rect = node.getBoundingClientRect()

        setPositionRef.current?.({ left: rect.left, top: rect.top + shift })
    }, [isHeaderVisible])

    const registerShard = useCallback((node: HTMLDivElement | null) => {
        nodeRef.current = node

        return node ? registerScrollLockShard(node) : undefined
    }, [])

    const commitPosition = () => {
        if (positionRef.current) setLauncherPosition(positionRef.current)
    }

    const openEditor = () => showModal('quickLinksModal', { routes })

    const handleResizeMove = (event: React.PointerEvent<HTMLDivElement>) => {
        const node = nodeRef.current
        if (!node || !event.currentTarget.hasPointerCapture(event.pointerId)) return

        const { left } = node.getBoundingClientRect()
        const room = Math.max(Math.floor((window.innerWidth - left) / CELL_SIZE), 1)
        const next = Math.min(
            Math.max(Math.round((event.clientX - left) / CELL_SIZE), 1),
            Math.min(MAX_QUICK_COLUMNS, room)
        )

        if (next !== preferredColumns) setLauncherColumns(next)
    }

    const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
        if (event.button !== 0) return

        const node = nodeRef.current
        if (!node) return
        if (event.target instanceof Element && event.target.closest(`.${classes.header}`)) return

        const rect = node.getBoundingClientRect()

        grabRef.current = {
            offsetX: event.clientX - rect.left,
            offsetY: event.clientY - rect.top,
            pointerId: event.pointerId,
            startX: event.clientX,
            startY: event.clientY
        }

        holdTimerRef.current = window.setTimeout(() => {
            holdTimerRef.current = null

            node.setPointerCapture(event.pointerId)
            setIsGrabbing(true)
        }, HOLD_DELAY)
    }

    const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
        const grab = grabRef.current
        const node = nodeRef.current
        if (!grab || !node || grab.pointerId !== event.pointerId) return

        if (holdTimerRef.current !== null) {
            const moved = Math.hypot(event.clientX - grab.startX, event.clientY - grab.startY)
            if (moved > HOLD_TOLERANCE) cancelHold()

            return
        }

        if (!isGrabbing) return

        const rect = node.getBoundingClientRect()
        const left = Math.min(
            Math.max(event.clientX - grab.offsetX, 0),
            window.innerWidth - rect.width
        )
        const top = Math.min(
            Math.max(event.clientY - grab.offsetY, 0),
            window.innerHeight - rect.height
        )

        node.style.left = `${left}px`
        node.style.top = `${top}px`
    }

    const releaseGrab = () => {
        cancelHold()
        grabRef.current = null
        setIsGrabbing(false)
    }

    useEffect(() => cancelHold, [])

    useEffect(() => {
        const handleViewportResize = () => {
            const node = nodeRef.current
            if (!node) return

            const rect = node.getBoundingClientRect()

            setPositionRef.current?.({ left: rect.left, top: rect.top })
        }

        window.addEventListener('resize', handleViewportResize)

        return () => window.removeEventListener('resize', handleViewportResize)
    }, [])

    const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
        const grab = grabRef.current
        const node = nodeRef.current
        if (!grab || grab.pointerId !== event.pointerId) return

        cancelHold()
        grabRef.current = null

        if (!isGrabbing || !node) return

        node.releasePointerCapture(event.pointerId)
        setIsGrabbing(false)
        suppressClickRef.current = true
        window.setTimeout(() => {
            suppressClickRef.current = false
        }, 0)

        const rect = node.getBoundingClientRect()

        setPositionRef.current?.({ left: rect.left, top: rect.top })
        setLauncherPosition({ x: rect.left, y: rect.top })
    }

    const routeCatalog = useMemo(
        () => new Map(routes.map((route) => [route.href, route])),
        [routes]
    )

    const resolved = useMemo<IResolvedLink[]>(() => {
        const out: IResolvedLink[] = []

        links.forEach((link: TQuickLink, index) => {
            if (link.kind === 'modal') {
                const entry = QUICK_MODALS[link.id]
                if (entry.experimental && !experimental[entry.experimental]) return

                out.push({
                    Icon: entry.Icon,
                    key: `modal-${link.id}-${index}`,
                    label: t(entry.labelKey),
                    run: entry.open
                })

                return
            }

            if (link.kind === 'route') {
                const entry = routeCatalog.get(link.path)
                if (!entry) return

                out.push({
                    Icon: entry.icon,
                    key: `route-${index}-${link.path}`,
                    label: entry.name,
                    run: () => navigate(link.path)
                })

                return
            }

            if (!isSafeExternalUrl(link.url)) return

            out.push({
                Icon: QUICK_ICONS[link.icon],
                key: `external-${index}-${link.url}`,
                label: link.label,
                run: () => window.open(link.url, '_blank', 'noopener,noreferrer')
            })
        })

        return out
    }, [links, experimental, routeCatalog, navigate, t])

    if (!isEnabled) return null

    const preferredColumns = storedColumns
        ? Math.min(Math.max(storedColumns, 1), MAX_QUICK_COLUMNS)
        : AUTO_COLUMNS
    const columns = Math.min(preferredColumns, Math.max(resolved.length, 1))
    const showHeader = isHeaderVisible || resolved.length === 0

    return (
        <FloatingWindow
            className={classes.window}
            constrainOffset={0}
            constrainToViewport
            dragHandleSelector={`.${classes.header}`}
            excludeDragHandleSelector="button"
            initialPosition={
                storedPosition
                    ? { left: storedPosition.x, top: storedPosition.y }
                    : { bottom: OFFSET, left: OFFSET }
            }
            onContextMenu={(event) => {
                event.preventDefault()
                toggleHeader(resolved.length === 0)
            }}
            onDragEnd={commitPosition}
            onLostPointerCapture={releaseGrab}
            onPointerCancel={releaseGrab}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPositionChange={(next) => {
                positionRef.current = next
            }}
            radius={14}
            ref={registerShard}
            setPositionRef={setPositionRef}
            style={
                {
                    '--cell': `${CELL_SIZE}px`,
                    '--columns': columns,
                    '--header-height': `${HEADER_HEIGHT}px`
                } as CSSProperties
            }
            zIndex={460}
            withinPortal
        >
            {isGrabbing && (
                <div className={classes.grabOverlay}>
                    <TbArrowsMove size={22} />
                </div>
            )}

            {showHeader && (
                <div
                    className={classes.resizer}
                    onPointerDown={(event) => {
                        event.currentTarget.setPointerCapture(event.pointerId)
                        event.stopPropagation()
                    }}
                    onPointerMove={handleResizeMove}
                    onPointerUp={(event) =>
                        event.currentTarget.releasePointerCapture(event.pointerId)
                    }
                />
            )}

            {showHeader && (
                <div className={classes.header}>
                    <TbGripHorizontal size={16} />

                    <ActionIcon
                        className={classes.settings}
                        color="gray"
                        onClick={openEditor}
                        size="xs"
                        variant="subtle"
                    >
                        <TbSettings size={13} />
                    </ActionIcon>
                </div>
            )}

            {resolved.length === 0 ? (
                <button className={classes.empty} onClick={openEditor} type="button">
                    <TbPlus size={20} />
                </button>
            ) : (
                <div className={classes.grid}>
                    {resolved.map((item) => (
                        <button
                            className={classes.item}
                            key={item.key}
                            onClick={() => {
                                if (suppressClickRef.current) {
                                    suppressClickRef.current = false
                                    return
                                }

                                item.run()
                            }}
                            type="button"
                        >
                            <item.Icon size={20} />
                        </button>
                    ))}
                </div>
            )}
        </FloatingWindow>
    )
}
