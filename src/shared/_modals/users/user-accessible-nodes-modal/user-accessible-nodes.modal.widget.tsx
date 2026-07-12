import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { Center, Drawer, Stack, Text, ThemeIcon } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { TbServer } from 'react-icons/tb'

import { useNiceMantineModal } from '@shared/_modals/use-nice-modal'
import { useGetUserAccessibleNodes } from '@shared/api/hooks'
import { LoadingScreen } from '@shared/ui'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { SectionCard } from '@shared/ui/section-card'

import { UserAccessibleNodesTree } from './user-accessible-nodes.tree'

interface IProps {
    userId: number
}

export const UserAccessibleNodesModal = NiceModal.create((props: IProps) => {
    const { userId } = props
    const modal = useModal()
    const { modalProps } = useNiceMantineModal({ modal, drawer: true })

    const { t } = useTranslation()

    const { data: userAccessibleNodes, isLoading } = useGetUserAccessibleNodes({
        route: {
            userId
        }
    })

    const activeNodes = userAccessibleNodes?.activeNodes ?? []

    return (
        <Drawer
            {...modalProps}
            position="right"
            size="800px"
            title={
                <BaseOverlayHeader
                    iconColor="teal"
                    IconComponent={TbServer}
                    iconVariant="soft"
                    title={t('user-accessible-nodes.modal.widget.user-accessible-nodes')}
                />
            }
        >
            {isLoading && <LoadingScreen />}
            {!isLoading && activeNodes.length === 0 && (
                <SectionCard.Root p="xl">
                    <SectionCard.Section>
                        <Center py="xl">
                            <Stack align="center" gap="lg">
                                <ThemeIcon color="gray" radius="xl" size={64} variant="soft">
                                    <TbServer size={32} />
                                </ThemeIcon>

                                <Stack align="center" gap="xs">
                                    <Text c="dimmed" fw={600} size="md" ta="center">
                                        {t('common.nothing-found')}
                                    </Text>
                                </Stack>
                            </Stack>
                        </Center>
                    </SectionCard.Section>
                </SectionCard.Root>
            )}
            {!isLoading && activeNodes.length > 0 && (
                <UserAccessibleNodesTree activeNodes={activeNodes} />
            )}
        </Drawer>
    )
})
