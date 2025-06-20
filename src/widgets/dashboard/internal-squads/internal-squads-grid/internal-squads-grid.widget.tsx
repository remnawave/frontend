import {
    ActionIcon,
    Badge,
    Button,
    Card,
    CopyButton,
    Grid,
    Group,
    Stack,
    Text,
    Title,
    Tooltip
} from '@mantine/core'
import {
    PiCheck,
    PiCopy,
    PiEmpty,
    PiPencilDuotone,
    PiTag,
    PiTrashDuotone,
    PiUsers
} from 'react-icons/pi'
import { modals } from '@mantine/modals'

import { InternalSquadsDrawerWithStore } from '@widgets/dashboard/users/internal-squads-drawer-with-store'
import { MODALS, useModalsStore } from '@entities/dashboard/modal-store'
import { QueryKeys, useDeleteInternalSquad } from '@shared/api/hooks'
import { queryClient } from '@shared/api/query-client'

import { IProps } from './interfaces'

export function InternalSquadsGridWidget(props: IProps) {
    const { internalSquads } = props

    const { open, setInternalData } = useModalsStore()
    // const [open, handlers] = useDisclosure(false)

    const { mutate: deleteInternalSquad } = useDeleteInternalSquad({
        mutationFns: {
            onSuccess: () => {
                queryClient.refetchQueries({
                    queryKey: QueryKeys.internalSquads.getInternalSquads.queryKey
                })
            }
        }
    })

    const handleDeleteInternalSquad = (internalSquadUuid: string, internalSquadName: string) => {
        modals.openConfirmModal({
            title: 'Delete Internal Squad',
            children: (
                <Text size="sm">
                    Are you sure you want to delete the internal squad "{internalSquadName}"? This
                    action cannot be undone.
                </Text>
            ),
            labels: { confirm: 'Delete', cancel: 'Cancel' },
            confirmProps: { color: 'red' },
            centered: true,
            onConfirm: () => {
                deleteInternalSquad({
                    route: {
                        uuid: internalSquadUuid
                    }
                })
            }
        })
    }

    if (!internalSquads || internalSquads.length === 0) {
        return (
            <Card p="xl" radius="md" withBorder>
                <Stack align="center" gap="md">
                    <PiEmpty size={48} style={{ opacity: 0.5 }} />
                    <div>
                        <Title c="dimmed" order={4} ta="center">
                            No Internal Squads
                        </Title>
                        <Text c="dimmed" mt="xs" size="sm" ta="center">
                            Create your first internal squad to get started
                        </Text>
                    </div>
                </Stack>
            </Card>
        )
    }

    return (
        <Grid>
            {internalSquads.map((internalSquad) => {
                const { membersCount } = internalSquad.info
                const { inboundsCount } = internalSquad.info

                return (
                    <Grid.Col key={internalSquad.uuid} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
                        <Card
                            h="100%"
                            padding="md"
                            radius="md"
                            shadow="sm"
                            style={{
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                            withBorder
                        >
                            <Stack gap="md" style={{ flex: 1 }}>
                                <Group gap="xs" justify="space-between" wrap="nowrap">
                                    <Group gap="xs" miw={0} style={{ flex: 1 }} wrap="nowrap">
                                        <PiUsers size={20} />
                                        <Text
                                            fw={600}
                                            lineClamp={2}
                                            size="md"
                                            title={internalSquad.name}
                                        >
                                            {internalSquad.name}
                                        </Text>
                                    </Group>

                                    <CopyButton timeout={2000} value={internalSquad.uuid}>
                                        {({ copied, copy }) => (
                                            <Tooltip label={copied ? 'Copied!' : 'Copy UUID'}>
                                                <ActionIcon
                                                    color={copied ? 'teal' : 'gray'}
                                                    onClick={copy}
                                                    size="md"
                                                    variant="subtle"
                                                >
                                                    {copied ? (
                                                        <PiCheck size={18} />
                                                    ) : (
                                                        <PiCopy size={18} />
                                                    )}
                                                </ActionIcon>
                                            </Tooltip>
                                        )}
                                    </CopyButton>

                                    <Tooltip label={'Delete'}>
                                        <ActionIcon
                                            color="red"
                                            onClick={() =>
                                                handleDeleteInternalSquad(
                                                    internalSquad.uuid,
                                                    internalSquad.name
                                                )
                                            }
                                            size="md"
                                            variant="subtle"
                                        >
                                            <PiTrashDuotone size={18} />
                                        </ActionIcon>
                                    </Tooltip>
                                </Group>

                                <Group gap="xs">
                                    <Tooltip label="Total inbounds in profile" position="bottom">
                                        <Badge
                                            color="blue"
                                            leftSection={<PiTag size={14} />}
                                            size="lg"
                                            variant="light"
                                        >
                                            {inboundsCount}
                                        </Badge>
                                    </Tooltip>

                                    <Tooltip label="Total members in squad" position="bottom">
                                        <Badge
                                            color="teal"
                                            leftSection={<PiUsers size={14} />}
                                            size="lg"
                                            variant="light"
                                        >
                                            {membersCount}
                                        </Badge>
                                    </Tooltip>
                                </Group>

                                <Stack gap="xs">
                                    <Button
                                        leftSection={<PiPencilDuotone size={16} />}
                                        onClick={() => {
                                            setInternalData({
                                                internalState: internalSquad,
                                                modalKey: MODALS.INTERNAL_SQUAD_SHOW_INBOUNDS
                                            })
                                            open(MODALS.INTERNAL_SQUAD_SHOW_INBOUNDS)

                                            // handlers.open()
                                        }}
                                        size="sm"
                                        variant="light"
                                    >
                                        Edit inbounds
                                    </Button>
                                </Stack>
                            </Stack>
                        </Card>
                        {/* <InternalSquadsDrawer
                            internalSquad={internalSquad}
                            onClose={handlers.close}
                            opened={open}
                        /> */}
                    </Grid.Col>
                )
            })}

            <InternalSquadsDrawerWithStore />
        </Grid>
    )
}
