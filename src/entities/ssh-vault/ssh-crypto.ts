import { createOPRF } from '@noble/curves/abstract/oprf.js'
import { ed25519, ristretto255, ristretto255_hasher } from '@noble/curves/ed25519.js'
import { concatBytes } from '@noble/curves/utils.js'
import { sha512 } from '@noble/hashes/sha2.js'
import { utf8ToBytes } from '@noble/hashes/utils.js'
import { generateMnemonic, mnemonicToSeed, validateMnemonic } from '@scure/bip39'
import { wordlist } from '@scure/bip39/wordlists/english.js'
import { decode as fromBase64, encode as toBase64 } from '@stablelib/base64'

export const generateSeedPhrase = () => generateMnemonic(wordlist, 128)

export const isValidSeedPhrase = (phrase: string) => validateMnemonic(phrase.trim(), wordlist)

export async function deriveKeyEncryptionKey(seedPhrase: string): Promise<CryptoKey> {
    const seed = await mnemonicToSeed(seedPhrase.trim())

    const material = await crypto.subtle.importKey('raw', seed as BufferSource, 'HKDF', false, [
        'deriveKey'
    ])

    return crypto.subtle.deriveKey(
        {
            name: 'HKDF',
            hash: 'SHA-256',
            salt: new Uint8Array(0),
            info: new TextEncoder().encode('rw-vault-v1')
        },
        material,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
    )
}

export const PASSCODE_MIN_LENGTH = 8
export const PASSCODE_MAX_LENGTH = 8
export const PASSCODE_MAX_ATTEMPTS = 3
const PASSCODE_ITERATIONS = 3_000_000

export const isValidPasscode = (passcode: string) =>
    passcode.length >= PASSCODE_MIN_LENGTH &&
    passcode.length <= PASSCODE_MAX_LENGTH &&
    /[a-z]/i.test(passcode)

export async function deriveIndexKey(rawDataKey: Uint8Array): Promise<CryptoKey> {
    const material = await crypto.subtle.importKey(
        'raw',
        rawDataKey as BufferSource,
        'HKDF',
        false,
        ['deriveKey']
    )

    return crypto.subtle.deriveKey(
        {
            name: 'HKDF',
            hash: 'SHA-256',
            salt: new Uint8Array(0),
            info: new TextEncoder().encode('rw-vault-index-v1')
        },
        material,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    )
}

export async function indexId(indexKey: CryptoKey, value: string): Promise<string> {
    const mac = await crypto.subtle.sign('HMAC', indexKey, new TextEncoder().encode(value))
    return toBase64(new Uint8Array(mac))
}

export const generateSalt = () => crypto.getRandomValues(new Uint8Array(16))

export type TOprfEvaluator = (blinded: Uint8Array) => Promise<Uint8Array>

const oprf = createOPRF({
    hash: sha512,
    hashToGroup: ristretto255_hasher.hashToCurve,
    hashToScalar: ristretto255_hasher.hashToScalar,
    name: 'ristretto255-SHA512',
    Point: ristretto255.Point
})

export async function derivePasscodeKey(
    passcode: string,
    salt: Uint8Array,
    evaluate: TOprfEvaluator
): Promise<CryptoKey> {
    const input = concatBytes(salt, utf8ToBytes(passcode))
    const { blind, blinded } = oprf.oprf.blind(input)

    const hardened = oprf.oprf.finalize(input, blind, await evaluate(blinded))

    return derivePasscodeKeyFrom(hardened, salt)
}

async function derivePasscodeKeyFrom(secret: Uint8Array, salt: Uint8Array): Promise<CryptoKey> {
    const material = await crypto.subtle.importKey('raw', secret as BufferSource, 'PBKDF2', false, [
        'deriveKey'
    ])

    return crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            hash: 'SHA-256',
            salt: salt as BufferSource,
            iterations: PASSCODE_ITERATIONS
        },
        material,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
    )
}

export const generateDeviceKey = () =>
    crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt'])

export const generateDataKey = () => crypto.getRandomValues(new Uint8Array(32))

export async function importDataKey(raw: Uint8Array): Promise<CryptoKey> {
    return crypto.subtle.importKey('raw', raw as BufferSource, 'AES-GCM', false, [
        'encrypt',
        'decrypt'
    ])
}

export interface IEncryptedBlob {
    cipher: string
    iv: string
}

type TAad = string | Uint8Array

const aadBytes = (aad: TAad): Uint8Array =>
    typeof aad === 'string' ? new TextEncoder().encode(aad) : aad

export async function encrypt(
    key: CryptoKey,
    plaintext: Uint8Array,
    aad: TAad
): Promise<IEncryptedBlob> {
    const iv = crypto.getRandomValues(new Uint8Array(12))

    const cipher = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv, additionalData: aadBytes(aad) as BufferSource },
        key,
        plaintext as BufferSource
    )

    return { cipher: toBase64(new Uint8Array(cipher)), iv: toBase64(iv) }
}

export async function decrypt(
    key: CryptoKey,
    blob: IEncryptedBlob,
    aad: TAad
): Promise<Uint8Array> {
    const plaintext = await crypto.subtle.decrypt(
        {
            name: 'AES-GCM',
            iv: fromBase64(blob.iv) as BufferSource,
            additionalData: aadBytes(aad) as BufferSource
        },
        key,
        fromBase64(blob.cipher) as BufferSource
    )

    return new Uint8Array(plaintext)
}

export interface ISshKeyPair {
    privateKey: Uint8Array
    publicKey: Uint8Array
}

export function generateSshKeyPair(): ISshKeyPair {
    const privateKey = ed25519.utils.randomSecretKey()
    return { privateKey, publicKey: ed25519.getPublicKey(privateKey) }
}

export { fromBase64, toBase64 }
