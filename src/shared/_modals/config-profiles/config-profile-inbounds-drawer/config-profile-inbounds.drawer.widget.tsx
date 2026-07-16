import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { Center, Drawer, Loader, Stack, Text } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { TbCirclesRelation } from 'react-icons/tb'

import { useNiceMantineModal } from '@shared/_modals/use-nice-modal'
import { useGetConfigProfileInbounds, useGetInternalSquads } from '@shared/api/hooks'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'

import { ConfigProfileInboundsTree } from './config-profile-inbounds.tree'

interface IProps {
    uuid: string
}

export const ConfigProfileInboundsDrawer = NiceModal.create((props: IProps) => {
    const { uuid } = props

    const { t } = useTranslation()

    const modal = useModal()
    const { modalProps } = useNiceMantineModal({ modal })

    const { data: configProfileInbounds, isLoading } = useGetConfigProfileInbounds({
        route: {
            uuid
        }
    })

    const { data: internalSquads, isLoading: isLoadingInternalSquads } = useGetInternalSquads({})

    const returnLoading = () => {
        return (
            <Center h={200}>
                <Stack align="center" gap="md">
                    <Loader size="lg" />
                    <Text c="dimmed">
                        {t('config-profile-inbounds.drawer.widget.fetching-inbounds')}
                    </Text>
                </Stack>
            </Center>
        )
    }

    return (
        <Drawer
            {...modalProps}
            padding="lg"
            position="right"
            size="500px"
            title={
                <BaseOverlayHeader
                    iconColor="teal"
                    IconComponent={TbCirclesRelation}
                    iconVariant="soft"
                    title={t('config-profile-inbounds.drawer.widget.inbounds-with-active-squads')}
                />
            }
        >
            {(isLoading || isLoadingInternalSquads) && returnLoading()}
            {!isLoading && !isLoadingInternalSquads && configProfileInbounds && internalSquads && (
                <ConfigProfileInboundsTree
                    inbounds={configProfileInbounds.inbounds}
                    internalSquads={internalSquads.internalSquads}
                />
            )}
        </Drawer>
    )
})
