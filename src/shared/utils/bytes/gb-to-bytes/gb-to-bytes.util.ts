/* eslint-disable no-param-reassign */
import xbytes from 'xbytes'

export function gbToBytesUtil(gbInput: number | undefined): number | undefined {
    if (typeof gbInput === 'undefined') return undefined
    if (typeof gbInput === 'string') {
        gbInput = Number(gbInput)
    }

    const res = xbytes.parse(`${gbInput} GiB`)

    return res.bytes
}
