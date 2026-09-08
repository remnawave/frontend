export const resolveIpInfoUrl = (value: number | string, kind: 'as' | 'ip'): string =>
    kind === 'as' ? `https://ipinfo.io/AS${value}` : `https://ipinfo.io/${value}`
