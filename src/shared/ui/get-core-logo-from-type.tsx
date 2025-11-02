import { TSubscriptionTemplateType } from '@remnawave/backend-contract'
import { TbFile } from 'react-icons/tb'

import { MihomoLogo, SingboxLogo, StashLogo, XrayLogo } from './logos'

interface IProps {
    size?: number
    type: TSubscriptionTemplateType
}

export const getCoreLogoFromType = (props: IProps) => {
    const { type, size = 24 } = props

    switch (type) {
        case 'CLASH':
            return <MihomoLogo size={size} />
        case 'MIHOMO':
            return <MihomoLogo size={size} />
        case 'SINGBOX':
            return <SingboxLogo size={size} />
        case 'STASH':
            return <StashLogo size={size} />
        case 'XRAY_JSON':
            return <XrayLogo size={size} />
        default:
            return <TbFile size={size} />
    }
}
