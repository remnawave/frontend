import { ActionIcon, Button, Center, Group, Loader, ScrollArea, Stack, Text } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { modals } from '@mantine/modals'
import { useTranslation } from 'react-i18next'
import { TbCode, TbPlus, TbRefresh, TbX } from 'react-icons/tb'

import { HelpActionIconShared } from '@shared/_modals/universal'
import { useGetSnippets } from '@shared/api/hooks'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { SectionCard } from '@shared/ui/section-card'

import { MODALS, useModalClose, useModalState } from '@entities/dashboard/modal-store'

import { CREATE_SNIPPET_MODAL_ID, CreateSnippetModal } from './create-snippet.modal'
import { SnippetsGridWidget } from './snippets-grid.widget'

interface IProps {
    fromMainView?: boolean
}

export const SnippetsWidget = (props: IProps) => {
    const { fromMainView = false } = props

    const { t } = useTranslation()

    const { isOpen } = useModalState(MODALS.CONFIG_PROFILE_SHOW_SNIPPETS_DRAWER)
    const close = useModalClose(MODALS.CONFIG_PROFILE_SHOW_SNIPPETS_DRAWER)

    const isMobile = useMediaQuery('(max-width: 1200px)')

    const {
        data: snippets,
        isLoading,
        isRefetching,
        refetch
    } = useGetSnippets({
        rQueryParams: {
            enabled: !!isOpen
        }
    })

    const handleCreateModal = () => {
        modals.open({
            title: (
                <BaseOverlayHeader
                    iconColor="teal"
                    IconComponent={TbCode}
                    iconVariant="soft"
                    title={t('snippets.drawer.widget.create-snippet')}
                />
            ),
            centered: true,
            modalId: CREATE_SNIPPET_MODAL_ID,
            size: 'lg',
            children: <CreateSnippetModal />
        })
    }

    return (
        <SectionCard.Root>
            <SectionCard.Section>
                <Group align="flex-center" justify="space-between">
                    <BaseOverlayHeader
                        iconColor="teal"
                        IconComponent={TbCode}
                        iconSize={20}
                        iconVariant="soft"
                        title={t('snippets.drawer.widget.snippets')}
                        titleOrder={5}
                        withCopy
                    />

                    <Group gap="xs">
                        <HelpActionIconShared hidden={false} screen="PAGE_SNIPPETS" />

                        <ActionIcon
                            loading={isRefetching || isLoading}
                            onClick={() => {
                                refetch()
                            }}
                            size="input-sm"
                            variant="light"
                        >
                            <TbRefresh size="24px" />
                        </ActionIcon>

                        {fromMainView && (
                            <ActionIcon
                                color="teal"
                                onClick={handleCreateModal}
                                size="input-sm"
                                variant="light"
                            >
                                <TbPlus size="24px" />
                            </ActionIcon>
                        )}

                        {!isMobile && !fromMainView && (
                            <ActionIcon color="red" onClick={close} size="input-sm" variant="light">
                                <TbX size={24} />
                            </ActionIcon>
                        )}
                    </Group>
                </Group>
            </SectionCard.Section>

            {!fromMainView && (
                <SectionCard.Section>
                    <Button
                        fullWidth
                        leftSection={<TbPlus size={18} />}
                        onClick={handleCreateModal}
                        variant="default"
                    >
                        {t('snippets.drawer.widget.new-snippet')}
                    </Button>
                </SectionCard.Section>
            )}

            {fromMainView && (
                <SectionCard.Section>
                    {isLoading && (
                        <Center h={200}>
                            <Stack align="center" gap="md">
                                <Loader size="lg" />
                                <Text c="dimmed">
                                    {t('snippets.drawer.widget.fetching-snippets')}
                                </Text>
                            </Stack>
                        </Center>
                    )}
                    {!isLoading && <SnippetsGridWidget snippets={snippets} />}
                </SectionCard.Section>
            )}

            {!fromMainView && (
                <SectionCard.Section>
                    <ScrollArea h={!isMobile ? '700px' : '100%'}>
                        {isLoading && (
                            <Center h={200}>
                                <Stack align="center" gap="md">
                                    <Loader size="lg" />
                                    <Text c="dimmed">
                                        {t('snippets.drawer.widget.fetching-snippets')}
                                    </Text>
                                </Stack>
                            </Center>
                        )}
                        {!isLoading && <SnippetsGridWidget snippets={snippets} />}
                    </ScrollArea>
                </SectionCard.Section>
            )}
        </SectionCard.Root>
    )
}
