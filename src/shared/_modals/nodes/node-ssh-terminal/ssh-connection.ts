import {
    SSH_TERMINAL_WS_PROTOCOL,
    SshServerMessageSchema,
    TSshClientMessage
} from '@remnawave/backend-contract'

import {
    fromBase64,
    isOwnUserauthRequest,
    ISshPrivateKey,
    signSshChallenge,
    sshHostKeyIdentity,
    toBase64
} from '@entities/ssh-vault'

export interface ISshHostKeyPrompt {
    algo: string
    fingerprint: string
    knownFingerprint: null | string
    target: string
}

export type TSshStage = 'authenticating' | 'channel' | 'ready' | 'ticket' | 'verifying'

export interface ISshConnectionHandlers {
    onStage: (stage: TSshStage) => void
    onClosed: (reason: string) => void
    onData: (chunk: Uint8Array) => void
    onError: (message: string) => void
    onHostKey: (prompt: Omit<ISshHostKeyPrompt, 'knownFingerprint'>) => Promise<boolean>
    onReady: () => void
}

export interface ISshConnectionOptions {
    cols: number
    host: string
    port: number
    privateKey: ISshPrivateKey
    publicKeyLine: string
    rows: number
    ticket: string
    token: string
    url: string
    username: string
}

export class SshConnection {
    private socket: null | WebSocket = null
    private closed = false

    constructor(
        private readonly options: ISshConnectionOptions,
        private readonly handlers: ISshConnectionHandlers
    ) {}

    public open(): void {
        const socket = new WebSocket(this.options.url, [
            SSH_TERMINAL_WS_PROTOCOL,
            this.options.ticket,
            this.options.token
        ])
        socket.binaryType = 'arraybuffer'
        this.socket = socket

        socket.addEventListener('open', () => {
            this.handlers.onStage('channel')

            this.send({
                t: 'open',
                host: this.options.host,
                port: this.options.port,
                username: this.options.username,
                cols: this.options.cols,
                rows: this.options.rows
            })
        })

        socket.addEventListener('message', (event) => void this.onMessage(event))
        socket.addEventListener('close', () => {
            if (!this.closed) this.handlers.onClosed('connection closed')
        })
        socket.addEventListener('error', () => {
            this.handlers.onError('WebSocket error')
            this.close()
        })
    }

    public write(data: string): void {
        this.socket?.send(new TextEncoder().encode(data))
    }

    public resize(cols: number, rows: number): void {
        this.send({ t: 'resize', cols, rows })
    }

    public close(): void {
        this.closed = true
        this.options.privateKey.material.fill(0)
        this.socket?.close()
        this.socket = null
    }

    private async onMessage(event: MessageEvent): Promise<void> {
        if (event.data instanceof ArrayBuffer) {
            this.handlers.onData(new Uint8Array(event.data))
            return
        }

        const parsed = SshServerMessageSchema.safeParse(safeJsonParse(event.data as string))

        if (!parsed.success) {
            this.handlers.onError('Malformed control message')
            return
        }

        const message = parsed.data

        switch (message.t) {
            case 'agent-identities':
                this.handlers.onStage('authenticating')
                this.send({ t: 'identities', id: message.id, keys: [this.options.publicKeyLine] })
                break

            case 'agent-sign': {
                try {
                    const data = fromBase64(message.data)

                    if (
                        !isOwnUserauthRequest(
                            data,
                            this.options.username,
                            this.options.publicKeyLine
                        )
                    ) {
                        this.send({ t: 'error', id: message.id, message: 'Refused to sign' })
                        this.handlers.onError('Panel asked for an unexpected signature')
                        break
                    }

                    const signature = await signSshChallenge(
                        this.options.privateKey,
                        data,
                        message.hash
                    )
                    this.send({ t: 'sign', id: message.id, signature: toBase64(signature) })
                } catch {
                    this.send({ t: 'error', id: message.id, message: 'Signing failed' })
                }
                break
            }

            case 'error':
                this.handlers.onError(message.message)
                break

            case 'exit':
                this.handlers.onClosed(
                    message.signal ? `killed by ${message.signal}` : `exit code ${message.code}`
                )
                break

            case 'hostkey': {
                this.handlers.onStage('verifying')

                const identity = await sshHostKeyIdentity(fromBase64(message.key))

                const accepted = await this.handlers.onHostKey({
                    algo: identity.algo,
                    fingerprint: identity.fingerprint,
                    target: `${this.options.host}:${this.options.port}`
                })
                this.send({ t: 'hostkey', id: message.id, accept: accepted })
                break
            }

            case 'ready':
                this.handlers.onStage('ready')
                this.handlers.onReady()
                break

            default:
                break
        }
    }

    private send(message: TSshClientMessage): void {
        if (this.socket?.readyState !== WebSocket.OPEN) return
        this.socket.send(JSON.stringify(message))
    }
}

function safeJsonParse(raw: string): unknown {
    try {
        return JSON.parse(raw)
    } catch {
        return null
    }
}
