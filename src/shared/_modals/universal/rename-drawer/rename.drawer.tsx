import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { ActionIcon, ModalProps, TextInput } from '@mantine/core'
import { useField } from '@mantine/form'
import {
    UpdateConfigProfileCommand,
    UpdateExternalSquadCommand,
    UpdateInternalSquadCommand,
    UpdateNodePluginCommand,
    UpdatePasskeyCommand,
    UpdateSubpageConfigCommand,
    UpdateSubscriptionTemplateCommand
} from '@remnawave/backend-contract'
import { ReactNode, useId } from 'react'
import { useTranslation } from 'react-i18next'
import { TbDeviceFloppy, TbPencil } from 'react-icons/tb'

import { useNiceMantineModal } from '@shared/_modals/use-nice-modal'
import {
    QueryKeys,
    useUpdateConfigProfile,
    useUpdateExternalSquad,
    useUpdateInternalSquad,
    useUpdateNodePlugin,
    useUpdatePasskey,
    useUpdateSubpageConfig,
    useUpdateSubscriptionTemplate
} from '@shared/api/hooks'
import { queryClient } from '@shared/api/query-client'
import { CompoundModalShared } from '@shared/ui/compound-modal/compound-modal.shared'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'

type RenameType =
    | 'configProfile'
    | 'externalSquad'
    | 'internalSquad'
    | 'nodePlugin'
    | 'passkey'
    | 'subpageConfig'
    | 'template'

interface IProps {
    name: string
    renameFrom: RenameType
    uuid: string
}

interface IBodyProps {
    modalProps: Omit<ModalProps, 'children' | 'title'>
    name: string
    onSaved: () => void
    uuid: string
}

const validateWith =
    (schema: {
        safeParse: (value: unknown) => {
            error?: { issues: { message: string }[] }
            success: boolean
        }
    }) =>
    (value: string) => {
        const result = schema.safeParse({ name: value })

        return result.success ? null : (result.error?.issues[0]?.message ?? null)
    }

function makeBody<V>(options: {
    buildVariables: (uuid: string, name: string) => V
    queryKey: readonly unknown[]
    useUpdate: (args: { mutationFns: { onSuccess: () => void } }) => {
        isPending: boolean
        mutate: (args: { variables: V }) => void
    }
    validate: (value: string) => null | string
}) {
    const { buildVariables, queryKey, useUpdate, validate } = options

    return function Body({ modalProps, name, onSaved, uuid }: IBodyProps) {
        const { t } = useTranslation()
        const formId = useId()

        const nameField = useField<string>({
            mode: 'controlled',
            initialValue: '',
            validate
        })

        const { mutate, isPending } = useUpdate({
            mutationFns: {
                onSuccess: () => {
                    queryClient.refetchQueries({ queryKey })
                    onSaved()
                }
            }
        })

        const handleSubmit = async () => {
            if (await nameField.validate()) return

            mutate({ variables: buildVariables(uuid, nameField.getValue()) })
        }

        return (
            <CompoundModalShared
                buttons={
                    <ActionIcon
                        color="teal"
                        disabled={!!nameField.error || !nameField.getValue()}
                        form={formId}
                        loading={isPending}
                        type="submit"
                        size="lg"
                        variant="soft"
                    >
                        <TbDeviceFloppy size="20px" />
                    </ActionIcon>
                }
                modalProps={modalProps}
                title={
                    <BaseOverlayHeader
                        iconColor="teal"
                        IconComponent={TbPencil}
                        iconVariant="soft"
                        title={t('common.action.rename')}
                    />
                }
            >
                <form
                    id={formId}
                    onSubmit={(event) => {
                        event.preventDefault()
                        handleSubmit()
                    }}
                >
                    <TextInput
                        data-autofocus
                        key={nameField.key}
                        placeholder={name}
                        {...nameField.getInputProps()}
                        required
                    />
                </form>
            </CompoundModalShared>
        )
    }
}

const BODY_BY_KIND: Record<RenameType, (props: IBodyProps) => ReactNode> = {
    configProfile: makeBody({
        buildVariables: (uuid, name) => ({ uuid, name }),
        queryKey: QueryKeys.configProfiles.getConfigProfiles.queryKey,
        useUpdate: useUpdateConfigProfile,
        validate: validateWith(UpdateConfigProfileCommand.RequestBodySchema.omit({ uuid: true }))
    }),
    externalSquad: makeBody({
        buildVariables: (uuid, name) => ({ uuid, name }),
        queryKey: QueryKeys.externalSquads.getExternalSquads.queryKey,
        useUpdate: useUpdateExternalSquad,
        validate: validateWith(UpdateExternalSquadCommand.RequestBodySchema.omit({ uuid: true }))
    }),
    internalSquad: makeBody({
        buildVariables: (uuid, name) => ({ uuid, name }),
        queryKey: QueryKeys.internalSquads.getInternalSquads.queryKey,
        useUpdate: useUpdateInternalSquad,
        validate: validateWith(UpdateInternalSquadCommand.RequestBodySchema.omit({ uuid: true }))
    }),
    nodePlugin: makeBody({
        buildVariables: (uuid, name) => ({ uuid, name }),
        queryKey: QueryKeys.nodePlugins.getNodePlugins.queryKey,
        useUpdate: useUpdateNodePlugin,
        validate: validateWith(UpdateNodePluginCommand.RequestBodySchema.omit({ uuid: true }))
    }),
    passkey: makeBody({
        buildVariables: (uuid, name) => ({ id: uuid, name }),
        queryKey: QueryKeys.passkeys.getPasskeys.queryKey,
        useUpdate: useUpdatePasskey,
        validate: validateWith(UpdatePasskeyCommand.RequestBodySchema.omit({ id: true }))
    }),
    subpageConfig: makeBody({
        buildVariables: (uuid, name) => ({ uuid, name }),
        queryKey: QueryKeys.subpageConfigs.getSubpageConfigs.queryKey,
        useUpdate: useUpdateSubpageConfig,
        validate: validateWith(UpdateSubpageConfigCommand.RequestBodySchema.omit({ uuid: true }))
    }),
    template: makeBody({
        buildVariables: (uuid, name) => ({ uuid, name }),
        queryKey: QueryKeys.subscriptionTemplate.getSubscriptionTemplates.queryKey,
        useUpdate: useUpdateSubscriptionTemplate,
        validate: validateWith(
            UpdateSubscriptionTemplateCommand.RequestBodySchema.omit({ uuid: true })
        )
    })
}

export const RenameModalShared = NiceModal.create((props: IProps) => {
    const { name, renameFrom, uuid } = props
    const modal = useModal()
    const { modalProps, hide } = useNiceMantineModal({ modal })

    const Body = BODY_BY_KIND[renameFrom]

    return <Body modalProps={modalProps} name={name} onSaved={hide} uuid={uuid} />
})
