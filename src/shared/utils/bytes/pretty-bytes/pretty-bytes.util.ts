/* eslint-disable no-param-reassign */
import xbytes from 'xbytes'

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
    bytesInput: number | string | undefined,
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
