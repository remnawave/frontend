import { decode, decodeURLSafe, encode } from '@stablelib/base64'

export const decodeBase64 = (value: string): null | string => {
    const trimmed = value.trim()

    if (trimmed === '') return ''

    const decoder = new TextDecoder('utf-8', { fatal: true })

    try {
        return decoder.decode(decode(trimmed))
    } catch {
        try {
            return decoder.decode(decodeURLSafe(trimmed))
        } catch {
            return null
        }
    }
}

export const encodeBase64 = (value: string): string => encode(new TextEncoder().encode(value))
