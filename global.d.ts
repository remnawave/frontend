declare global {
    interface Window {
        Go: any
        XrayParseConfig: (config: string) => string | null
        onWasmInitialized?: () => void
    }
}

export {}
