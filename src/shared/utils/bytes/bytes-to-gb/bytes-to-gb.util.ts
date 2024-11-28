import xbytes from 'xbytes'

export function bytesToGbUtil(bytesInput: number | undefined | string): number | undefined {
    if (typeof bytesInput === 'undefined') return undefined

    if (typeof bytesInput === 'string') {
        bytesInput = Number(bytesInput)
    }

    const res = xbytes.parseBytes(bytesInput, {
        sticky: true,
        prefixIndex: 3,
        fixed: 0,
        iec: true,
        space: false
    })

    return Number(res.size.replace('GiB', ''))
}
