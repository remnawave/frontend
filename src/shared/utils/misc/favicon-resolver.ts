import { parseURL } from 'ufo'

export const faviconResolver = (faviconLink: null | string) => {
    if (!faviconLink) return null
    const { host, protocol } = parseURL(faviconLink, 'https://')
    if (host) {
        // return `https://icons.duckduckgo.com/ip2/${host}.ico`
        return `https://www.google.com/s2/favicons?sz=64&domain_url=${protocol}//${host}`
    }
    return null
}
