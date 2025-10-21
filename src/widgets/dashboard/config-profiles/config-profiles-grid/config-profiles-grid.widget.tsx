import { Card, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { modals } from '@mantine/modals'

import { ActiveNodesListModalWithStoreShared } from '@shared/ui/config-profiles/active-nodes-list-modal-with-store/active-nodes-list-with-store.modal.shared'
import { QueryKeys, useDeleteConfigProfile } from '@shared/api/hooks'
import { queryClient } from '@shared/api/query-client'
import { XrayLogo } from '@shared/ui/logos'

import { ConfigProfileInboundsDrawerWidget } from '../config-profile-inbounds-drawer/config-profile-inbounds.drawer.widget'
import { ConfigProfileCardWidget } from '../config-profile-card/config-profile-card.widget'
import { IProps } from './interfaces'

export function ConfigProfilesGridWidget(props: IProps) {
    const { configProfiles } = props
    const { t } = useTranslation()

    const { mutate: deleteConfigProfile } = useDeleteConfigProfile({
        mutationFns: {
            onSuccess: () => {
                queryClient.refetchQueries({
                    queryKey: QueryKeys.configProfiles.getConfigProfiles.queryKey
                })
            }
        }
    })

    const handleDeleteProfile = (profileUuid: string, profileName: string) => {
        modals.openConfirmModal({
            title: t('config-profiles-grid.widget.delete-config-profile'),
            children: (
                <Text size="sm">
                    {t(
                        'config-profiles-grid.widget.are-you-sure-you-want-to-delete-the-config-profile',
                        {
                            profileName
                        }
                    )}
                    <br />
                    {t('config-profiles-grid.widget.this-action-cannot-be-undone')}
                </Text>
            ),
            labels: {
                confirm: t('config-profiles-grid.widget.delete'),
                cancel: t('config-profiles-grid.widget.cancel')
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

    const isHighCount = configProfiles.length > 6

    return (
        <SimpleGrid
            cols={{
                base: 1,
                '800px': 2,
                '1000px': 3,
                '1200px': 4,
                '1800px': 5,
                '2400px': 6,
                '3000px': 7
            }}
            type="container"
        >
            {configProfiles.map((profile, index) => (
                <ConfigProfileCardWidget
                    configProfile={profile}
                    handleDeleteConfigProfile={handleDeleteProfile}
                    index={index}
                    isHighCount={isHighCount}
                    key={profile.uuid}
                />
            ))}
            <ConfigProfileInboundsDrawerWidget />
            <ActiveNodesListModalWithStoreShared />
        </SimpleGrid>
    )
}
