import type { IEncryptedBlob } from './ssh-crypto'

import { concatBytes } from '@noble/curves/utils.js'

import { fromBase64, toBase64 } from './ssh-crypto'

export const VAULT_FILE_EXTENSION = '.rw'
export const VAULT_FILE_VERSION = 2

const MAGIC = new Uint8Array([0x52, 0x57, 0x56, 0x4c, 0x54, 0x00])
const IV_LENGTH = 12
const PADDING_BLOCK = 4096

export class VaultFileError extends Error {
    constructor() {
        super('malformed vault file')
        this.name = 'VaultFileError'
    }
}

export function padPayload(payload: Uint8Array): Uint8Array {
    const total = Math.ceil((4 + payload.length) / PADDING_BLOCK) * PADDING_BLOCK
    const padded = new Uint8Array(total)

    new DataView(padded.buffer).setUint32(0, payload.length, false)
    padded.set(payload, 4)

    return padded
}

export function unpadPayload(padded: Uint8Array): Uint8Array {
    if (padded.length < 4) throw new VaultFileError()

    const length = new DataView(padded.buffer, padded.byteOffset, padded.byteLength).getUint32(
        0,
        false
    )

    if (length > padded.length - 4) throw new VaultFileError()

    return padded.subarray(4, 4 + length)
}

export interface IVaultBackupFile {
    createdAt: string
    payload: IEncryptedBlob
    wrappedDataKey: IEncryptedBlob
}

export function vaultFileAad(createdAt: string, wrappedDataKey: IEncryptedBlob): Uint8Array {
    const header = new Uint8Array(MAGIC.length + 1 + 8)
    const view = new DataView(header.buffer)

    header.set(MAGIC)
    view.setUint8(MAGIC.length, VAULT_FILE_VERSION)
    view.setBigUint64(MAGIC.length + 1, BigInt(Date.parse(createdAt)), false)

    return concatBytes(header, section(wrappedDataKey))
}

export function encodeVaultFile(file: IVaultBackupFile): Uint8Array {
    return concatBytes(vaultFileAad(file.createdAt, file.wrappedDataKey), section(file.payload))
}

export function decodeVaultFile(bytes: Uint8Array): IVaultBackupFile {
    const reader = new Reader(bytes)

    if (!equals(reader.take(MAGIC.length), MAGIC)) throw new VaultFileError()
    if (reader.uint8() !== VAULT_FILE_VERSION) throw new VaultFileError()

    const createdAt = new Date(Number(reader.uint64())).toISOString()
    const wrappedDataKey = reader.section()
    const payload = reader.section()

    if (!reader.atEnd()) throw new VaultFileError()

    return { createdAt, payload, wrappedDataKey }
}

function section(blob: IEncryptedBlob): Uint8Array {
    const iv = fromBase64(blob.iv)
    const cipher = fromBase64(blob.cipher)

    if (iv.length !== IV_LENGTH) throw new VaultFileError()

    const length = new Uint8Array(4)
    new DataView(length.buffer).setUint32(0, cipher.length, false)

    return concatBytes(iv, length, cipher)
}

class Reader {
    private offset = 0

    constructor(private readonly data: Uint8Array) {}

    atEnd(): boolean {
        return this.offset === this.data.length
    }

    take(length: number): Uint8Array {
        if (this.offset + length > this.data.length) throw new VaultFileError()

        const slice = this.data.slice(this.offset, this.offset + length)
        this.offset += length

        return slice
    }

    uint8(): number {
        return this.take(1)[0]
    }

    uint64(): bigint {
        const bytes = this.take(8)
        return new DataView(bytes.buffer, bytes.byteOffset, 8).getBigUint64(0, false)
    }

    section(): IEncryptedBlob {
        const iv = this.take(IV_LENGTH)
        const bytes = this.take(4)
        const length = new DataView(bytes.buffer, bytes.byteOffset, 4).getUint32(0, false)

        return { cipher: toBase64(this.take(length)), iv: toBase64(iv) }
    }
}

function equals(a: Uint8Array, b: Uint8Array): boolean {
    return a.length === b.length && a.every((byte, index) => byte === b[index])
}
