export interface IGeocheckHop {
    addr?: string
    addrs?: string[]
    as_name?: string
    asn?: number
    avg_ms: number
    best_ms: number
    host?: string
    loss: number
    recv: number
    sent: number
    ttl: number
    worst_ms: number
}

export interface IGeocheckTransit {
    asn: number
    name: string
    ttl: number
}

export interface IGeocheckTarget {
    anycast?: boolean
    dest_as_name?: string
    dest_asn?: number
    excess_ms: number
    hops: IGeocheckHop[]
    host: string
    id: string
    jitter_ms: number
    loss: number
    method?: string
    name: string
    notes?: string[]
    resolved?: string
    rtt_ms: number
    score: number
    transits?: IGeocheckTransit[]
    verdict: string
}

export interface IGeocheckConnectivity {
    breakdown?: Record<string, number>
    icmp_available?: boolean
    latency_floor_ms?: number
    privileged?: boolean
    score?: number
    targets: IGeocheckTarget[]
}

export interface IGeocheckHopSegment {
    asName: string
    asn: null | number
    hops: IGeocheckHop[]
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null

const hasTargets = (value: unknown): value is IGeocheckConnectivity =>
    isRecord(value) && Array.isArray(value.targets) && value.targets.every(isRecord)

export const resolveConnectivity = (rawReport: unknown): IGeocheckConnectivity | null => {
    if (hasTargets(rawReport)) return rawReport

    if (isRecord(rawReport) && hasTargets(rawReport.connectivity)) {
        return rawReport.connectivity
    }

    return null
}

export const groupHopsByAs = (hops: IGeocheckHop[]): IGeocheckHopSegment[] => {
    const segments: IGeocheckHopSegment[] = []

    for (const hop of hops) {
        const asn = hop.asn ?? null
        const last = segments.at(-1)

        if (last && last.asn === asn && (asn !== null || !hop.addr)) {
            last.hops.push(hop)
            continue
        }

        segments.push({ asn, asName: hop.as_name ?? '', hops: [hop] })
    }

    return segments
}

export const isTimedOutHop = (hop: IGeocheckHop): boolean => !hop.addr || hop.recv === 0

export const VERDICT_COLORS: Record<string, string> = {
    detour: 'orange',
    direct: 'teal',
    failed: 'red',
    intercepted: 'red',
    'on-net': 'teal',
    peered: 'green',
    regional: 'green',
    transit: 'yellow',
    unreachable: 'gray'
}

export const resolveVerdictColor = (verdict: string): string => VERDICT_COLORS[verdict] ?? 'gray'
