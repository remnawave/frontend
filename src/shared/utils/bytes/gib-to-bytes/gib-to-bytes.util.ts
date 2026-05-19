/* eslint-disable no-param-reassign */
import xbytes from 'xbytes'

export function gibToBytesUtil(gibInput: number | string | undefined): number | undefined {
    if (typeof gibInput === 'undefined') return undefined
    if (typeof gibInput === 'string') {
        gibInput = Number(gibInput)
    }

    const res = xbytes.parse(`${gibInput} GiB`)

    return res.bytes
}
