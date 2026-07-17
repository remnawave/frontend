import {
    ActionIcon,
    Affix,
    Badge,
    Button,
    CloseButton,
    Group,
    Paper,
    Stack,
    Tooltip,
    Transition
} from '@mantine/core'
import { modals } from '@mantine/modals'
import { GetNodesCommand } from '@remnawave/backend-contract'
import { useTranslation } from 'react-i18next'
import {
    TbArrowBarToDown,
    TbArrowBarToUp,
    TbArrowBigDown,
    TbArrowBigUp,
    TbCategoryPlus,
    TbChartArcs,
    TbDots
} from 'react-icons/tb'

import { showModal } from '@shared/_modals/show-modal'
import { queryClient } from '@shared/api'
import { QueryKeys, useBulkNodesProfileModification } from '@shared/api/hooks'
import { XrayLogo } from '@shared/ui/logos'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'

import { BulkUpdateNodesModalContent } from './bulk-update-nodes.modal.content'
import { MultiSelectNodesModalContent } from './multi-select-modal.content'

interface IProps {
    moveSelected: (mode: 'bottom' | 'down' | 'top' | 'up') => void
    selectedRecords: GetNodesCommand.Response['response'][number][]
    setSelectedRecords: (records: GetNodesCommand.Response['response'][number][]) => void
}

export const MultiSelectNodesFeature = (props: IProps) => {
    const { moveSelected, selectedRecords, setSelectedRecords } = props
    const { t } = useTranslation()

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
                                <Group justify="space-between">
                                    <Badge color="shaded-gray" size="lg" variant="soft">
                                        {t('common.selected', { count: selectedRecords.length })}
                                    </Badge>
                                    <Group gap={0} justify="flex-end">
                                        <Tooltip label={t('common.clear-selection')} withArrow>
                                            <CloseButton onClick={() => setSelectedRecords([])} />
                                        </Tooltip>
                                    </Group>
                                </Group>

                                <ActionIcon.Group style={{ width: '100%' }}>
                                    <Tooltip label="Move to top" withArrow>
                                        <ActionIcon
                                            color="gray"
                                            onClick={() => moveSelected('top')}
                                            size="lg"
                                            style={{ flex: 1 }}
                                            variant="soft"
                                        >
                                            <TbArrowBarToUp size={20} />
                                        </ActionIcon>
                                    </Tooltip>

                                    <Tooltip label="Move up" withArrow>
                                        <ActionIcon
                                            color="gray"
                                            onClick={() => moveSelected('up')}
                                            size="lg"
                                            style={{ flex: 1 }}
                                            variant="soft"
                                        >
                                            <TbArrowBigUp size={20} />
                                        </ActionIcon>
                                    </Tooltip>

                                    <Tooltip label="Move down" withArrow>
                                        <ActionIcon
                                            color="gray"
                                            onClick={() => moveSelected('down')}
                                            size="lg"
                                            style={{ flex: 1 }}
                                            variant="soft"
                                        >
                                            <TbArrowBigDown size={20} />
                                        </ActionIcon>
                                    </Tooltip>

                                    <Tooltip label="Move to bottom" withArrow>
                                        <ActionIcon
                                            color="gray"
                                            onClick={() => moveSelected('bottom')}
                                            size="lg"
                                            style={{ flex: 1 }}
                                            variant="soft"
                                        >
                                            <TbArrowBarToDown size={20} />
                                        </ActionIcon>
                                    </Tooltip>
                                </ActionIcon.Group>

                                <Button
                                    color="cyan"
                                    fullWidth
                                    leftSection={<TbChartArcs size={18} />}
                                    onClick={() => {
                                        showModal('nodes_nodesUsageStatsModal', {
                                            nodeUuids: selectedRecords.map((record) => record.uuid)
                                        })
                                    }}
                                    size="sm"
                                    variant="soft"
                                >
                                    {t('common.usage-stats')}
                                </Button>

                                <Button
                                    color="cyan"
                                    fullWidth
                                    leftSection={<TbCategoryPlus size={18} />}
                                    onClick={() =>
                                        modals.open({
                                            title: (
                                                <BaseOverlayHeader
                                                    iconColor="cyan"
                                                    IconComponent={TbCategoryPlus}
                                                    iconVariant="soft"
                                                    title={t('common.update')}
                                                    titleOrder={5}
                                                />
                                            ),
                                            centered: true,
                                            children: (
                                                <BulkUpdateNodesModalContent
                                                    selectedRecords={selectedRecords}
                                                    setSelectedRecords={setSelectedRecords}
                                                />
                                            )
                                        })
                                    }
                                    size="sm"
                                    variant="soft"
                                >
                                    {t('common.update')}
                                </Button>

                                <Button
                                    color="cyan"
                                    fullWidth
                                    leftSection={<XrayLogo size={18} />}
                                    onClick={() =>
                                        showModal('nodes_nodesConfigProfilesDrawer', {
                                            activeConfigProfileInbounds: [],
                                            activeConfigProfileUuid: undefined,
                                            onSaveInbounds: (
                                                inbounds: string[],
                                                configProfileUuid: string
                                            ) => {
                                                handleProfileModification(
                                                    configProfileUuid,
                                                    inbounds
                                                )
                                            }
                                        })
                                    }
                                    size="sm"
                                    variant="soft"
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
                                                    iconColor="cyan"
                                                    IconComponent={TbDots}
                                                    iconVariant="soft"
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
                                    size="sm"
                                    variant="soft"
                                >
                                    {t('base-node-form.more-actions')}
                                </Button>
                            </Stack>
                        </Paper>
                    </Paper>
                )}
            </Transition>
        </Affix>
    )
}
