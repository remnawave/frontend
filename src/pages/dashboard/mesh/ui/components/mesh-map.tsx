import { Badge, Group, Text, useMantineTheme } from '@mantine/core'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { MeshStatus } from '@shared/api/hooks'

import { ui } from '../labels'

type Link = {
    a: string
    b: string
    rttAB?: number | null
    rttBA?: number | null
    state: 'asym' | 'down' | 'ok'
}

const W = 600
const H = 330
const MAX_WIDTH = 680 // the map must not grow with the page: nodes and labels stay readable, not huge

/** Live map of the overlay: nodes on a ring (entries on the left, exits on the right), links coloured by health. */
export function MeshMap({ status }: { status: MeshStatus }) {
    useTranslation()
    const theme = useMantineTheme()
    const [hover, setHover] = useState<null | string>(null)
    const nodes = status.topology.nodes

    const { pos, links } = useMemo(() => {
        const entries = nodes.filter((n) => n.role === 'entry')
        const exits = nodes.filter((n) => n.role !== 'entry')
        const p: Record<string, { x: number; y: number }> = {}
        entries.forEach((n, i) => {
            p[n.name] = { x: 70, y: H / 2 + (i - (entries.length - 1) / 2) * 100 }
        })
        exits.forEach((n, i) => {
            const t = exits.length === 1 ? 0.5 : i / (exits.length - 1)
            const ang = -Math.PI / 2.3 + t * ((Math.PI * 2) / 2.3)
            p[n.name] = { x: 400 + Math.cos(ang) * 150, y: H / 2 + Math.sin(ang) * 128 }
        })
        const ls: Link[] = []
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const a = nodes[i].name
                const b = nodes[j].name
                const ab = status.overlay.obs[a]?.[b]
                const ba = status.overlay.obs[b]?.[a]
                if (!ab && !ba) continue
                const state: Link['state'] =
                    ab?.ok && ba?.ok ? 'ok' : ab?.ok || ba?.ok ? 'asym' : 'down'
                ls.push({ a, b, rttAB: ab?.rtt, rttBA: ba?.rtt, state })
            }
        }
        return { links: ls, pos: p }
    }, [nodes, status.overlay.obs])

    // transit routes: A -> via -> D, drawn on top
    const transits = useMemo(() => {
        const out: { from: string; via: string; to: string }[] = []
        for (const [from, routes] of Object.entries(status.overlay.route)) {
            for (const [to, via] of Object.entries(routes)) out.push({ from, to, via })
        }
        return out
    }, [status.overlay.route])

    const color = (s: Link['state']) =>
        s === 'ok'
            ? theme.colors.teal[6]
            : s === 'asym'
              ? theme.colors.yellow[6]
              : theme.colors.red[6]
    const touches = (l: Link) => hover === null || l.a === hover || l.b === hover

    return (
        <div>
            <style>{`
                @keyframes mesh-flow { to { stroke-dashoffset: -24; } }
                @keyframes mesh-pulse { 0%,100% { opacity: .35; } 50% { opacity: 1; } }
                .mesh-link-ok { stroke-dasharray: 6 6; animation: mesh-flow 1.4s linear infinite; }
                .mesh-leader { animation: mesh-pulse 1.8s ease-in-out infinite; }
                @media (prefers-reduced-motion: reduce) { .mesh-link-ok, .mesh-leader { animation: none; } }
            `}</style>
            <svg
                aria-label={ui('mesh-link-map')}
                role="img"
                style={{ display: 'block', height: 'auto', margin: '0 auto', maxWidth: MAX_WIDTH }}
                viewBox={`0 0 ${W} ${H}`}
                width="100%"
            >
                {links.map((l) => {
                    const A = pos[l.a]
                    const B = pos[l.b]
                    if (!A || !B) return null
                    const rtt = Math.round(((l.rttAB ?? l.rttBA) as number) || 0)
                    return (
                        <g
                            key={`${l.a}-${l.b}`}
                            opacity={hover === null ? 0.65 : touches(l) ? 1 : 0.1}
                        >
                            <line
                                className={l.state === 'ok' ? 'mesh-link-ok' : undefined}
                                stroke={color(l.state)}
                                strokeDasharray={l.state === 'ok' ? undefined : '3 5'}
                                strokeWidth={l.state === 'ok' ? 1.2 : 1.8}
                                x1={A.x}
                                x2={B.x}
                                y1={A.y}
                                y2={B.y}
                            />
                            {hover !== null && touches(l) && l.state === 'ok' && rtt > 0 && (
                                <text
                                    fill={theme.colors.gray[6]}
                                    fontSize="8.5"
                                    textAnchor="middle"
                                    x={(A.x + B.x) / 2}
                                    y={(A.y + B.y) / 2 - 3}
                                >
                                    {rtt} {ui('ms')}{' '}
                                </text>
                            )}
                        </g>
                    )
                })}

                {transits.map((t) => {
                    const A = pos[t.from]
                    const V = pos[t.via]
                    const B = pos[t.to]
                    if (!A || !V || !B) return null
                    return (
                        <polyline
                            fill="none"
                            key={`${t.from}-${t.to}`}
                            opacity={0.85}
                            points={`${A.x},${A.y} ${V.x},${V.y} ${B.x},${B.y}`}
                            stroke={theme.colors.blue[5]}
                            strokeDasharray="2 4"
                            strokeWidth={2.2}
                        />
                    )
                })}

                {nodes.map((n) => {
                    const P = pos[n.name]
                    if (!P) return null
                    const alive = n.agent_age != null && n.agent_age < 60
                    const fill = !alive
                        ? theme.colors.red[7]
                        : n.role === 'entry'
                          ? theme.colors.violet[6]
                          : theme.colors.cyan[7]
                    return (
                        <g
                            key={n.name}
                            tabIndex={0}
                            role="img"
                            aria-label={`${n.name}: ${alive ? ui('agent-healthy') : ui('no-response')}`}
                            onFocus={() => setHover(n.name)}
                            onBlur={() => setHover(null)}
                            onMouseEnter={() => setHover(n.name)}
                            onMouseLeave={() => setHover(null)}
                            style={{ cursor: 'default' }}
                        >
                            {n.etcd && (
                                <circle
                                    className={n.leader ? 'mesh-leader' : undefined}
                                    cx={P.x}
                                    cy={P.y}
                                    fill="none"
                                    r={22}
                                    stroke={
                                        n.leader ? theme.colors.yellow[5] : theme.colors.gray[5]
                                    }
                                    strokeWidth={n.leader ? 3 : 1.6}
                                />
                            )}
                            <circle cx={P.x} cy={P.y} fill={fill} r={17} />
                            {n.relay && (
                                <circle
                                    cx={P.x + 13}
                                    cy={P.y - 13}
                                    fill={theme.colors.orange[5]}
                                    r={5}
                                />
                            )}
                            <text
                                fill="#fff"
                                fontSize="10"
                                fontWeight={600}
                                textAnchor="middle"
                                x={P.x}
                                y={P.y + 3.5}
                            >
                                {n.name}
                            </text>
                            <text
                                fill={theme.colors.gray[6]}
                                fontSize="8.5"
                                textAnchor="middle"
                                x={P.x}
                                y={P.y + 33}
                            >
                                {n.overlay}
                            </text>
                            <title>
                                {`${n.name} (${n.role === 'entry' ? ui('entry') : ui('exit-2')})\nunderlay ${n.underlay}\noverlay ${n.overlay}\n${ui('agent')}: ${alive ? ui('healthy-2') : ui('not-responding')}${n.etcd ? '\netcd' + (n.leader ? ui('leader-2') : '') : ''}${n.relay ? ui('relay-enabled') : ''}`}
                            </title>
                        </g>
                    )
                })}
            </svg>
            <Group gap="md" justify="center" mt={4}>
                <Badge color="violet" size="sm" variant="dot">
                    {' '}
                    {ui('entry-2')}{' '}
                </Badge>
                <Badge color="cyan" size="sm" variant="dot">
                    {' '}
                    {ui('exit-2')}{' '}
                </Badge>
                <Badge color="teal" size="sm" variant="dot">
                    {' '}
                    {ui('link-healthy')}{' '}
                </Badge>
                <Badge color="yellow" size="sm" variant="dot">
                    {' '}
                    {ui('one-way-link')}{' '}
                </Badge>
                <Badge color="red" size="sm" variant="dot">
                    {' '}
                    {ui('link-down')}{' '}
                </Badge>
                <Badge color="blue" size="sm" variant="dot">
                    {' '}
                    {ui('transit')}{' '}
                </Badge>
                <Badge color="orange" size="sm" variant="dot">
                    {' '}
                    {ui('relay-enabled')}{' '}
                </Badge>
                <Text c="dimmed" size="xs">
                    {' '}
                    {ui('outer-ring-etcd-member-pulsing-yellow-ring-leader')}{' '}
                </Text>
            </Group>
        </div>
    )
}
