import {
    ActionIcon,
    Center,
    CopyButton,
    Group,
    Modal,
    Paper,
    Stack,
    Text,
    Tooltip
} from '@mantine/core'
import { PiCheck, PiCopy, PiCpu } from 'react-icons/pi'
import ReactCountryFlag from 'react-country-flag'
import { useTranslation } from 'react-i18next'

import { MODALS, useModalsStore } from '@entities/dashboard/modal-store'

export const ActiveNodesListModalWithStoreShared = () => {
    const { isOpen, internalState: nodes } = useModalsStore(
        (state) => state.modals[MODALS.CONFIG_PROFILES_SHOW_ACTIVE_NODE]
    )
    const { close } = useModalsStore()
    const { t } = useTranslation()

    return (
        <Modal
            centered
            onClose={() => close(MODALS.CONFIG_PROFILES_SHOW_ACTIVE_NODE)}
            opened={isOpen}
            size="lg"
            title={t('active-nodes-list-with-store.modal.shared.active-nodes')}
        >
            <Stack gap="md">
                {nodes && nodes.length > 0 ? (
                    <>
                        <Group align="center" justify="space-between">
                            <Text c="dimmed" fw={600} size="sm">
                                {t('active-nodes-list.modal.shared.profile-is-active-on', {
                                    nodeCount: nodes.length
                                })}
                            </Text>
                        </Group>

                        <Stack gap="xs">
                            {nodes.map((node) => (
                                <Paper bg="dark.6" key={node.uuid} p="sm" withBorder>
                                    <Group align="center" justify="space-between" wrap="nowrap">
                                        <Group
                                            align="center"
                                            gap="sm"
                                            style={{
                                                flex: 1,
                                                minWidth: 0
                                            }}
                                        >
                                            {node.countryCode && node.countryCode !== 'XX' && (
                                                <ReactCountryFlag
                                                    countryCode={node.countryCode}
                                                    style={{
                                                        fontSize: '1.1em',
                                                        borderRadius: '2px'
                                                    }}
                                                />
                                            )}

                                            <Text
                                                fw={500}
                                                size="sm"
                                                style={{
                                                    flex: 1
                                                }}
                                                truncate
                                            >
                                                {node.name}
                                            </Text>
                                        </Group>

                                        <CopyButton timeout={2000} value={node.uuid}>
                                            {({ copied, copy }) => (
                                                <Tooltip label={copied ? 'Copied!' : 'Copy UUID'}>
                                                    <ActionIcon
                                                        color={copied ? 'teal' : 'gray'}
                                                        onClick={copy}
                                                        size="sm"
                                                        variant="subtle"
                                                    >
                                                        {copied ? (
                                                            <PiCheck size={14} />
                                                        ) : (
                                                            <PiCopy size={14} />
                                                        )}
                                                    </ActionIcon>
                                                </Tooltip>
                                            )}
                                        </CopyButton>
                                    </Group>
                                </Paper>
                            ))}
                        </Stack>
                    </>
                ) : (
                    <Center py="xl">
                        <Stack align="center" gap="sm">
                            <PiCpu
                                size={48}
                                style={{
                                    color: 'var(--mantine-color-gray-5)'
                                }}
                            />
                            <Text c="dimmed" size="sm" ta="center">
                                {t(
                                    'active-nodes-list.modal.shared.this-profile-is-not-active-on-any-nodes'
                                )}
                            </Text>
                        </Stack>
                    </Center>
                )}
            </Stack>
        </Modal>
    )
}
