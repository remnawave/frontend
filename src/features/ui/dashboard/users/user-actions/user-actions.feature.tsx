import { Button, CopyButton, Group, Tooltip } from '@mantine/core'
import { PiCheck, PiCopy, PiEyeDuotone } from 'react-icons/pi'

import { useUserModalStoreActions } from '@entities/dashboard/user-modal-store/user-modal-store'

import { IProps } from './interfaces'

export function UserActionsFeature(props: IProps) {
    const { userUuid, subscriptionUrl } = props

    const actions = useUserModalStoreActions()

    const handleOpenModal = async () => {
        await actions.setUserUuid(userUuid)
        actions.changeModalState(true)
    }

    return (
        <Group gap={'xs'} justify={'center'} wrap={'nowrap'}>
            <CopyButton timeout={2000} value={subscriptionUrl}>
                {({ copied, copy }) => (
                    <Tooltip label={copied ? 'Copied!' : 'Copy subscription URL'}>
                        <Button
                            color={copied ? 'teal' : 'cyan'}
                            onClick={copy}
                            radius="md"
                            size="xs"
                            variant={copied ? 'light' : 'outline'}
                        >
                            {copied ? (
                                <PiCheck style={{ width: '1.2rem', height: '1.2rem' }} />
                            ) : (
                                <PiCopy style={{ width: '1.2rem', height: '1.2rem' }} />
                            )}
                        </Button>
                    </Tooltip>
                )}
            </CopyButton>
            <Button onClick={handleOpenModal} radius="md" size="xs" type="button">
                <PiEyeDuotone size={'1.5rem'} />
            </Button>
        </Group>
    )
}
