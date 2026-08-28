import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { ActionIcon, ModalProps, TagsInput } from '@mantine/core'
import { TagsSchema } from '@remnawave/backend-contract'
import { UseQueryResult } from '@tanstack/react-query'
import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TbDeviceFloppy, TbTag, TbTags } from 'react-icons/tb'

import { useNiceMantineModal } from '@shared/_modals/use-nice-modal'
import {
    QueryKeys,
    useGetConfigProfilesTags,
    useGetExternalSquadsTags,
    useGetInternalSquadsTags,
    useGetNodePluginsTags,
    useGetSubpageConfigsTags,
    useGetSubscriptionTemplatesTags,
    useSetConfigProfilesTags,
    useSetExternalSquadsTags,
    useSetInternalSquadsTags,
    useSetNodePluginsTags,
    useSetSubpageConfigsTags,
    useSetSubscriptionTemplatesTags
} from '@shared/api/hooks'
import { queryClient } from '@shared/api/query-client'
import { CompoundModalShared } from '@shared/ui/compound-modal/compound-modal.shared'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { TagInputPill } from '@shared/ui/tag-input-pill'

type EditTagsType =
    | 'configProfile'
    | 'externalSquad'
    | 'internalSquad'
    | 'nodePlugin'
    | 'subpageConfig'
    | 'template'

interface IProps {
    editTagsFrom: EditTagsType
    tags: string[]
    uuid: string
}

interface IBodyProps {
    modalProps: Omit<ModalProps, 'children' | 'title'>
    onSaved: () => void
    tags: string[]
    uuid: string
}

function makeBody(
    useKnownTags: () => UseQueryResult<{
        tags: string[]
    }>,
    useSetTags: (args: { mutationFns: { onSuccess: () => void } }) => {
        isPending: boolean
        mutate: (args: { variables: { tags: string[]; uuid: string } }) => void
    },
    queryKey: readonly unknown[],
    tagsQueryKey: readonly unknown[]
) {
    return function Body({ modalProps, onSaved, tags, uuid }: IBodyProps) {
        const { t } = useTranslation()
        const formId = useId()

        const { data: known, isLoading: isLoadingKnown } = useKnownTags()
        const { mutate, isPending } = useSetTags({
            mutationFns: {
                onSuccess: () => {
                    queryClient.refetchQueries({ queryKey })
                    queryClient.invalidateQueries({ queryKey: tagsQueryKey })
                    onSaved()
                }
            }
        })

        const [value, setValue] = useState<string[]>(tags)
        const [error, setError] = useState<null | string>(null)

        const handleChange = (next: string[]) => {
            const normalized = [
                ...new Set(next.map((tag) => tag.trim().toUpperCase()).filter(Boolean))
            ]

            setValue(normalized)

            const result = TagsSchema.safeParse(normalized)
            setError(result.success ? null : (result.error.issues[0]?.message ?? null))
        }

        return (
            <CompoundModalShared
                buttons={
                    <ActionIcon
                        color="teal"
                        disabled={!!error}
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
                        IconComponent={TbTags}
                        iconVariant="soft"
                        title={t('common.field.tags')}
                    />
                }
            >
                <form
                    id={formId}
                    onSubmit={(event) => {
                        event.preventDefault()
                        if (TagsSchema.safeParse(value).success) {
                            mutate({ variables: { uuid, tags: value } })
                        }
                    }}
                >
                    <TagsInput
                        clearable
                        data={known?.tags ?? []}
                        data-autofocus
                        error={error}
                        leftSection={<TbTag size="1.2rem" />}
                        loading={isLoadingKnown}
                        loadingPosition="left"
                        maxTags={10}
                        onChange={handleChange}
                        placeholder="ENV:PROD"
                        renderPill={({ value: tag, onRemove }) => (
                            <TagInputPill onRemove={onRemove} value={tag} />
                        )}
                        splitChars={[',', ' ', ';']}
                        value={value}
                    />
                </form>
            </CompoundModalShared>
        )
    }
}

const BODY_BY_KIND: Record<EditTagsType, ReturnType<typeof makeBody>> = {
    configProfile: makeBody(
        useGetConfigProfilesTags,
        useSetConfigProfilesTags,
        QueryKeys.configProfiles.getConfigProfiles.queryKey,
        QueryKeys.configProfiles.getConfigProfilesTags.queryKey
    ),
    externalSquad: makeBody(
        useGetExternalSquadsTags,
        useSetExternalSquadsTags,
        QueryKeys.externalSquads.getExternalSquads.queryKey,
        QueryKeys.externalSquads.getExternalSquadsTags.queryKey
    ),
    internalSquad: makeBody(
        useGetInternalSquadsTags,
        useSetInternalSquadsTags,
        QueryKeys.internalSquads.getInternalSquads.queryKey,
        QueryKeys.internalSquads.getInternalSquadsTags.queryKey
    ),
    nodePlugin: makeBody(
        useGetNodePluginsTags,
        useSetNodePluginsTags,
        QueryKeys.nodePlugins.getNodePlugins.queryKey,
        QueryKeys.nodePlugins.getNodePluginsTags.queryKey
    ),
    subpageConfig: makeBody(
        useGetSubpageConfigsTags,
        useSetSubpageConfigsTags,
        QueryKeys.subpageConfigs.getSubpageConfigs.queryKey,
        QueryKeys.subpageConfigs.getSubpageConfigsTags.queryKey
    ),
    template: makeBody(
        useGetSubscriptionTemplatesTags,
        useSetSubscriptionTemplatesTags,
        QueryKeys.subscriptionTemplate.getSubscriptionTemplates.queryKey,
        QueryKeys.subscriptionTemplate.getSubscriptionTemplatesTags.queryKey
    )
}

export const EditTagsModalShared = NiceModal.create((props: IProps) => {
    const { editTagsFrom, tags, uuid } = props
    const modal = useModal()
    const { modalProps, hide } = useNiceMantineModal({ modal })

    const Body = BODY_BY_KIND[editTagsFrom]

    return <Body modalProps={modalProps} onSaved={hide} tags={tags} uuid={uuid} />
})
