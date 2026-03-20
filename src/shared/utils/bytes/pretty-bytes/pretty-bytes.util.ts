/* eslint-disable no-param-reassign */
import xbytes from 'xbytes'

export function prettyBytesToAnyUtil(
    bytesInput: number | string | undefined,
    returnZero: true
): string
export function prettyBytesToAnyUtil(
    bytesInput: number | string | undefined,
    returnZero?: false
): string | undefined
export function prettyBytesToAnyUtil(
    bytesInput: number | string | undefined,
    returnZero: boolean = false
): string | undefined {
    if (!bytesInput) {
        return returnZero ? '0' : undefined
    }
    if (typeof bytesInput === 'string') {
        bytesInput = Number(bytesInput)
    }

    const res = xbytes.parseBytes(bytesInput, { sticky: true, iec: true })

    return String(res.size)
}

export function prettyBytesUtil(
    bytesInput: null | number | string | undefined,
    returnZero: boolean = false
): string | undefined {
    if (!bytesInput) {
        return returnZero ? '0' : undefined
    }
    if (typeof bytesInput === 'string') {
        bytesInput = Number(bytesInput)
    }

    const res = xbytes.parseBytes(bytesInput, { sticky: true, prefixIndex: 3, iec: true })

    return String(res.size)
}

export function prettyBytesUtilWithoutPrefix(
    bytesInput: number | string | undefined,
    returnZero: boolean = false
): string | undefined {
    if (!bytesInput) {
        return returnZero ? '0' : undefined
    }
    if (typeof bytesInput === 'string') {
        bytesInput = Number(bytesInput)
    }

    const res = xbytes.parseBytes(bytesInput, { sticky: true, iec: true })

    return String(res.size)
}

export function prettyRealtimeBytesUtil(
    bytesInput: number | string | undefined,
    returnZero: boolean = false,
    withSeconds: boolean = false
): string | undefined {
    if (!bytesInput) {
        return returnZero ? '0 B/s' : undefined
    }
    if (typeof bytesInput === 'string') {
        bytesInput = Number(bytesInput)
    }

    const res = xbytes.parseBytes(bytesInput, { sticky: true, iec: true })

    return `${res.size}${withSeconds ? '/s' : ''}`
}

export function prettySiBytesUtil(
    bytesInput: number | string | undefined,
    returnZero: boolean = false
): string | undefined {
    if (!bytesInput) {
        return returnZero ? '0 B' : undefined
    }
    if (typeof bytesInput === 'string') {
        bytesInput = Number(bytesInput)
    }

    const res = xbytes.parseBytes(bytesInput, { sticky: true, iec: false })

    return String(res.size)
}

export function prettySiRealtimeBytesUtil(
    bytesInput: number | string | undefined,
    returnZero: boolean = false,
    withSeconds: boolean = false
): string | undefined {
    if (!bytesInput) {
        return returnZero ? '0 B/s' : undefined
    }
    if (typeof bytesInput === 'string') {
        bytesInput = Number(bytesInput)
    }

    const res = xbytes.parseBytes(bytesInput, { sticky: true, iec: false, bits: true })

    return `${res.size}${withSeconds ? '/s' : ''}`
}
