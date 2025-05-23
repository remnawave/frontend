import { PiCheck, PiLink, PiPencil, PiUserCircle } from 'react-icons/pi'
import { ActionIcon, CopyButton, Group, Tooltip } from '@mantine/core'

import { useUserModalStoreActions } from '@entities/dashboard/user-modal-store/user-modal-store'

import { IProps } from './interfaces'

export function UserActionsFeature(props: IProps) {
    const { userUuid, subscriptionUrl } = props

    const actions = useUserModalStoreActions()

    const handleOpenModal = async () => {
        await actions.setUserUuid(userUuid)
        actions.changeModalState(true)
    }

    const handleOpenDetailedUserInfoDrawer = async () => {
        await actions.setDrawerUserUuid(userUuid)
        actions.changeDetailedUserInfoDrawerState(true)
    }

    return (
        <Group gap={'xs'} justify={'center'} wrap={'nowrap'}>
            <ActionIcon.Group>
                <CopyButton timeout={2000} value={subscriptionUrl}>
                    {({ copied, copy }) => (
                        <Tooltip label={copied ? 'Copied!' : 'Copy subscription URL'}>
                            <ActionIcon
                                color={copied ? 'teal.5' : 'blue.5'}
                                onClick={copy}
                                radius="md"
                                size="input-sm"
                                variant={copied ? 'light' : 'outline'}
                            >
                                {copied ? (
                                    <PiCheck style={{ width: '1.5rem', height: '1.5rem' }} />
                                ) : (
                                    <PiLink style={{ width: '1.5rem', height: '1.5rem' }} />
                                )}
                            </ActionIcon>
                        </Tooltip>
                    )}
                </CopyButton>
                <ActionIcon
                    color="grape.5"
                    onClick={handleOpenDetailedUserInfoDrawer}
                    radius="md"
                    size="input-sm"
                    variant="outline"
                >
                    <PiUserCircle size={'1.5rem'} />
                </ActionIcon>
                <ActionIcon
                    color="cyan.5"
                    onClick={handleOpenModal}
                    radius="md"
                    size="input-sm"
                    variant="outline"
                >
                    <PiPencil size={'1.5rem'} />
                </ActionIcon>
            </ActionIcon.Group>
        </Group>
    )
}
