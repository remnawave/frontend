import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { Center, Drawer, Stack, Text, ThemeIcon } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { TbSitemap } from 'react-icons/tb'

import { useNiceMantineModal } from '@shared/_modals/use-nice-modal'
import { useGetConfigProfiles, useGetHosts, useGetNodes } from '@shared/api/hooks'
import { LoadingScreen } from '@shared/ui'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { SectionCard } from '@shared/ui/section-card'

import { NodeInboundsHostsTree } from './node-inbounds-hosts.tree'

interface IProps {
    nodeUuid: string
}

export const NodeInboundsHostsDrawer = NiceModal.create((props: IProps) => {
    const { nodeUuid } = props

    const modal = useModal()
    const { modalProps } = useNiceMantineModal({
        modal,
        drawer: true
    })

    const { t } = useTranslation()

    const { data: nodes } = useGetNodes()
    const { data: configProfiles } = useGetConfigProfiles()
    const { data: hosts } = useGetHosts()

    const renderContent = () => {
        if (!nodes || !configProfiles || !hosts) {
            return <LoadingScreen />
        }

        const node = nodes.find((candidate) => candidate.uuid === nodeUuid)
        const configProfile = configProfiles.configProfiles.find(
            (profile) => profile.uuid === node?.configProfile.activeConfigProfileUuid
        )

        if (!node || !configProfile) {
            return (
                <SectionCard.Root p="xl">
                    <SectionCard.Section>
                        <Center py="xl">
                            <Stack align="center" gap="lg">
                                <ThemeIcon color="gray" radius="xl" size={64} variant="soft">
                                    <TbSitemap size={32} />
                                </ThemeIcon>

                                <Stack align="center" gap="xs">
                                    <Text c="dimmed" fw={600} size="md" ta="center">
                                        {t(
                                            'node-inbounds-hosts-drawer.widget.no-active-config-profile'
                                        )}
                                    </Text>
                                </Stack>
                            </Stack>
                        </Center>
                    </SectionCard.Section>
                </SectionCard.Root>
            )
        }

        return <NodeInboundsHostsTree configProfile={configProfile} hosts={hosts} node={node} />
    }

    return (
        <Drawer
            {...modalProps}
            padding="lg"
            position="right"
            size="800px"
            title={
                <BaseOverlayHeader
                    iconColor="cyan"
                    IconComponent={TbSitemap}
                    iconVariant="soft"
                    title={t('common.field.inbounds-hosts')}
                />
            }
        >
            {renderContent()}
        </Drawer>
    )
})
