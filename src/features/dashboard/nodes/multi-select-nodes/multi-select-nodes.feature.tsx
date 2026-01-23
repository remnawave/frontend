import { Affix, Badge, Button, Group, Paper, Stack, Transition } from '@mantine/core'
import { GetAllNodesCommand } from '@remnawave/backend-contract'
import { useDisclosure } from '@mantine/hooks'
import { useTranslation } from 'react-i18next'
import { modals } from '@mantine/modals'
import { TbDots } from 'react-icons/tb'

import { ConfigProfilesDrawer } from '@widgets/dashboard/nodes/config-profiles-drawer'
import { QueryKeys, useBulkNodesProfileModification } from '@shared/api/hooks'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { XrayLogo } from '@shared/ui/logos'
import { queryClient } from '@shared/api'

import { MultiSelectNodesModalContent } from './multi-select-modal.content'

interface IProps {
    selectedRecords: GetAllNodesCommand.Response['response'][number][]
    setSelectedRecords: (records: GetAllNodesCommand.Response['response'][number][]) => void
}

export const MultiSelectNodesFeature = (props: IProps) => {
    const { selectedRecords, setSelectedRecords } = props
    const { t } = useTranslation()

    const [opened, handlers] = useDisclosure(false)

    const hasSelection = selectedRecords.length > 0

    const { mutate: bulkNodesProfileModification } = useBulkNodesProfileModification({
        mutationFns: {
            onSuccess: () => {
                setSelectedRecords([])

                queryClient.refetchQueries({ queryKey: QueryKeys.nodes.getAllNodes.queryKey })
            }
        }
    })

    const handleProfileModification = (
        configProfileUuid: string,
        configProfileInboundUuids: string[]
    ) => {
        bulkNodesProfileModification({
            variables: {
                uuids: selectedRecords.map((record) => record.uuid),
                configProfile: {
                    activeConfigProfileUuid: configProfileUuid,
                    activeInbounds: configProfileInboundUuids
                }
            }
        })
    }

    return (
        <Affix position={{ bottom: 80, right: 20 }} zIndex={100}>
            <Transition mounted={hasSelection} transition="slide-up">
                {(styles) => (
                    <Paper
                        p={4}
                        shadow="md"
                        style={{
                            ...styles,
                            width: '300px',
                            maxWidth: '1200px',
                            margin: '0 auto'
                        }}
                        withBorder
                    >
                        <Paper
                            p="md"
                            style={{
                                borderRadius: 'calc(var(--mantine-radius-default) - 4px)',
                                border: '1px solid var(--mantine-color-dark-5)'
                            }}
                        >
                            <Stack gap="sm">
                                <Group justify="center">
                                    <Badge color="gray" size="lg" variant="filled">
                                        {t('internal-squads.drawer.widget.selected')}:{' '}
                                        {selectedRecords.length}
                                    </Badge>
                                    <Group
                                        grow
                                        justify="apart"
                                        preventGrowOverflow={false}
                                        wrap="wrap"
                                    >
                                        <Button
                                            onClick={() => setSelectedRecords([])}
                                            variant="subtle"
                                        >
                                            {t('multi-select-hosts.feature.clear-selection')}
                                        </Button>
                                    </Group>
                                </Group>

                                <Button
                                    color="cyan"
                                    fullWidth
                                    leftSection={<XrayLogo size={18} />}
                                    onClick={handlers.open}
                                    size="md"
                                    variant="light"
                                >
                                    {t('multi-select-nodes.feature.profile-and-inbounds')}
                                </Button>

                                <Button
                                    color="cyan"
                                    fullWidth
                                    leftSection={<TbDots size={18} />}
                                    onClick={() =>
                                        modals.open({
                                            title: (
                                                <BaseOverlayHeader
                                                    IconComponent={TbDots}
                                                    iconVariant="gradient-cyan"
                                                    title={t('base-node-form.more-actions')}
                                                    titleOrder={5}
                                                />
                                            ),
                                            centered: true,
                                            children: (
                                                <MultiSelectNodesModalContent
                                                    selectedRecords={selectedRecords}
                                                    setSelectedRecords={setSelectedRecords}
                                                />
                                            )
                                        })
                                    }
                                    size="md"
                                    variant="light"
                                >
                                    {t('base-node-form.more-actions')}
                                </Button>
                            </Stack>
                        </Paper>
                    </Paper>
                )}
            </Transition>

            <ConfigProfilesDrawer
                activeConfigProfileInbounds={[]}
                activeConfigProfileUuid={undefined}
                onClose={handlers.close}
                onSaveInbounds={(inbounds, configProfileUuid) => {
                    handleProfileModification(configProfileUuid, inbounds)
                }}
                opened={opened}
            />
        </Affix>
    )
}
