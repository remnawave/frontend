import { ed25519 } from '@noble/curves/ed25519.js'
import {
    bytesToNumberBE,
    concatBytes,
    equalBytes,
    numberToVarBytesBE
} from '@noble/curves/utils.js'
import { utf8ToBytes } from '@noble/hashes/utils.js'
import { decodeURLSafe, encodeURLSafe } from '@stablelib/base64'

import { fromBase64, toBase64 } from './ssh-crypto'

export type TSshKeyAlgo = 'ssh-ed25519' | 'ssh-rsa'
export type TSshKeyErrorCode = 'encrypted' | 'malformed' | 'unsupported-algo' | 'unsupported-format'

const OPENSSH_MAGIC = 'openssh-key-v1\0'
const SSH_MSG_USERAUTH_REQUEST = 50
const MAX_PEM_LENGTH = 64 * 1024
const MAX_RSA_COMPONENT_BYTES = 2048

const PKCS8_ED25519_PREFIX = new Uint8Array([
    0x30, 0x2e, 0x02, 0x01, 0x00, 0x30, 0x05, 0x06, 0x03, 0x2b, 0x65, 0x70, 0x04, 0x22, 0x04, 0x20
])

export class SshKeyError extends Error {
    constructor(readonly code: TSshKeyErrorCode) {
        super(code)
        this.name = 'SshKeyError'
    }
}

export interface ISshPrivateKey {
    algo: TSshKeyAlgo
    material: Uint8Array
}

export interface IParsedSshKey extends ISshPrivateKey {
    publicKeyLine: string
}

interface IPem {
    body: Uint8Array
    label: string
}

interface IRsaParts {
    d: Uint8Array
    e: Uint8Array
    iqmp: Uint8Array
    n: Uint8Array
    p: Uint8Array
    q: Uint8Array
}

export async function parseSshPrivateKey(input: string, comment: string): Promise<IParsedSshKey> {
    if (input.length > MAX_PEM_LENGTH) throw new SshKeyError('malformed')

    const pem = readPem(input)

    switch (pem.label) {
        case 'OPENSSH PRIVATE KEY':
            return parseOpenSshKey(pem.body, comment)
        case 'PRIVATE KEY':
            return parsePkcs8(pem.body, comment)
        case 'RSA PRIVATE KEY':
            return parsePkcs8(wrapPkcs1(pem.body), comment)
        case 'DSA PRIVATE KEY':
        case 'EC PRIVATE KEY':
            throw new SshKeyError('unsupported-algo')
        default:
            throw new SshKeyError('unsupported-format')
    }
}

export async function signSshChallenge(
    key: ISshPrivateKey,
    data: Uint8Array,
    hash: null | string
): Promise<Uint8Array> {
    if (key.algo === 'ssh-ed25519') {
        return ed25519.sign(data, key.material)
    }

    const jwk = JSON.parse(new TextDecoder().decode(key.material)) as JsonWebKey

    const cryptoKey = await crypto.subtle.importKey(
        'jwk',
        jwk,
        { name: 'RSASSA-PKCS1-v1_5', hash: webCryptoHash(hash) },
        false,
        ['sign']
    )

    const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', cryptoKey, data as BufferSource)

    return new Uint8Array(signature)
}

export function toOpenSshPublicKey(publicKey: Uint8Array, comment: string): string {
    const blob = concatBytes(sshString(utf8ToBytes('ssh-ed25519')), sshString(publicKey))
    return `ssh-ed25519 ${toBase64(blob)} ${comment}`
}

export function isOwnUserauthRequest(
    data: Uint8Array,
    username: string,
    publicKeyLine: string
): boolean {
    try {
        const reader = new Reader(data)

        reader.string()
        if (reader.take(1)[0] !== SSH_MSG_USERAUTH_REQUEST) return false
        if (decodeUtf8(reader.string()) !== username) return false
        if (decodeUtf8(reader.string()) !== 'ssh-connection') return false
        if (decodeUtf8(reader.string()) !== 'publickey') return false
        if (reader.take(1)[0] !== 1) return false

        reader.string()

        return equalBytes(reader.string(), fromBase64(publicKeyLine.split(/\s+/)[1] ?? ''))
    } catch {
        return false
    }
}

export async function sshHostKeyIdentity(
    key: Uint8Array
): Promise<{ algo: string; fingerprint: string }> {
    const digest = await crypto.subtle.digest('SHA-256', key as BufferSource)

    return {
        algo: decodeUtf8(new Reader(key).string()),
        fingerprint: `SHA256:${toBase64(new Uint8Array(digest)).replace(/=+$/, '')}`
    }
}

function webCryptoHash(hash: null | string): string {
    switch (hash) {
        case 'sha256':
            return 'SHA-256'
        case 'sha512':
            return 'SHA-512'
        case null:
            return 'SHA-1'
        default:
            throw new SshKeyError('unsupported-algo')
    }
}

function readPem(input: string): IPem {
    const match = /-----BEGIN ([A-Z0-9 ]+)-----([\s\S]*?)-----END \1-----/.exec(input.trim())

    if (!match) throw new SshKeyError('unsupported-format')

    if (/Proc-Type:\s*4,ENCRYPTED/i.test(match[2])) throw new SshKeyError('encrypted')

    if (match[1] === 'ENCRYPTED PRIVATE KEY') throw new SshKeyError('encrypted')

    const base64 = match[2].replace(/[^A-Za-z0-9+/=]/g, '')

    try {
        return { body: fromBase64(base64), label: match[1] }
    } catch {
        throw new SshKeyError('malformed')
    }
}

function parseOpenSshKey(body: Uint8Array, comment: string): IParsedSshKey {
    const reader = new Reader(body)

    if (decodeUtf8(reader.take(OPENSSH_MAGIC.length)) !== OPENSSH_MAGIC) {
        throw new SshKeyError('malformed')
    }

    const cipher = decodeUtf8(reader.string())
    reader.string() // kdfname
    reader.string() // kdfoptions

    if (cipher !== 'none') throw new SshKeyError('encrypted')

    if (reader.uint32() !== 1) throw new SshKeyError('malformed')

    const publicBlob = reader.string()
    const secrets = new Reader(reader.string())

    if (secrets.uint32() !== secrets.uint32()) throw new SshKeyError('encrypted')

    const keyType = decodeUtf8(secrets.string())

    if (keyType === 'ssh-ed25519') {
        secrets.string()
        const secret = secrets.string()

        // OpenSSH stores seed || public key; libsodium's "secret key" layout.
        if (secret.length !== 64) throw new SshKeyError('malformed')

        const seed = secret.slice(0, 32)

        return {
            algo: 'ssh-ed25519',
            material: seed,
            publicKeyLine: verifiedPublicKeyLine(
                'ssh-ed25519',
                [ed25519.getPublicKey(seed)],
                publicBlob,
                comment
            )
        }
    }

    if (keyType === 'ssh-rsa') {
        const n = secrets.string()
        const e = secrets.string()
        const d = secrets.string()
        const iqmp = secrets.string()
        const p = secrets.string()
        const q = secrets.string()

        for (const component of [n, e, d, iqmp, p, q]) {
            if (component.length > MAX_RSA_COMPONENT_BYTES) throw new SshKeyError('malformed')
        }

        return {
            algo: 'ssh-rsa',
            material: rsaMaterial({ d, e, iqmp, n, p, q }),
            publicKeyLine: verifiedPublicKeyLine('ssh-rsa', [e, n], publicBlob, comment)
        }
    }

    throw new SshKeyError('unsupported-algo')
}

async function parsePkcs8(body: Uint8Array, comment: string): Promise<IParsedSshKey> {
    if (equalBytes(body.slice(0, PKCS8_ED25519_PREFIX.length), PKCS8_ED25519_PREFIX)) {
        const seed = body.slice(PKCS8_ED25519_PREFIX.length)

        if (seed.length !== 32) throw new SshKeyError('malformed')

        return {
            algo: 'ssh-ed25519',
            material: seed,
            publicKeyLine: toOpenSshPublicKey(ed25519.getPublicKey(seed), comment)
        }
    }

    let jwk: JsonWebKey
    try {
        const key = await crypto.subtle.importKey(
            'pkcs8',
            body as BufferSource,
            { hash: 'SHA-256', name: 'RSASSA-PKCS1-v1_5' },
            true,
            ['sign']
        )
        jwk = await crypto.subtle.exportKey('jwk', key)
    } catch {
        throw new SshKeyError('unsupported-algo')
    }

    if (!jwk.n || !jwk.e) throw new SshKeyError('malformed')

    const blob = concatBytes(
        sshString(utf8ToBytes('ssh-rsa')),
        sshString(mpint(decodeURLSafe(jwk.e))),
        sshString(mpint(decodeURLSafe(jwk.n)))
    )

    return {
        algo: 'ssh-rsa',
        material: utf8ToBytes(JSON.stringify(normaliseJwk(jwk))),
        publicKeyLine: `ssh-rsa ${toBase64(blob)} ${comment}`
    }
}

function wrapPkcs1(pkcs1: Uint8Array): Uint8Array {
    const rsaEncryption = new Uint8Array([
        0x30, 0x0d, 0x06, 0x09, 0x2a, 0x86, 0x48, 0x86, 0xf7, 0x0d, 0x01, 0x01, 0x01, 0x05, 0x00
    ])

    const inner = concatBytes(
        new Uint8Array([0x02, 0x01, 0x00]),
        rsaEncryption,
        derTagged(0x04, pkcs1)
    )

    return derTagged(0x30, inner)
}

function derTagged(tag: number, payload: Uint8Array): Uint8Array {
    return concatBytes(new Uint8Array([tag]), derLength(payload.length), payload)
}

function derLength(length: number): Uint8Array {
    if (length < 0x80) return new Uint8Array([length])

    const bytes: number[] = []
    for (let rest = length; rest > 0; rest >>>= 8) bytes.unshift(rest & 0xff)

    return new Uint8Array([0x80 | bytes.length, ...bytes])
}

function rsaMaterial(parts: IRsaParts): Uint8Array {
    const d = bytesToNumberBE(parts.d)
    const p = bytesToNumberBE(parts.p)
    const q = bytesToNumberBE(parts.q)

    if (p <= 1n || q <= 1n) throw new SshKeyError('malformed')

    if (bytesToNumberBE(parts.n) !== p * q) throw new SshKeyError('malformed')

    const jwk: JsonWebKey = {
        d: toBase64Url(parts.d),
        dp: toBase64Url(numberToVarBytesBE(d % (p - 1n))),
        dq: toBase64Url(numberToVarBytesBE(d % (q - 1n))),
        e: toBase64Url(parts.e),
        kty: 'RSA',
        n: toBase64Url(parts.n),
        p: toBase64Url(parts.p),
        q: toBase64Url(parts.q),
        qi: toBase64Url(parts.iqmp)
    }

    return utf8ToBytes(JSON.stringify(jwk))
}

function normaliseJwk(jwk: JsonWebKey): JsonWebKey {
    const { alg, ext, key_ops, use, ...rest } = jwk
    void alg
    void ext
    void key_ops
    void use

    return rest
}

function verifiedPublicKeyLine(
    algo: TSshKeyAlgo,
    parts: Uint8Array[],
    envelope: Uint8Array,
    comment: string
): string {
    const blob = concatBytes(sshString(utf8ToBytes(algo)), ...parts.map(sshString))

    if (!equalBytes(blob, envelope)) throw new SshKeyError('malformed')

    return `${algo} ${toBase64(blob)} ${comment}`
}

class Reader {
    private offset = 0

    constructor(private readonly data: Uint8Array) {}

    take(length: number): Uint8Array {
        if (this.offset + length > this.data.length) throw new SshKeyError('malformed')

        const slice = this.data.slice(this.offset, this.offset + length)
        this.offset += length

        return slice
    }

    uint32(): number {
        const bytes = this.take(4)
        return new DataView(bytes.buffer, bytes.byteOffset, 4).getUint32(0, false)
    }

    string(): Uint8Array {
        return this.take(this.uint32())
    }
}

function sshString(payload: Uint8Array): Uint8Array {
    const out = new Uint8Array(4 + payload.length)
    new DataView(out.buffer).setUint32(0, payload.length, false)
    out.set(payload, 4)

    return out
}

function mpint(value: Uint8Array): Uint8Array {
    const trimmed = trimLeadingZeros(value)

    if (trimmed.length === 0) return new Uint8Array(1)

    return trimmed[0] & 0x80 ? concatBytes(new Uint8Array(1), trimmed) : trimmed
}

function trimLeadingZeros(value: Uint8Array): Uint8Array {
    let start = 0
    while (start < value.length - 1 && value[start] === 0) start += 1

    return value.slice(start)
}

function toBase64Url(value: Uint8Array): string {
    return encodeURLSafe(trimLeadingZeros(value)).replace(/=+$/, '')
}

const decodeUtf8 = (value: Uint8Array): string => new TextDecoder().decode(value)
