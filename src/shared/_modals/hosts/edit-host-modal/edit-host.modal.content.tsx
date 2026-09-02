import { useForm, schemaResolver } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { UpdateHostCommand } from '@remnawave/backend-contract'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { queryClient } from '@shared/api'
import {
    QueryKeys,
    useCreateHost,
    useGetConfigProfiles,
    useGetHosts,
    useGetHostTags,
    useGetInternalSquads,
    useGetNodes,
    useGetSubscriptionTemplates,
    useReorderHosts,
    useUpdateHost
} from '@shared/api/hooks'
import { BaseHostForm } from '@shared/ui/forms/hosts/base-host-form'
import { LoaderModalShared } from '@shared/ui/loader-modal'
import { cloneString, parseJsonField, stringifyJsonField } from '@shared/utils/misc'

interface IProps {
    host: UpdateHostCommand.Response['response']
    onClose: () => void
}

export const EditHostDrawerContent = (props: IProps) => {
    const { host, onClose } = props
    const { t } = useTranslation()

    const { data: configProfiles } = useGetConfigProfiles()
    const { data: nodes } = useGetNodes()
    const { data: templates } = useGetSubscriptionTemplates()
    const { data: internalSquads } = useGetInternalSquads()
    const { data: hostTags } = useGetHostTags()
    const { data: hosts } = useGetHosts()

    const form = useForm<UpdateHostCommand.RequestBody>({
        name: 'edit-host-form',
        mode: 'uncontrolled',
        validateInputOnBlur: true,
        onValuesChange: (values) => {
            if (typeof values.vlessRouteId === 'string' && values.vlessRouteId === '') {
                form.setFieldValue('vlessRouteId', null)
            }
        },
        validate: schemaResolver(UpdateHostCommand.RequestBodySchema.omit({ uuid: true }))
    })

    const { mutate: updateHost, isPending: isUpdateHostPending } = useUpdateHost({
        mutationFns: {
            onSuccess: (data) => {
                queryClient.setQueryData(
                    QueryKeys.hosts.getHost({ uuid: host.uuid }).queryKey,
                    data
                )
                onClose()
            }
        }
    })

    useEffect(() => {
        if (configProfiles) {
            form.initialize({
                uuid: host.uuid,
                remark: host.remark,
                address: host.address,
                port: host.port,
                securityLayer: host.securityLayer,
                isDisabled: host.isDisabled,
                sni: host.sni ?? undefined,
                host: host.host ?? undefined,
                path: host.path ?? undefined,
                alpn: host.alpn ?? undefined,
                fingerprint: host.fingerprint ?? undefined,
                inbound: {
                    configProfileUuid: host.inbound.configProfileUuid ?? '',
                    configProfileInboundUuid: host.inbound.configProfileInboundUuid ?? ''
                },
                serverDescription: host.serverDescription ?? undefined,
                xhttpExtraParams: stringifyJsonField(host.xhttpExtraParams),
                muxParams: stringifyJsonField(host.muxParams),
                sockoptParams: stringifyJsonField(host.sockoptParams),
                finalMask: stringifyJsonField(host.finalMask),
                mapper: host.mapper,
                tags: host.tags ?? undefined,
                isHidden: host.isHidden,
                overrideSniFromAddress: host.overrideSniFromAddress,
                keepSniBlank: host.keepSniBlank,
                vlessRouteId: host.vlessRouteId ?? undefined,
                pinnedPeerCertSha256: host.pinnedPeerCertSha256 ?? undefined,
                verifyPeerCertByName: host.verifyPeerCertByName ?? undefined,
                shuffleHost: host.shuffleHost ?? undefined,
                mihomoX25519: host.mihomoX25519 ?? undefined,
                mihomoIpVersion: host.mihomoIpVersion ?? undefined,
                nodes: host.nodes ?? undefined,
                xrayJsonTemplateUuid: host.xrayJsonTemplateUuid ?? undefined,
                internalSquads: host.internalSquads ?? undefined,
                excludeFromSubscriptionTypes: host.excludeFromSubscriptionTypes ?? undefined
            })
        }
    }, [configProfiles])

    form.watch('inbound.configProfileInboundUuid', ({ value }) => {
        const { inbound } = form.getValues()
        if (!inbound?.configProfileUuid) {
            return
        }

        const configProfile = configProfiles?.configProfiles.find(
            (configProfile) => configProfile.uuid === inbound.configProfileUuid
        )
        if (configProfile) {
            form.setFieldValue(
                'port',
                configProfile.inbounds.find((inbound) => inbound.uuid === value)?.port ?? undefined
            )
        }
    })

    const { mutateAsync: createHost, isPending: isCreateHostPending } = useCreateHost()
    const { mutateAsync: reorderHosts } = useReorderHosts()

    const handleCloneHost = async () => {
        if (!host.inbound.configProfileUuid || !host.inbound.configProfileInboundUuid) {
            notifications.show({
                title: t('common.message.error'),
                message: t('edit-host-modal.widget.dangling-host-cannot-be-cloned'),
                color: 'red'
            })
            return
        }

        const clone = await createHost({
            variables: {
                ...host,
                remark: cloneString(host.remark),
                isDisabled: true,
                inbound: {
                    configProfileUuid: host.inbound.configProfileUuid,
                    configProfileInboundUuid: host.inbound.configProfileInboundUuid
                }
            }
        })
        if (!clone) return

        // ponytail: place clone right under parent, same as bulk clone does
        if (hosts) {
            const orderedUuids = hosts.flatMap((h) =>
                h.uuid === host.uuid ? [h.uuid, clone.uuid] : [h.uuid]
            )
            await reorderHosts({
                variables: {
                    hosts: orderedUuids.map((uuid, index) => ({ uuid, viewPosition: index }))
                }
            })
        }

        onClose()
    }

    const handleSubmit = form.onSubmit(async (values) => {
        updateHost({
            variables: {
                ...values,
                uuid: host.uuid,
                xhttpExtraParams: parseJsonField(values.xhttpExtraParams),
                muxParams: parseJsonField(values.muxParams),
                sockoptParams: parseJsonField(values.sockoptParams),
                finalMask: parseJsonField(values.finalMask)
            }
        })
    })

    if (!configProfiles || !nodes || !templates || !internalSquads || !hostTags) {
        return <LoaderModalShared mih="78vh" />
    }

    return (
        <BaseHostForm
            configProfiles={configProfiles.configProfiles}
            form={form}
            handleCloneHost={handleCloneHost}
            handleSubmit={handleSubmit}
            hostTags={hostTags.tags}
            internalSquads={internalSquads.internalSquads}
            isSubmitting={isUpdateHostPending || isCreateHostPending}
            nodes={nodes}
            hostUuid={host.uuid}
            subscriptionTemplates={templates.templates}
        />
    )
}
