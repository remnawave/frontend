import {
    IconBrandAndroid,
    IconBrandApple,
    IconBrandWindows,
    IconDeviceDesktop,
    IconDeviceTv
} from '@tabler/icons-react'
import {
    TSubscriptionPageLocales,
    TSubscriptionPagePlatformKey
} from '@remnawave/subscription-page-types'

export const PLATFORM_ICONS: Record<
    TSubscriptionPagePlatformKey,
    React.ComponentType<{ size: number }>
> = {
    android: IconBrandAndroid,
    androidTV: IconDeviceTv,
    appleTV: IconDeviceTv,
    ios: IconBrandApple,
    linux: IconDeviceDesktop,
    macos: IconBrandApple,
    windows: IconBrandWindows
}

export const PLATFORM_LABELS: Record<TSubscriptionPagePlatformKey, string> = {
    android: 'Android',
    androidTV: 'Android TV',
    appleTV: 'Apple TV',
    ios: 'iOS',
    linux: 'Linux',
    macos: 'macOS',
    windows: 'Windows'
}

export const LOCALE_LABELS: Record<TSubscriptionPageLocales, string> = {
    en: 'English',
    fa: 'Persian',
    fr: 'French',
    ru: 'Russian',
    zh: 'Chinese'
}

export const LOCALE_DATA: {
    code: TSubscriptionPageLocales
    flag: string
    isDefault?: boolean
    name: string
    nativeName: string
}[] = [
    { code: 'en', flag: '🇬🇧', isDefault: true, name: 'English', nativeName: 'Default' },
    { code: 'ru', flag: '🇷🇺', name: 'Russian', nativeName: 'Русский' },
    { code: 'zh', flag: '🇨🇳', name: 'Chinese', nativeName: '中文' },
    { code: 'fa', flag: '🇮🇷', name: 'Persian', nativeName: 'فارسی' },
    { code: 'fr', flag: '🇫🇷', name: 'French', nativeName: 'Français' }
]

export const AVAILABLE_PLATFORMS: { label: string; value: TSubscriptionPagePlatformKey }[] = [
    { label: 'iOS', value: 'ios' },
    { label: 'Android', value: 'android' },
    { label: 'Linux', value: 'linux' },
    { label: 'macOS', value: 'macos' },
    { label: 'Windows', value: 'windows' },
    { label: 'Android TV', value: 'androidTV' },
    { label: 'Apple TV', value: 'appleTV' }
]
