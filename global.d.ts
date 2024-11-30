declare global {
    interface Window {
        XrayParseConfig: (config: string) => string | null
        onWasmInitialized?: () => void

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Go: typeof window.Go
    }
}

export {}
