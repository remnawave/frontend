import type { IEncryptedBlob } from './ssh-crypto'
import type { TSshKeyAlgo } from './ssh-private-key'

import { generateDeviceKey } from './ssh-crypto'

const DB_NAME = 'rw-vault'
const DB_VERSION = 2
const STORE_META = 'meta'
const STORE_KEYS = 'keys'
const STORE_HOSTS = 'hosts'
const STORE_DEVICE = 'device'
const STORE_PROFILES = 'profiles'
const STORE_SNIPPETS = 'snippets'
const META_ID = 'vault'

export interface IVaultMeta {
    createdAt: string
    id: typeof META_ID
    passcode?: {
        attempts: number
        length: number
        salt: string
        wrapped: IEncryptedBlob
    }
    version: 1
    wrappedDataKey: IEncryptedBlob
}

export interface ISnippetRecord {
    createdAt: string
    id: string
    payload: IEncryptedBlob
}

export interface IConnectionProfile {
    host: string
    lastUsedAt: string
    nodeUuid: string
    port: number
    username: string
}

export interface IConnectionProfileRecord {
    nodeUuid: string
    payload: IEncryptedBlob
}

export interface INodeKeyRecord {
    algo?: TSshKeyAlgo
    createdAt: string
    encryptedPrivateKey: IEncryptedBlob
    imported?: boolean
    nodeUuid: string
    publicKey: string
}

export interface IKnownHost {
    addedAt: string
    algo: string
    fingerprint: string
    target: string
}

export interface IKnownHostRecord {
    id: string
    payload: IEncryptedBlob
}

function open(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION)

        request.onupgradeneeded = () => {
            const db = request.result
            if (!db.objectStoreNames.contains(STORE_META)) {
                db.createObjectStore(STORE_META, { keyPath: 'id' })
            }
            if (!db.objectStoreNames.contains(STORE_KEYS)) {
                db.createObjectStore(STORE_KEYS, { keyPath: 'nodeUuid' })
            }
            if (!db.objectStoreNames.contains(STORE_HOSTS)) {
                db.createObjectStore(STORE_HOSTS, { keyPath: 'id' })
            }
            if (!db.objectStoreNames.contains(STORE_DEVICE)) {
                db.createObjectStore(STORE_DEVICE)
            }
            if (!db.objectStoreNames.contains(STORE_PROFILES)) {
                db.createObjectStore(STORE_PROFILES, { keyPath: 'nodeUuid' })
            }
            if (!db.objectStoreNames.contains(STORE_SNIPPETS)) {
                db.createObjectStore(STORE_SNIPPETS, { keyPath: 'id' })
            }
        }

        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
    })
}

async function run<T>(
    store: string,
    mode: IDBTransactionMode,
    action: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T> {
    const db = await open()

    try {
        return await new Promise<T>((resolve, reject) => {
            const request = action(db.transaction(store, mode).objectStore(store))
            request.onsuccess = () => resolve(request.result)
            request.onerror = () => reject(request.error)
        })
    } finally {
        db.close()
    }
}

export const destroyVault = (): Promise<void> =>
    new Promise((resolve) => {
        const request = indexedDB.deleteDatabase(DB_NAME)

        request.onsuccess = () => resolve()
        request.onerror = () => resolve()
        request.onblocked = () => resolve()
    })

export const getVaultMeta = () =>
    run<IVaultMeta | undefined>(STORE_META, 'readonly', (store) => store.get(META_ID))

export const putVaultMeta = (meta: Omit<IVaultMeta, 'id'>) =>
    run(STORE_META, 'readwrite', (store) => store.put({ ...meta, id: META_ID }))

export const getNodeKey = (nodeUuid: string) =>
    run<INodeKeyRecord | undefined>(STORE_KEYS, 'readonly', (store) => store.get(nodeUuid))

export const putNodeKey = (record: INodeKeyRecord) =>
    run(STORE_KEYS, 'readwrite', (store) => store.put(record))

export const getAllNodeKeys = () =>
    run<INodeKeyRecord[]>(STORE_KEYS, 'readonly', (store) => store.getAll())

export const deleteNodeKey = (nodeUuid: string) =>
    run(STORE_KEYS, 'readwrite', (store) => store.delete(nodeUuid))

export const getKnownHost = (id: string) =>
    run<IKnownHostRecord | undefined>(STORE_HOSTS, 'readonly', (store) => store.get(id))

export const putKnownHost = (record: IKnownHostRecord) =>
    run(STORE_HOSTS, 'readwrite', (store) => store.put(record))

export const getAllKnownHosts = () =>
    run<IKnownHostRecord[]>(STORE_HOSTS, 'readonly', (store) => store.getAll())

export const getConnectionProfile = (nodeUuid: string) =>
    run<IConnectionProfileRecord | undefined>(STORE_PROFILES, 'readonly', (store) =>
        store.get(nodeUuid)
    )

export const putConnectionProfile = (record: IConnectionProfileRecord) =>
    run(STORE_PROFILES, 'readwrite', (store) => store.put(record))

export const getAllConnectionProfiles = () =>
    run<IConnectionProfileRecord[]>(STORE_PROFILES, 'readonly', (store) => store.getAll())

export const getDeviceKey = () =>
    run<CryptoKey | undefined>(STORE_DEVICE, 'readonly', (store) => store.get('device'))

export async function getOrCreateDeviceKey(): Promise<CryptoKey> {
    const existing = await getDeviceKey()
    if (existing) return existing

    const candidate = await generateDeviceKey()

    try {
        await run(STORE_DEVICE, 'readwrite', (store) => store.add(candidate, 'device'))

        return candidate
    } catch {
        const winner = await getDeviceKey()
        if (!winner) throw new Error('Device key is unavailable')

        return winner
    }
}

export const clearVault = async (): Promise<void> => {
    for (const store of [
        STORE_META,
        STORE_KEYS,
        STORE_HOSTS,
        STORE_PROFILES,
        STORE_SNIPPETS,
        STORE_DEVICE
    ]) {
        await run(store, 'readwrite', (objectStore) => objectStore.clear())
    }
}

export const putKnownHosts = async (records: IKnownHostRecord[]): Promise<void> => {
    for (const record of records) await putKnownHost(record)
}

export const putNodeKeys = async (records: INodeKeyRecord[]): Promise<void> => {
    for (const record of records) await putNodeKey(record)
}

export const putConnectionProfiles = async (records: IConnectionProfileRecord[]): Promise<void> => {
    for (const record of records) await putConnectionProfile(record)
}

export const getAllSnippets = () =>
    run<ISnippetRecord[]>(STORE_SNIPPETS, 'readonly', (store) => store.getAll())

export const putSnippet = (record: ISnippetRecord) =>
    run(STORE_SNIPPETS, 'readwrite', (store) => store.put(record))

export const deleteSnippet = (id: string) =>
    run(STORE_SNIPPETS, 'readwrite', (store) => store.delete(id))

export const putSnippets = async (records: ISnippetRecord[]): Promise<void> => {
    for (const record of records) await putSnippet(record)
}
