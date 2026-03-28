import {
    ActionIcon,
    Button,
    Center,
    Code,
    Group,
    Loader,
    ScrollArea,
    Stack,
    Text
} from '@mantine/core'
import { TbCode, TbPlus, TbQuestionMark, TbRefresh, TbX } from 'react-icons/tb'
import { useMediaQuery } from '@mantine/hooks'
import { useTranslation } from 'react-i18next'
import { modals } from '@mantine/modals'

import { MODALS, useModalClose, useModalState } from '@entities/dashboard/modal-store'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { SectionCard } from '@shared/ui/section-card'
import { useGetSnippets } from '@shared/api/hooks'

import { CREATE_SNIPPET_MODAL_ID, CreateSnippetModal } from './create-snippet.modal'
import { SnippetsGridWidget } from './snippets-grid.widget'

interface IProps {
    fromMainView?: boolean
}

export const SnippetsDrawerWidget = (props: IProps) => {
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

    const openSnippetsHelpModal = () => {
        modals.open({
            title: (
                <BaseOverlayHeader
                    iconColor="teal"
                    IconComponent={TbCode}
                    iconVariant="soft"
                    title={t('snippets.drawer.widget.snippets')}
                />
            ),
            centered: true,

            children: (
                <Stack gap="md">
                    <Stack gap="sm">
                        <Stack gap={0}>
                            <Text mb={6} size="sm">
                                {t('snippets.drawer.widget.snippets-help-line-1')}
                            </Text>
                            <Text mb={6} size="sm">
                                {t('snippets.drawer.widget.snippets-help-line-2')}
                            </Text>
                            <Text mb={6} size="sm">
                                {t('snippets.drawer.widget.snippets-help-line-3')}
                            </Text>
                        </Stack>

                        <Stack gap={0}>
                            <Text fw={600} mb={4} size="sm">
                                Outbounds
                            </Text>
                            <Text c="dimmed" mb={6} size="xs">
                                {t('snippets.drawer.widget.snippets-help-line-4')}
                            </Text>
                            <Code block color="dark.8">
                                {JSON.stringify(
                                    {
                                        outbounds: [
                                            {
                                                snippet: 'snippet-name'
                                            }
                                        ]
                                    },
                                    null,
                                    2
                                )}
                            </Code>
                        </Stack>

                        <Stack gap={0}>
                            <Text fw={600} mb={4} size="sm">
                                Routing → Rules
                            </Text>
                            <Text c="dimmed" mb={6} size="xs">
                                {t('snippets.drawer.widget.snippets-help-line-5')}
                            </Text>
                            <Code block color="dark.8">
                                {JSON.stringify(
                                    {
                                        routing: {
                                            rules: [
                                                {
                                                    snippet: 'snippet-name'
                                                }
                                            ]
                                        }
                                    },
                                    null,
                                    2
                                )}
                            </Code>
                        </Stack>
                    </Stack>
                </Stack>
            )
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
                        <ActionIcon
                            color="lime"
                            onClick={openSnippetsHelpModal}
                            size="input-sm"
                            variant="light"
                        >
                            <TbQuestionMark size={24} />
                        </ActionIcon>

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
