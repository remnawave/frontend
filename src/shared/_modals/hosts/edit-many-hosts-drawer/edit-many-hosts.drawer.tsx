import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { Code, Drawer, List, Stack, Text } from '@mantine/core'
import { useForm, schemaResolver } from '@mantine/form'
import { modals } from '@mantine/modals'
import { notifications } from '@mantine/notifications'
import { INTERNAL_SQUADS_MODE, UpdateManyHostsCommand } from '@remnawave/backend-contract'
import { useTranslation } from 'react-i18next'
import { PiListChecks } from 'react-icons/pi'

import { useNiceMantineModal } from '@shared/_modals/use-nice-modal'
import { queryClient } from '@shared/api'
import {
    QueryKeys,
    useGetConfigProfiles,
    useGetHostTags,
    useGetInternalSquads,
    useGetNodes,
    useGetSubscriptionTemplates,
    useUpdateManyHosts
} from '@shared/api/hooks'
import { LoadingScreen } from '@shared/ui'
import { BaseHostForm } from '@shared/ui/forms/hosts/base-host-form'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { parseJsonField } from '@shared/utils/misc'

interface IProps {
    uuids: string[]
}

export const EditManyHostsDrawer = NiceModal.create((props: IProps) => {
    const { uuids } = props
    const { t } = useTranslation()

    const modal = useModal()
    const { modalProps, hide } = useNiceMantineModal({
        modal,
        drawer: true
    })

    const { data: configProfiles } = useGetConfigProfiles()
    const { data: nodes } = useGetNodes()
    const { data: templates } = useGetSubscriptionTemplates()
    const { data: internalSquads } = useGetInternalSquads()
    const { data: hostTags } = useGetHostTags()

    const form = useForm<UpdateManyHostsCommand.RequestBody>({
        name: 'edit-many-hosts-form',
        mode: 'uncontrolled',
        validateInputOnBlur: true,
        onValuesChange: (values) => {
            if (typeof values.vlessRouteId === 'string' && values.vlessRouteId === '') {
                form.setFieldValue('vlessRouteId', null)
            }
        },
        validate: schemaResolver(UpdateManyHostsCommand.RequestBodySchema.omit({ uuids: true })),

        initialValues: {
            uuids,
            internalSquads: {
                mode: INTERNAL_SQUADS_MODE.EXCLUDE,
                squads: []
            }
        }
    })

    const { mutate: updateManyHosts, isPending: isUpdateManyHostsPending } = useUpdateManyHosts({
        mutationFns: {
            onSuccess: async () => {
                hide()

                await queryClient.refetchQueries({
                    queryKey: QueryKeys.hosts.getAllTags.queryKey
                })

                await queryClient.refetchQueries({
                    queryKey: QueryKeys.hosts.getAllHosts.queryKey
                })
            }
        }
    })

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

    const handleSubmit = form.onSubmit(async (values) => {
        if (!uuids) {
            return
        }

        const dirtyValues = Object.fromEntries(
            Object.entries(values).filter(([key]) => form.isDirty(key))
        ) as Partial<UpdateManyHostsCommand.RequestBody>

        if (form.isDirty('xhttpExtraParams')) {
            dirtyValues.xhttpExtraParams = parseJsonField(values.xhttpExtraParams)
        }
        if (form.isDirty('muxParams')) {
            dirtyValues.muxParams = parseJsonField(values.muxParams)
        }
        if (form.isDirty('sockoptParams')) {
            dirtyValues.sockoptParams = parseJsonField(values.sockoptParams)
        }
        if (form.isDirty('finalMask')) {
            dirtyValues.finalMask = parseJsonField(values.finalMask)
        }

        const changedKeys = Object.keys(dirtyValues)

        if (changedKeys.length === 0) {
            notifications.show({
                title: t('edit-many-hosts-drawer.no-changes-title'),
                message: t('edit-many-hosts-drawer.no-changes-description'),
                color: 'yellow'
            })
            return
        }

        const formatValue = (value: unknown) => {
            if (value === null) {
                return 'null'
            }
            if (typeof value === 'object') {
                return JSON.stringify(value)
            }
            return String(value)
        }

        modals.openConfirmModal({
            title: t('edit-many-hosts-drawer.confirm-title'),
            centered: true,
            children: (
                <Stack gap="sm">
                    <Text size="sm">
                        {t('edit-many-hosts-drawer.confirm-description', {
                            count: uuids.length
                        })}
                    </Text>
                    <List size="sm" spacing={4}>
                        {changedKeys.map((key) => (
                            <List.Item key={key}>
                                <Text component="span" fw={600} size="sm">
                                    {key}
                                </Text>
                                {': '}
                                <Code>
                                    {formatValue(
                                        dirtyValues[key as keyof UpdateManyHostsCommand.RequestBody]
                                    )}
                                </Code>
                            </List.Item>
                        ))}
                    </List>
                </Stack>
            ),
            labels: {
                confirm: t('common.action.save'),
                cancel: t('common.action.cancel')
            },
            confirmProps: { color: 'teal', variant: 'soft' },
            onConfirm: () =>
                updateManyHosts({
                    variables: {
                        ...dirtyValues,
                        uuids: uuids
                    }
                })
        })
    })

    return (
        <Drawer
            {...modalProps}
            padding="lg"
            position="right"
            size="700px"
            title={
                <BaseOverlayHeader
                    iconColor="teal"
                    IconComponent={PiListChecks}
                    iconVariant="soft"
                    title={t('edit-host-modal.widget.edit-host')}
                    withCopy={true}
                />
            }
        >
            {!configProfiles || !nodes || !templates || !internalSquads || !hostTags ? (
                <LoadingScreen />
            ) : (
                <BaseHostForm
                    configProfiles={configProfiles.configProfiles}
                    form={form}
                    handleSubmit={handleSubmit}
                    hostTags={hostTags.tags}
                    internalSquads={internalSquads.internalSquads}
                    isBulkEdit
                    isSubmitting={isUpdateManyHostsPending}
                    nodes={nodes}
                    removeRequiredFields={true}
                    subscriptionTemplates={templates.templates}
                />
            )}
        </Drawer>
    )
})
