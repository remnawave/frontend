import { Text } from '@mantine/core'
import { ParseKeys } from 'i18next'
import { ComponentType } from 'react'
import { useTranslation } from 'react-i18next'

import * as Controls from './fields'
import { DimmedText, HelpPopover } from './fields/help'
import { useHostFormData } from './host-form-data.context'

export interface IHostOptionFieldKey {
    emptyValue: unknown
    key: string
    defaultValue?: unknown
}

type TTranslationKey = ParseKeys

export type THostOptionGroup =
    | 'group-advanced'
    | 'group-assignment'
    | 'group-client'
    | 'group-security'
    | 'group-subscription'
    | 'group-transport'

export interface IHostOptionField {
    Component: ComponentType
    fields: IHostOptionFieldKey[]
    group: THostOptionGroup
    kind: 'inline' | 'stacked'
    labelKey: TTranslationKey
    name: string
    helpKey?: TTranslationKey
    helpDocsUrl?: string
    plainLabel?: boolean
    HeaderControl?: ComponentType
    Help?: ComponentType
}

const XTLS_TLS_DOCS = 'https://xtls.github.io/ru/config/transports/tls.html#tlsobject'

const SniHelp = () => {
    const { t } = useTranslation()

    return (
        <HelpPopover>
            <DimmedText>
                {t('base-host-form.sni-description-line-1')}
                <br />
                <br />
                {t('base-host-form.sni-description-line-2')}
            </DimmedText>
        </HelpPopover>
    )
}

const ServerDescriptionHelp = () => {
    const { t } = useTranslation()

    return (
        <HelpPopover>
            <DimmedText>
                {t('base-host-form.server-description-1')}
                <br />
                <br />
                {t('base-host-form.server-description-2')}
            </DimmedText>
            <Text fw={600} size="sm">
                {t('base-host-form.supported-clients')}
            </Text>
            <DimmedText>
                Mihomo: FlClash X, Flowvy, prizrak-box, Koala Clash
                <br />
                Xray: Happ, Incy
            </DimmedText>
        </HelpPopover>
    )
}

const InternalSquadsHelp = () => {
    const { isAllowOnlyInternalSquads } = useHostFormData()
    const { t } = useTranslation()

    return (
        <HelpPopover>
            <DimmedText>
                {isAllowOnlyInternalSquads
                    ? t('base-host-form.allow-this-host-only-for-specific-internal-squads')
                    : t('base-host-form.exclude-this-host-from-specific-internal-squads')}
            </DimmedText>
        </HelpPopover>
    )
}

const text = (key: string): IHostOptionFieldKey => ({ key, emptyValue: '' })
const nullable = (key: string): IHostOptionFieldKey => ({ key, emptyValue: null })
const flag = (key: string): IHostOptionFieldKey => ({ key, emptyValue: false })
const list = (key: string): IHostOptionFieldKey => ({ key, emptyValue: [] })

export const HOST_OPTION_FIELDS: IHostOptionField[] = [
    {
        name: 'tags',
        Component: Controls.TagsOption,
        helpKey:
            'host-tags-input.tags-are-not-visible-to-end-users-tag-will-be-sent-with-raw-subscription-only',
        fields: [list('tags')],
        group: 'group-assignment',
        kind: 'stacked',
        labelKey: 'common.field.tags'
    },
    {
        name: 'nodes',
        Component: Controls.NodesOption,
        helpKey: 'base-host-form.pick-nodes-which-resolved-from-this-host-only-visual-assignment',
        fields: [list('nodes')],
        group: 'group-assignment',
        kind: 'stacked',
        labelKey: 'base-host-form.nodes'
    },
    {
        name: 'internalSquads',
        Component: Controls.InternalSquadsOption,
        fields: [
            { key: 'internalSquads.mode', emptyValue: 'EXCLUDE', defaultValue: 'EXCLUDE' },
            list('internalSquads.squads')
        ],
        group: 'group-assignment',
        HeaderControl: Controls.InternalSquadsModeControl,
        Help: InternalSquadsHelp,
        kind: 'stacked',
        labelKey: 'constants.internal-squads'
    },
    {
        name: 'sni',
        Component: Controls.SniOption,
        fields: [text('sni')],
        group: 'group-security',
        Help: SniHelp,
        kind: 'stacked',
        labelKey: 'base-host-form.sni'
    },
    {
        name: 'overrideSniFromAddress',
        Component: Controls.OverrideSniFromAddressOption,
        helpKey: 'base-host-form.override-sni-from-address-description',
        fields: [flag('overrideSniFromAddress')],
        group: 'group-security',
        kind: 'inline',
        labelKey: 'base-host-form.override-sni-from-address'
    },
    {
        name: 'keepSniBlank',
        Component: Controls.KeepSniBlankOption,
        helpKey: 'base-host-form.keep-sni-blank-description',
        fields: [flag('keepSniBlank')],
        group: 'group-security',
        kind: 'inline',
        labelKey: 'base-host-form.keep-sni-blank'
    },
    {
        name: 'securityLayer',
        Component: Controls.SecurityLayerOption,
        fields: [{ key: 'securityLayer', emptyValue: 'DEFAULT', defaultValue: 'DEFAULT' }],
        group: 'group-security',
        kind: 'stacked',
        labelKey: 'base-host-form.security-layer'
    },
    {
        name: 'fingerprint',
        Component: Controls.FingerprintOption,
        fields: [nullable('fingerprint')],
        group: 'group-security',
        kind: 'stacked',
        labelKey: 'base-host-form.fingerprint'
    },
    {
        name: 'vlessRouteId',
        Component: Controls.VlessRouteIdOption,
        helpKey: 'base-host-form.vless-route-description',
        helpDocsUrl: 'https://xtls.github.io/config/routing.html',
        fields: [nullable('vlessRouteId')],
        group: 'group-transport',
        kind: 'stacked',
        labelKey: 'base-host-form.vless-route-id'
    },
    {
        name: 'host',
        Component: Controls.HostOption,
        fields: [text('host')],
        group: 'group-transport',
        kind: 'stacked',
        labelKey: 'base-host-form.host'
    },
    {
        name: 'path',
        Component: Controls.PathOption,
        fields: [text('path')],
        group: 'group-transport',
        kind: 'stacked',
        labelKey: 'base-host-form.path'
    },
    {
        name: 'alpn',
        Component: Controls.AlpnOption,
        fields: [nullable('alpn')],
        group: 'group-transport',
        kind: 'stacked',
        labelKey: 'base-host-form.alpn'
    },
    {
        name: 'serverDescription',
        Component: Controls.ServerDescriptionOption,
        fields: [text('serverDescription')],
        group: 'group-subscription',
        Help: ServerDescriptionHelp,
        kind: 'stacked',
        labelKey: 'base-host-form.server-description-header'
    },
    {
        name: 'excludeFromSubscriptionTypes',
        Component: Controls.ExcludeFromSubscriptionTypesOption,
        fields: [list('excludeFromSubscriptionTypes')],
        group: 'group-subscription',
        plainLabel: true,
        kind: 'stacked',
        labelKey: 'base-host-form.exclude-from-subscription-type'
    },
    {
        name: 'isHidden',
        Component: Controls.IsHiddenOption,
        helpKey: 'base-host-form.hidden-host-description',
        fields: [flag('isHidden')],
        group: 'group-subscription',
        kind: 'inline',
        labelKey: 'base-host-form.hide-host'
    },
    {
        name: 'shuffleHost',
        Component: Controls.ShuffleHostOption,
        helpKey: 'base-host-form.shuffled-hosts-hover-card',
        fields: [flag('shuffleHost')],
        group: 'group-subscription',
        kind: 'inline',
        labelKey: 'base-host-form.shuffle-host'
    },
    {
        name: 'xrayJsonTemplateUuid',
        Component: Controls.XrayJsonTemplateUuidOption,
        fields: [nullable('xrayJsonTemplateUuid')],
        group: 'group-advanced',
        kind: 'stacked',
        labelKey: 'base-host-form.xray-json-template'
    },
    {
        name: 'mapper',
        Component: Controls.MapperOption,
        fields: [{ key: 'mapper', emptyValue: {} }],
        group: 'group-advanced',
        kind: 'inline',
        labelKey: 'base-host-form.mapper',
        plainLabel: true
    },
    {
        name: 'muxParams',
        Component: Controls.MuxParamsOption,
        fields: [nullable('muxParams')],
        group: 'group-advanced',
        kind: 'inline',
        labelKey: 'base-host-form.mux-params',
        plainLabel: true
    },
    {
        name: 'finalMask',
        Component: Controls.FinalMaskOption,
        fields: [nullable('finalMask')],
        group: 'group-advanced',
        kind: 'inline',
        labelKey: 'base-host-form.final-mask-params',
        plainLabel: true
    },
    {
        name: 'xhttpExtraParams',
        Component: Controls.XhttpExtraParamsOption,
        fields: [nullable('xhttpExtraParams')],
        group: 'group-advanced',
        kind: 'inline',
        labelKey: 'base-host-form.xhttp-extra-params',
        plainLabel: true
    },
    {
        name: 'sockoptParams',
        Component: Controls.SockoptParamsOption,
        fields: [nullable('sockoptParams')],
        group: 'group-advanced',
        kind: 'inline',
        labelKey: 'base-host-form.sockopt-params',
        plainLabel: true
    },
    {
        name: 'pinnedPeerCertSha256',
        Component: Controls.PinnedPeerCertSha256Option,
        fields: [text('pinnedPeerCertSha256')],
        group: 'group-client',
        helpDocsUrl: XTLS_TLS_DOCS,
        kind: 'stacked',
        labelKey: 'base-host-form.pinned-peer-cert-sha256'
    },
    {
        name: 'verifyPeerCertByName',
        Component: Controls.VerifyPeerCertByNameOption,
        fields: [text('verifyPeerCertByName')],
        group: 'group-client',
        helpDocsUrl: XTLS_TLS_DOCS,
        kind: 'stacked',
        labelKey: 'base-host-form.verify-peer-cert-by-name'
    },
    {
        name: 'mihomoX25519',
        Component: Controls.MihomoX25519Option,
        fields: [flag('mihomoX25519')],
        group: 'group-client',
        helpDocsUrl:
            'https://wiki.metacubex.one/en/config/proxies/tls/#reality-optssupport-x25519mlkem768',
        kind: 'inline',
        labelKey: 'base-host-form.mihomo-x25519'
    },
    {
        name: 'mihomoIpVersion',
        Component: Controls.MihomoIpVersionOption,
        fields: [nullable('mihomoIpVersion')],
        group: 'group-client',
        helpDocsUrl: 'https://wiki.metacubex.one/ru/config/proxies/#ip-version',
        kind: 'stacked',
        labelKey: 'base-host-form.mihomo-ip-version'
    }
]

export const HOST_OPTION_GROUPS: THostOptionGroup[] = [
    'group-assignment',
    'group-security',
    'group-transport',
    'group-subscription',
    'group-advanced',
    'group-client'
]

export const HOST_OPTION_FIELD_BY_NAME = new Map(
    HOST_OPTION_FIELDS.map((field) => [field.name, field])
)

export const HOST_OPTION_KEY_BY_NAME = new Map(
    HOST_OPTION_FIELDS.flatMap((field) => field.fields.map((formKey) => [formKey.key, formKey]))
)

export const HOST_OPTION_NAMES_BY_GROUP = new Map(
    HOST_OPTION_GROUPS.map((group) => [
        group,
        HOST_OPTION_FIELDS.filter((field) => field.group === group).map((field) => field.name)
    ])
)

export function isOptionSet(
    value: unknown,
    field: Pick<IHostOptionFieldKey, 'defaultValue'>
): boolean {
    if (value === undefined || value === null) {
        return false
    }

    if (field.defaultValue !== undefined) {
        return value !== field.defaultValue
    }

    if (value === '' || value === false) {
        return false
    }

    if (Array.isArray(value)) {
        return value.length > 0
    }

    if (typeof value === 'object') {
        return Object.keys(value).length > 0
    }

    return true
}
