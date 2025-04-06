declare global {
    interface Window {
        Go: typeof window.Go
        onWasmInitialized?: () => void

        XrayParseConfig: (config: string) => null | string
    }
}

export {}
