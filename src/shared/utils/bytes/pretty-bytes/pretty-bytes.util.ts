import xbytes from 'xbytes'

export function prettyBytesUtil(
    bytesInput: number | undefined | string,
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

export function prettyBytesToAnyUtil(
    bytesInput: number | undefined | string,
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
