import { SUBSCRIPTION_TEMPLATE_TYPE } from '@remnawave/backend-contract'

import { MihomoLogo, SingboxLogo, StashLogo } from '@shared/ui/logos'
import { XrayLogo } from '@shared/ui/logos/xray-logo'

export const SUBSCRIPTION_TYPES = {
    [SUBSCRIPTION_TEMPLATE_TYPE.XRAY_JSON]: {
        label: 'Xray JSON',
        icon: <XrayLogo size={16} />
    },
    [SUBSCRIPTION_TEMPLATE_TYPE.XRAY_BASE64]: {
        label: 'Xray Base64',
        icon: <XrayLogo size={16} />
    },
    [SUBSCRIPTION_TEMPLATE_TYPE.MIHOMO]: {
        label: 'Mihomo',
        icon: <MihomoLogo size={16} />
    },
    [SUBSCRIPTION_TEMPLATE_TYPE.STASH]: {
        label: 'Stash',
        icon: <StashLogo size={16} />
    },
    [SUBSCRIPTION_TEMPLATE_TYPE.SINGBOX]: {
        label: 'Singbox',
        icon: <SingboxLogo size={16} />
    },
    [SUBSCRIPTION_TEMPLATE_TYPE.CLASH]: {
        label: 'Clash',
        icon: <MihomoLogo size={16} />
    }
} as const
