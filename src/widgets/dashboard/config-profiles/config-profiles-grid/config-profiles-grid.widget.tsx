import { Card, Stack, Text, Title } from '@mantine/core'
import { modals } from '@mantine/modals'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { QueryKeys, useDeleteConfigProfile, useReorderConfigProfiles } from '@shared/api/hooks'
import { queryClient } from '@shared/api/query-client'
import { filterByTag, TagFilterBar } from '@shared/ui'
import { XrayLogo } from '@shared/ui/logos'
import { VirtualizedDndGrid } from '@shared/ui/virtualized-dnd-grid'

import {
    useSectionActiveTag,
    useViewPreferencesStoreActions
} from '@entities/dashboard/view-preferences-store'

import { ConfigProfileCardWidget } from '../config-profile-card/config-profile-card.widget'
import { IProps } from './interfaces'

export function ConfigProfilesGridWidget(props: IProps) {
    const { configProfiles } = props
    const { t } = useTranslation()

    const activeTag = useSectionActiveTag('configProfiles')
    const { setSectionActiveTag } = useViewPreferencesStoreActions()

    const visibleProfiles = useMemo(
        () => filterByTag(configProfiles ?? [], activeTag),
        [configProfiles, activeTag]
    )

    const { mutate: reorderConfigProfiles } = useReorderConfigProfiles({
        mutationFns: {
            onSuccess: (data) => {
                queryClient.setQueryData(QueryKeys.configProfiles.getConfigProfiles.queryKey, data)
            }
        }
    })

    const { mutate: deleteConfigProfile } = useDeleteConfigProfile({
        mutationFns: {
            onSuccess: () => {
                queryClient.refetchQueries({
                    queryKey: QueryKeys.configProfiles.getConfigProfiles.queryKey
                })
            }
        }
    })

    const handleDeleteProfile = (profileUuid: string) => {
        modals.openConfirmModal({
            title: t('common.action.confirm-action'),
            children: t('common.message.confirm-action-description'),
            labels: {
                confirm: t('common.action.delete'),
                cancel: t('common.action.cancel')
            },
            confirmProps: { color: 'red', variant: 'soft' },
            cancelProps: {
                variant: 'subtle'
            },
            centered: true,
            onConfirm: () => {
                deleteConfigProfile({
                    route: {
                        uuid: profileUuid
                    }
                })
            }
        })
    }

    const handleReorder = (reorderedItems: typeof configProfiles) => {
        reorderConfigProfiles({
            variables: {
                items: reorderedItems.map((item, index) => ({
                    uuid: item.uuid,
                    viewPosition: index
                }))
            }
        })
    }

    if (!configProfiles || configProfiles.length === 0) {
        return (
            <Card p="xl" withBorder>
                <Stack align="center" gap="md">
                    <XrayLogo size={48} style={{ opacity: 0.5 }} />
                    <div>
                        <Title c="dimmed" order={4} ta="center">
                            {t('config-profiles-grid.widget.no-config-profiles')}
                        </Title>
                        <Text c="dimmed" mt="xs" size="sm" ta="center">
                            {t(
                                'config-profiles-grid.widget.create-your-first-config-profile-to-get-started'
                            )}
                        </Text>
                    </div>
                </Stack>
            </Card>
        )
    }

    return (
        <VirtualizedDndGrid
            enableDnd={activeTag === null}
            header={
                <TagFilterBar
                    activeTag={activeTag}
                    items={configProfiles}
                    onChange={(tag) => setSectionActiveTag('configProfiles', tag)}
                />
            }
            items={visibleProfiles}
            onReorder={handleReorder}
            renderDragOverlay={(profile) => (
                <ConfigProfileCardWidget
                    configProfile={profile}
                    handleDeleteConfigProfile={handleDeleteProfile}
                    isDragOverlay
                />
            )}
            renderItem={(profile) => (
                <ConfigProfileCardWidget
                    configProfile={profile}
                    disableReordering={activeTag !== null}
                    handleDeleteConfigProfile={handleDeleteProfile}
                />
            )}
            useWindowScroll={true}
        />
    )
}
