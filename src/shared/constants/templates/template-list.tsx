import { TSubscriptionTemplateType } from '@remnawave/backend-contract'

export interface DownloadableSubscriptionTemplate {
    author: string
    name: string
    type: TSubscriptionTemplateType
    url: string
}

export const downloadableConfigTemplates: DownloadableSubscriptionTemplate[] = [
    {
        name: 'Default Xray Core config',
        author: 'remnawave',
        type: 'XRAY_JSON',
        url: 'https://raw.githubusercontent.com/remnawave/templates/refs/heads/main/remnawave-default/xray-core/config.json'
    }
]

export const downloadableSubscriptionTemplates: DownloadableSubscriptionTemplate[] = [
    {
        name: 'Default Clash',
        type: 'CLASH',
        author: 'remnawave',
        url: 'https://raw.githubusercontent.com/remnawave/templates/refs/heads/main/remnawave-default/subscription-templates/clash.yaml'
    },
    {
        name: 'Default Mihomo',
        type: 'MIHOMO',
        author: 'remnawave',
        url: 'https://raw.githubusercontent.com/remnawave/templates/refs/heads/main/remnawave-default/subscription-templates/mihomo.yaml'
    },
    {
        name: 'Default Stash',
        type: 'STASH',
        author: 'remnawave',
        url: 'https://raw.githubusercontent.com/remnawave/templates/refs/heads/main/remnawave-default/subscription-templates/stash.yaml'
    },
    {
        name: 'Default Singbox',
        type: 'SINGBOX',
        author: 'remnawave',
        url: 'https://raw.githubusercontent.com/remnawave/templates/refs/heads/main/remnawave-default/subscription-templates/singbox.json'
    },
    {
        name: 'Default Singbox Legacy',
        type: 'SINGBOX_LEGACY',
        author: 'remnawave',
        url: 'https://raw.githubusercontent.com/remnawave/templates/refs/heads/main/remnawave-default/subscription-templates/singbox-legacy.json'
    },
    {
        name: 'Default Xray JSON',
        type: 'XRAY_JSON',
        author: 'remnawave',
        url: 'https://raw.githubusercontent.com/remnawave/templates/refs/heads/main/remnawave-default/subscription-templates/xray-json.json'
    },

    {
        name: 'Xray JSON (without RU)',
        type: 'XRAY_JSON',
        author: 'legiz-ru',
        url: 'https://raw.githubusercontent.com/remnawave/templates/refs/heads/main/by-legiz/subscription-templates/xray-json-simple-without-ru.json'
    },
    {
        name: 'Xray JSON (RU bundle)',
        type: 'XRAY_JSON',
        author: 'legiz-ru',
        url: 'https://raw.githubusercontent.com/remnawave/templates/refs/heads/main/by-legiz/subscription-templates/xray-json-ru-bundle.json'
    },
    {
        name: 'Xray JSON (RU bundle, category: ads, all)',
        type: 'XRAY_JSON',
        author: 'legiz-ru',
        url: 'https://raw.githubusercontent.com/remnawave/templates/refs/heads/main/by-legiz/subscription-templates/xray-json-ru-bundle-category-ads-all.json'
    },
    {
        name: 'Singbox (RU bundle)',
        type: 'SINGBOX',
        author: 'legiz-ru',
        url: 'https://raw.githubusercontent.com/remnawave/templates/refs/heads/main/by-legiz/subscription-templates/singbox-ru-bundle.json'
    },
    {
        name: 'Singbox (RU bundle, oisd-big)',
        type: 'SINGBOX',
        author: 'legiz-ru',
        url: 'https://raw.githubusercontent.com/remnawave/templates/refs/heads/main/by-legiz/subscription-templates/singbox-ru-bundle-oisd-big.json'
    },

    {
        name: 'Mihomo (without RU)',
        type: 'MIHOMO',
        author: 'legiz-ru',
        url: 'https://raw.githubusercontent.com/remnawave/templates/refs/heads/main/by-legiz/subscription-templates/mihomo-simple-without-ru.yaml'
    },
    {
        name: 'Mihomo (RU bundle)',
        type: 'MIHOMO',
        author: 'legiz-ru',
        url: 'https://raw.githubusercontent.com/remnawave/templates/refs/heads/main/by-legiz/subscription-templates/mihomo-ru-bundle.yaml'
    }
]
