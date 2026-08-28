import type { TQuickIconName, TQuickModalId } from './quick-links.types'
import type { ParseKeys } from 'i18next'
import type { IconType } from 'react-icons'

import {
    TbActivity,
    TbBell,
    TbBolt,
    TbBook,
    TbBrandDocker,
    TbBrandGithub,
    TbBrandTelegram,
    TbBug,
    TbCalendar,
    TbChartArcs,
    TbChartLine,
    TbCloud,
    TbCode,
    TbCreditCard,
    TbDatabase,
    TbExternalLink,
    TbFlame,
    TbFolder,
    TbGauge,
    TbKey,
    TbLink,
    TbLock,
    TbMail,
    TbNumber1,
    TbNumber2,
    TbNumber3,
    TbNumber4,
    TbNumber5,
    TbNumber6,
    TbNumber7,
    TbNumber8,
    TbNumber9,
    TbRadar,
    TbRocket,
    TbServer,
    TbShieldLock,
    TbStar,
    TbTerminal2,
    TbUser,
    TbUsers,
    TbWorld
} from 'react-icons/tb'

import { showModal } from '@shared/_modals/show-modal'

import type { IExperimentalFeatures } from '@entities/dashboard/view-preferences-store'

export interface IQuickModalEntry {
    experimental?: keyof IExperimentalFeatures
    Icon: IconType
    labelKey: ParseKeys
    open: () => void
}

export const QUICK_MODALS: Record<TQuickModalId, IQuickModalEntry> = {
    snippets: {
        Icon: TbCode,
        labelKey: 'snippets.drawer.widget.snippets',
        open: () => showModal('snippets_snippetsModal')
    },
    sshTerminal: {
        experimental: 'sshTerminal',
        Icon: TbTerminal2,
        labelKey: 'node-ssh.title',
        open: () => showModal('nodes_nodeSshTerminal', {})
    }
}

export const QUICK_ICONS: Record<TQuickIconName, IconType> = {
    TbActivity,
    TbBell,
    TbBolt,
    TbBook,
    TbBrandDocker,
    TbBrandGithub,
    TbBrandTelegram,
    TbBug,
    TbCalendar,
    TbChartArcs,
    TbChartLine,
    TbCloud,
    TbCode,
    TbCreditCard,
    TbDatabase,
    TbExternalLink,
    TbFlame,
    TbFolder,
    TbGauge,
    TbKey,
    TbLink,
    TbLock,
    TbMail,
    TbNumber1,
    TbNumber2,
    TbNumber3,
    TbNumber4,
    TbNumber5,
    TbNumber6,
    TbNumber7,
    TbNumber8,
    TbNumber9,
    TbRadar,
    TbRocket,
    TbServer,
    TbShieldLock,
    TbStar,
    TbTerminal2,
    TbUser,
    TbUsers,
    TbWorld
}
