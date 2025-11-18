import { Card, Stack, Text, Title } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { modals } from '@mantine/modals'

import { ActiveNodesListModalWithStoreShared } from '@shared/ui/config-profiles/active-nodes-list-modal-with-store/active-nodes-list-with-store.modal.shared'
import { QueryKeys, useDeleteConfigProfile, useReorderConfigProfiles } from '@shared/api/hooks'
import { VirtualizedDndGrid } from '@shared/ui/virtualized-dnd-grid'
import { queryClient } from '@shared/api/query-client'
import { XrayLogo } from '@shared/ui/logos'

import { ConfigProfileInboundsDrawerWidget } from '../config-profile-inbounds-drawer/config-profile-inbounds.drawer.widget'
import { ConfigProfileCardWidget } from '../config-profile-card/config-profile-card.widget'
import { IProps } from './interfaces'

export function ConfigProfilesGridWidget(props: IProps) {
    const { configProfiles } = props
    const { t } = useTranslation()

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
            title: t('common.confirm-action'),
            children: t('common.confirm-action-description'),
            labels: {
                confirm: t('common.delete'),
                cancel: t('common.cancel')
            },
            confirmProps: { color: 'red' },
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
        <>
            <VirtualizedDndGrid
                enableDnd={true}
                items={configProfiles}
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
                        handleDeleteConfigProfile={handleDeleteProfile}
                    />
                )}
                useWindowScroll={true}
            />

            <ConfigProfileInboundsDrawerWidget />
            <ActiveNodesListModalWithStoreShared />
        </>
    )
}
