import type { IEncryptedBlob } from './ssh-crypto'
import type { IParsedSshKey, ISshPrivateKey, TSshKeyAlgo } from './ssh-private-key'
import type {
    IConnectionProfile,
    IConnectionProfileRecord,
    IKnownHost,
    ISnippetRecord,
    IKnownHostRecord,
    INodeKeyRecord,
    IVaultMeta
} from './ssh-vault.db'

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

import { evaluateVault } from '@shared/api/hooks'
import { logoutEvents } from '@shared/emitters'

import {
    decrypt,
    deriveIndexKey,
    indexId,
    derivePasscodeKey,
    deriveKeyEncryptionKey,
    encrypt,
    generateDataKey,
    generateSalt,
    fromBase64,
    generateSshKeyPair,
    importDataKey,
    PASSCODE_MAX_ATTEMPTS,
    isValidPasscode,
    PASSCODE_MIN_LENGTH,
    toBase64
} from './ssh-crypto'
import { parseSshPrivateKey, toOpenSshPublicKey } from './ssh-private-key'
import {
    clearVault,
    destroyVault,
    deleteSnippet,
    getAllKnownHosts,
    getAllNodeKeys,
    getAllSnippets,
    getAllConnectionProfiles,
    getConnectionProfile,
    getKnownHost,
    getNodeKey,
    getDeviceKey,
    getOrCreateDeviceKey,
    getVaultMeta,
    putConnectionProfile,
    putConnectionProfiles,
    putKnownHost,
    putKnownHosts,
    putNodeKey,
    putNodeKeys,
    putSnippet,
    putSnippets,
    putVaultMeta
} from './ssh-vault.db'
import {
    decodeVaultFile,
    encodeVaultFile,
    padPayload,
    IVaultBackupFile,
    unpadPayload,
    vaultFileAad
} from './vault-backup-file'

export type TVaultStatus = 'absent' | 'locked' | 'unknown' | 'unlocked'

interface IState {
    dataKey: CryptoKey | null
    indexKey: CryptoKey | null
    hasPasscode: boolean
    passcodeAttemptsLeft: number
    passcodeLength: number
    status: TVaultStatus
}

export interface INodeKeyInfo {
    algo: TSshKeyAlgo
    imported: boolean
    publicKey: string
}

interface IActions {
    actions: {
        create: (seedPhrase: string, passcode: string) => Promise<void>
        ensureNodeKey: (nodeUuid: string) => Promise<INodeKeyInfo>
        importNodeKey: (nodeUuid: string, privateKey: string) => Promise<INodeKeyInfo>
        regenerateNodeKey: (nodeUuid: string) => Promise<INodeKeyInfo>
        exportVault: () => Promise<Uint8Array>
        importVault: (file: Uint8Array, seedPhrase: string) => Promise<boolean>
        getNodePublicKey: (nodeUuid: string) => Promise<null | string>
        getPrivateKey: (nodeUuid: string) => Promise<ISshPrivateKey | null>
        deleteSnippet: (id: string) => Promise<void>
        getProfile: (nodeUuid: string) => Promise<IConnectionProfile | null>
        listProfiles: () => Promise<IConnectionProfile[]>
        listSnippets: () => Promise<ISshSnippet[]>
        lock: () => void
        refresh: () => Promise<void>
        reset: () => Promise<void>
        rememberHost: (target: string, algo: string, fingerprint: string) => Promise<void>
        saveProfile: (profile: Omit<IConnectionProfile, 'lastUsedAt'>) => Promise<void>
        saveSnippet: (
            snippet: Pick<ISshSnippet, 'command' | 'name'> & { id?: string }
        ) => Promise<void>
        setPasscode: (passcode: string) => Promise<void>
        trustedFingerprint: (target: string) => Promise<null | string>
        unlock: (seedPhrase: string) => Promise<boolean>
        unlockWithPasscode: (passcode: string) => Promise<boolean>
    }
}

export const VAULT_DEVICE_KEY_MISSING = 'vault-device-key-missing'

export const describeVaultError = (error: unknown): string =>
    error instanceof Error && error.message !== VAULT_DEVICE_KEY_MISSING
        ? error.message
        : 'Vault is temporarily unavailable'
const VAULT_AAD = 'rw-vault-v1'
const PASSCODE_AAD = 'rw-vault-passcode-v1'

let rawDataKeyCache: null | Uint8Array = null

interface IVaultBackupPayload {
    hosts: IKnownHostRecord[]
    keys: INodeKeyRecord[]
    profiles?: IConnectionProfileRecord[]
    snippets?: ISnippetRecord[]
}

export interface ISshSnippet {
    command: string
    createdAt: string
    id: string
    name: string
}

async function wrapPasscode(
    rawDataKey: Uint8Array,
    passcode: string
): Promise<NonNullable<IVaultMeta['passcode']>> {
    if (!isValidPasscode(passcode)) throw new Error('Passcode is too weak')

    const salt = generateSalt()
    const passcodeKey = await derivePasscodeKey(passcode, salt, evaluateWithPanel)

    const inner = await encrypt(passcodeKey, rawDataKey, PASSCODE_AAD)
    const wrapped = await encrypt(
        await getOrCreateDeviceKey(),
        new TextEncoder().encode(JSON.stringify(inner)),
        PASSCODE_AAD
    )

    return { attempts: 0, length: passcode.length, salt: toBase64(salt), wrapped }
}

function isRestorablePayload(payload: IVaultBackupPayload): boolean {
    const hasKey = (value: unknown, field: string) =>
        typeof value === 'object' &&
        value !== null &&
        typeof (value as Record<string, unknown>)[field] === 'string' &&
        (value as Record<string, string>)[field].length > 0

    return (
        Array.isArray(payload.keys) &&
        Array.isArray(payload.hosts) &&
        (payload.snippets === undefined || Array.isArray(payload.snippets)) &&
        (payload.profiles === undefined || Array.isArray(payload.profiles)) &&
        payload.keys.every((record) => hasKey(record, 'nodeUuid')) &&
        payload.hosts.every((record) => hasKey(record, 'id')) &&
        (payload.snippets ?? []).every((record) => hasKey(record, 'id')) &&
        (payload.profiles ?? []).every((record) => hasKey(record, 'nodeUuid'))
    )
}

const evaluateWithPanel = async (blinded: Uint8Array): Promise<Uint8Array> =>
    fromBase64(await evaluateVault(toBase64(blinded)))

const stripId = (meta: IVaultMeta): Omit<IVaultMeta, 'id'> => {
    const { id: _id, ...rest } = meta
    return rest
}

const nodeAad = (nodeUuid: string, publicKey: string, algo: TSshKeyAlgo) =>
    `ssh-node-key:${nodeUuid}:${algo}:${publicKey}`
const hostAad = (id: string) => `ssh-known-host:${id}`
const profileAad = (nodeUuid: string) => `ssh-profile:${nodeUuid}`

interface INewNodeKey extends IParsedSshKey {
    imported?: boolean
}

function generatedKey(nodeUuid: string): INewNodeKey {
    const pair = generateSshKeyPair()

    return {
        algo: 'ssh-ed25519',
        material: pair.privateKey,
        publicKeyLine: toOpenSshPublicKey(pair.publicKey, `remnawave:${nodeUuid}`)
    }
}

function toKeyInfo(record: INodeKeyRecord): INodeKeyInfo {
    return {
        algo: record.algo ?? 'ssh-ed25519',
        imported: record.imported ?? false,
        publicKey: record.publicKey
    }
}

async function storeNodeKey(
    dataKey: CryptoKey | null,
    nodeUuid: string,
    key: INewNodeKey
): Promise<INodeKeyInfo> {
    if (!dataKey) throw new Error('Vault is locked')

    const imported = key.imported ?? false

    await putNodeKey({
        algo: key.algo,
        createdAt: new Date().toISOString(),
        encryptedPrivateKey: await encrypt(
            dataKey,
            key.material,
            nodeAad(nodeUuid, key.publicKeyLine, key.algo)
        ),
        imported,
        nodeUuid,
        publicKey: key.publicKeyLine
    })

    key.material.fill(0)

    return { algo: key.algo, imported, publicKey: key.publicKeyLine }
}
const snippetAad = (id: string) => `ssh-snippet:${id}`

export const useSshVaultStore = create<IActions & IState>()(
    devtools(
        (set, get) => ({
            dataKey: null,
            indexKey: null,
            hasPasscode: false,
            passcodeAttemptsLeft: PASSCODE_MAX_ATTEMPTS,
            passcodeLength: PASSCODE_MIN_LENGTH,
            status: 'unknown',
            actions: {
                refresh: async () => {
                    const meta = await getVaultMeta()

                    set({
                        hasPasscode: Boolean(meta?.passcode),
                        passcodeAttemptsLeft:
                            PASSCODE_MAX_ATTEMPTS - (meta?.passcode?.attempts ?? 0),
                        passcodeLength: meta?.passcode?.length ?? PASSCODE_MIN_LENGTH,
                        status: meta ? (get().dataKey ? 'unlocked' : 'locked') : 'absent'
                    })
                },

                create: async (seedPhrase, passcode) => {
                    const kek = await deriveKeyEncryptionKey(seedPhrase)
                    const rawDataKey = generateDataKey()

                    await putVaultMeta({
                        createdAt: new Date().toISOString(),
                        passcode: await wrapPasscode(rawDataKey, passcode),
                        version: 1,
                        wrappedDataKey: await encrypt(kek, rawDataKey, VAULT_AAD)
                    })

                    rawDataKeyCache = rawDataKey

                    set({
                        dataKey: await importDataKey(rawDataKey),
                        indexKey: await deriveIndexKey(rawDataKey),
                        hasPasscode: true,
                        passcodeAttemptsLeft: PASSCODE_MAX_ATTEMPTS,
                        passcodeLength: passcode.length,
                        status: 'unlocked'
                    })
                },

                unlock: async (seedPhrase) => {
                    const meta = await getVaultMeta()
                    if (!meta) return false

                    try {
                        const kek = await deriveKeyEncryptionKey(seedPhrase)
                        const rawDataKey = await decrypt(kek, meta.wrappedDataKey, VAULT_AAD)

                        rawDataKeyCache = rawDataKey

                        set({
                            dataKey: await importDataKey(rawDataKey),
                            indexKey: await deriveIndexKey(rawDataKey),
                            status: 'unlocked'
                        })
                        return true
                    } catch {
                        return false
                    }
                },

                lock: () => {
                    rawDataKeyCache?.fill(0)
                    rawDataKeyCache = null
                    set({ dataKey: null, indexKey: null, status: 'locked' })
                },

                setPasscode: async (passcode) => {
                    const meta = await getVaultMeta()
                    if (!meta || !rawDataKeyCache) throw new Error('Vault is locked')

                    await putVaultMeta({
                        ...stripId(meta),
                        passcode: await wrapPasscode(rawDataKeyCache, passcode)
                    })

                    set({
                        hasPasscode: true,
                        passcodeAttemptsLeft: PASSCODE_MAX_ATTEMPTS,
                        passcodeLength: passcode.length
                    })
                },

                unlockWithPasscode: async (passcode) => {
                    const meta = await getVaultMeta()
                    if (!meta?.passcode) return false

                    let pinKey: CryptoKey
                    let inner: IEncryptedBlob

                    try {
                        const deviceKey = await getDeviceKey()

                        if (!deviceKey) throw new Error(VAULT_DEVICE_KEY_MISSING)

                        inner = JSON.parse(
                            new TextDecoder().decode(
                                await decrypt(deviceKey, meta.passcode.wrapped, PASSCODE_AAD)
                            )
                        ) as IEncryptedBlob

                        pinKey = await derivePasscodeKey(
                            passcode,
                            fromBase64(meta.passcode.salt),
                            evaluateWithPanel
                        )
                    } catch (error) {
                        throw error instanceof Error && error.message === VAULT_DEVICE_KEY_MISSING
                            ? error
                            : new Error('Vault is temporarily unavailable')
                    }

                    try {
                        const rawDataKey = await decrypt(pinKey, inner, PASSCODE_AAD)

                        rawDataKeyCache = rawDataKey

                        await putVaultMeta({
                            ...stripId(meta),
                            passcode: { ...meta.passcode, attempts: 0 }
                        })

                        set({
                            dataKey: await importDataKey(rawDataKey),
                            indexKey: await deriveIndexKey(rawDataKey),
                            passcodeAttemptsLeft: PASSCODE_MAX_ATTEMPTS,
                            status: 'unlocked'
                        })

                        return true
                    } catch {
                        const attempts = meta.passcode.attempts + 1
                        const exhausted = attempts >= PASSCODE_MAX_ATTEMPTS

                        await putVaultMeta({
                            ...stripId(meta),
                            passcode: exhausted ? undefined : { ...meta.passcode, attempts }
                        })

                        set({
                            hasPasscode: !exhausted,
                            passcodeAttemptsLeft: exhausted ? 0 : PASSCODE_MAX_ATTEMPTS - attempts
                        })

                        return false
                    }
                },

                exportVault: async () => {
                    const meta = await getVaultMeta()
                    const { dataKey } = get()
                    if (!meta || !dataKey) throw new Error('Vault is locked')

                    const payload: IVaultBackupPayload = {
                        hosts: await getAllKnownHosts(),
                        keys: await getAllNodeKeys(),
                        profiles: await getAllConnectionProfiles(),
                        snippets: await getAllSnippets()
                    }

                    const createdAt = new Date().toISOString()

                    return encodeVaultFile({
                        createdAt,
                        payload: await encrypt(
                            dataKey,
                            padPayload(new TextEncoder().encode(JSON.stringify(payload))),
                            vaultFileAad(createdAt, meta.wrappedDataKey)
                        ),
                        wrappedDataKey: meta.wrappedDataKey
                    })
                },

                importVault: async (file, seedPhrase) => {
                    let backup: IVaultBackupFile
                    let rawDataKey: Uint8Array
                    let records: IVaultBackupPayload

                    try {
                        backup = decodeVaultFile(file)

                        const kek = await deriveKeyEncryptionKey(seedPhrase)
                        rawDataKey = await decrypt(kek, backup.wrappedDataKey, VAULT_AAD)

                        const dataKey = await importDataKey(rawDataKey)

                        records = JSON.parse(
                            new TextDecoder().decode(
                                unpadPayload(
                                    await decrypt(
                                        dataKey,
                                        backup.payload,
                                        vaultFileAad(backup.createdAt, backup.wrappedDataKey)
                                    )
                                )
                            )
                        ) as IVaultBackupPayload
                    } catch {
                        return false
                    }

                    if (!isRestorablePayload(records)) return false

                    await clearVault()

                    await putVaultMeta({
                        createdAt: backup.createdAt,
                        version: 1,
                        wrappedDataKey: backup.wrappedDataKey
                    })
                    await putNodeKeys(records.keys)
                    await putKnownHosts(records.hosts)
                    await putSnippets(records.snippets ?? [])
                    await putConnectionProfiles(records.profiles ?? [])

                    rawDataKeyCache = rawDataKey

                    set({
                        dataKey: await importDataKey(rawDataKey),
                        indexKey: await deriveIndexKey(rawDataKey),
                        hasPasscode: false,
                        passcodeAttemptsLeft: PASSCODE_MAX_ATTEMPTS,
                        status: 'unlocked'
                    })

                    return true
                },

                reset: async () => {
                    rawDataKeyCache?.fill(0)
                    rawDataKeyCache = null

                    await destroyVault()

                    set({
                        dataKey: null,
                        indexKey: null,
                        hasPasscode: false,
                        passcodeAttemptsLeft: PASSCODE_MAX_ATTEMPTS,
                        status: 'absent'
                    })
                },

                listSnippets: async () => {
                    const { dataKey } = get()
                    if (!dataKey) return []

                    const records = await getAllSnippets()
                    const snippets: ISshSnippet[] = []

                    for (const record of records) {
                        try {
                            const { command, name } = JSON.parse(
                                new TextDecoder().decode(
                                    await decrypt(dataKey, record.payload, snippetAad(record.id))
                                )
                            ) as Pick<ISshSnippet, 'command' | 'name'>

                            snippets.push({
                                command,
                                createdAt: record.createdAt,
                                id: record.id,
                                name
                            })
                        } catch {
                            // silence
                        }
                    }

                    return snippets.sort((a, b) => a.name.localeCompare(b.name))
                },

                saveSnippet: async ({ command, id, name }) => {
                    const { dataKey } = get()
                    if (!dataKey) throw new Error('Vault is locked')

                    const snippetId = id ?? crypto.randomUUID()

                    await putSnippet({
                        createdAt: new Date().toISOString(),
                        id: snippetId,
                        payload: await encrypt(
                            dataKey,
                            new TextEncoder().encode(JSON.stringify({ command, name })),
                            snippetAad(snippetId)
                        )
                    })
                },

                deleteSnippet: async (id) => {
                    await deleteSnippet(id)
                },

                getProfile: async (nodeUuid) => {
                    const { dataKey } = get()
                    const record = await getConnectionProfile(nodeUuid)
                    if (!dataKey || !record) return null

                    try {
                        return JSON.parse(
                            new TextDecoder().decode(
                                await decrypt(dataKey, record.payload, profileAad(nodeUuid))
                            )
                        ) as IConnectionProfile
                    } catch {
                        return null
                    }
                },

                listProfiles: async () => {
                    const { dataKey } = get()
                    if (!dataKey) return []

                    const records = await getAllConnectionProfiles()

                    const profiles = await Promise.all(
                        records.map(async (record) => {
                            try {
                                return JSON.parse(
                                    new TextDecoder().decode(
                                        await decrypt(
                                            dataKey,
                                            record.payload,
                                            profileAad(record.nodeUuid)
                                        )
                                    )
                                ) as IConnectionProfile
                            } catch {
                                return null
                            }
                        })
                    )

                    return profiles.filter((profile) => profile !== null)
                },

                saveProfile: async (profile) => {
                    const { dataKey } = get()
                    if (!dataKey) throw new Error('Vault is locked')

                    const value: IConnectionProfile = {
                        ...profile,
                        lastUsedAt: new Date().toISOString()
                    }

                    await putConnectionProfile({
                        nodeUuid: profile.nodeUuid,
                        payload: await encrypt(
                            dataKey,
                            new TextEncoder().encode(JSON.stringify(value)),
                            profileAad(profile.nodeUuid)
                        )
                    })
                },

                getNodePublicKey: async (nodeUuid) => {
                    const record = await getNodeKey(nodeUuid)
                    return record?.publicKey ?? null
                },

                ensureNodeKey: async (nodeUuid) => {
                    const existing = await getNodeKey(nodeUuid)
                    if (existing) return toKeyInfo(existing)

                    return storeNodeKey(get().dataKey, nodeUuid, generatedKey(nodeUuid))
                },

                regenerateNodeKey: async (nodeUuid) =>
                    storeNodeKey(get().dataKey, nodeUuid, generatedKey(nodeUuid)),

                importNodeKey: async (nodeUuid, privateKey) => {
                    const parsed = await parseSshPrivateKey(privateKey, `remnawave:${nodeUuid}`)

                    return storeNodeKey(get().dataKey, nodeUuid, { ...parsed, imported: true })
                },

                getPrivateKey: async (nodeUuid) => {
                    const { dataKey } = get()
                    if (!dataKey) return null

                    const record = await getNodeKey(nodeUuid)
                    if (!record) return null

                    const algo = record.algo ?? 'ssh-ed25519'

                    return {
                        algo,
                        material: await decrypt(
                            dataKey,
                            record.encryptedPrivateKey,
                            nodeAad(nodeUuid, record.publicKey, algo)
                        )
                    }
                },

                trustedFingerprint: async (target) => {
                    const { dataKey, indexKey } = get()
                    if (!dataKey || !indexKey) return null

                    const id = await indexId(indexKey, target)
                    const record = await getKnownHost(id)
                    if (!record) return null

                    try {
                        const host = JSON.parse(
                            new TextDecoder().decode(
                                await decrypt(dataKey, record.payload, hostAad(id))
                            )
                        ) as IKnownHost

                        return host.target === target ? host.fingerprint : null
                    } catch {
                        return null
                    }
                },

                rememberHost: async (target, algo, fingerprint) => {
                    const { dataKey, indexKey } = get()
                    if (!dataKey || !indexKey) throw new Error('Vault is locked')

                    const id = await indexId(indexKey, target)
                    const host: IKnownHost = {
                        addedAt: new Date().toISOString(),
                        algo,
                        fingerprint,
                        target
                    }

                    await putKnownHost({
                        id,
                        payload: await encrypt(
                            dataKey,
                            new TextEncoder().encode(JSON.stringify(host)),
                            hostAad(id)
                        )
                    })
                }
            }
        }),
        { name: 'sshVaultStore', anonymousActionType: 'sshVaultStore' }
    )
)

export const useSshVaultStatus = () => useSshVaultStore((state) => state.status)
export const useSshVaultHasPasscode = () => useSshVaultStore((state) => state.hasPasscode)
export const useSshVaultPasscodeAttempts = () =>
    useSshVaultStore((state) => state.passcodeAttemptsLeft)
export const useSshVaultPasscodeLength = () => useSshVaultStore((state) => state.passcodeLength)
export const useSshVaultActions = () => useSshVaultStore((state) => state.actions)

logoutEvents.subscribe(() => useSshVaultStore.getState().actions.lock())
