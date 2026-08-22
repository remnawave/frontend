import { MonacoSetupHostJsonFieldsFeature } from '@features/dashboard/config-profiles/monaco-setup'
import { UseFormReturnType } from '@mantine/form'
import {
    CreateHostCommand,
    UpdateHostCommand,
    UpdateManyHostsCommand
} from '@remnawave/backend-contract'
import { TFunction } from 'i18next'
import { ComponentType } from 'react'
import { PiNetwork, PiPencilDuotone } from 'react-icons/pi'
import { TbCloudNetwork, TbMask } from 'react-icons/tb'

import { showModal } from '@shared/_modals/show-modal'
import {
    BASIC_FINAL_MASK_PARAMS,
    BASIC_MUX_PARAMS,
    BASIC_SOCKOPT_PARAMS,
    PASTE_BASIC_XHTTP_EXTRA_PARAMS
} from '@shared/constants'

type THostForm = UseFormReturnType<
    | CreateHostCommand.RequestBody
    | UpdateHostCommand.RequestBody
    | UpdateManyHostsCommand.RequestBody
>

export type THostJsonField = 'finalMask' | 'muxParams' | 'sockoptParams' | 'xhttpExtraParams'

export interface IHostJsonFieldConfig {
    buttonLabel: string
    docsUrl: string
    field: THostJsonField
    IconComponent: ComponentType<{ size: number }>
    path: string
    sample: string
    title: string
}

export const getHostJsonFields = (t: TFunction): IHostJsonFieldConfig[] => [
    {
        buttonLabel: 'xHTTP',
        docsUrl: 'https://xtls.github.io/ru/config/transports/splithttp.html',
        field: 'xhttpExtraParams',
        IconComponent: PiPencilDuotone,
        path: 'host-xhttp-extra://editor',
        sample: PASTE_BASIC_XHTTP_EXTRA_PARAMS,
        title: t('base-host-form.xhttp-extra-params')
    },
    {
        buttonLabel: 'Mux',
        docsUrl: 'https://xtls.github.io/ru/config/outbound.html#muxobject',
        field: 'muxParams',
        IconComponent: TbCloudNetwork,
        path: 'host-mux://editor',
        sample: BASIC_MUX_PARAMS,
        title: 'MUX'
    },
    {
        buttonLabel: 'SockOpt',
        docsUrl: 'https://xtls.github.io/ru/config/transports/sockopt.html',
        field: 'sockoptParams',
        IconComponent: PiNetwork,
        path: 'host-sockopt://editor',
        sample: BASIC_SOCKOPT_PARAMS,
        title: 'SockOpt'
    },
    {
        buttonLabel: 'Final Mask',
        docsUrl: 'https://xtls.github.io/ru/config/transports/finalmask.html',
        field: 'finalMask',
        IconComponent: TbMask,
        path: 'host-final-mask://editor',
        sample: BASIC_FINAL_MASK_PARAMS,
        title: 'Final Mask'
    }
]

export const openHostJsonFieldModal = (
    config: IHostJsonFieldConfig,
    form: THostForm,
    language: string
) => {
    const { docsUrl, field, IconComponent, path, sample, title } = config

    showModal('jsonEditorModal', {
        docsUrl,
        IconComponent,
        initialValue: (form.getValues()[field] as unknown as string) ?? '',
        onSave: (value) => form.setFieldValue(field, value),
        path,
        sample,
        setupSchema: () => MonacoSetupHostJsonFieldsFeature.setup(language),
        title
    })
}
