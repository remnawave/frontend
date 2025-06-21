import { parseURL } from 'ufo'

export const faviconResolver = (faviconLink: null | string) => {
    if (!faviconLink) return null
    const hostLink = parseURL(faviconLink).host
    if (hostLink) {
        return `https://icons.duckduckgo.com/ip2/${hostLink}.ico`
    }
    return null
}
