import { useState } from 'react'

import { Button, Group, Select } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useHostsStoreActions, useHostsStoreSelectedInboundTag } from '@entitites/dashboard'
import { PiArrowsClockwise, PiBookmarks, PiPlus } from 'react-icons/pi'
import { IProps } from './interfaces'

export const HeaderActionButtonsFeature = (props: IProps) => {
    const { inbounds } = props

    const actions = useHostsStoreActions()
    const selectedInboundTag = useHostsStoreSelectedInboundTag()
    const [isLoading, setIsLoading] = useState(false)

    const handleCreate = () => {
        actions.toggleCreateModal(true)
    }

    const handleUpdate = () => {
        try {
            setIsLoading(true)
            actions.getHosts()
        } catch (error) {
            console.error(error)
        } finally {
            setTimeout(() => {
                setIsLoading(false)
            }, 500)
        }
    }

    return (
        <Group>
            <Select
                value={selectedInboundTag}
                onChange={(value) => actions.setSelectedInboundTag(value || 'ALL')}
                leftSectionPointerEvents="none"
                leftSection={<PiBookmarks size="1rem" />}
                defaultValue="ALL"
                size="xs"
                radius="lg"
                data={[
                    { value: 'ALL', label: 'ALL' },
                    ...inbounds.map((inbound) => ({
                        value: inbound.tag,
                        label: inbound.tag
                    }))
                ]}
            />
            <Button
                variant="default"
                size="xs"
                leftSection={<PiArrowsClockwise size="1rem" />}
                onClick={handleUpdate}
                loading={isLoading}
            >
                Update
            </Button>

            <Button
                variant="default"
                size="xs"
                leftSection={<PiPlus size="1rem" />}
                onClick={handleCreate}
            >
                Create new host
            </Button>
        </Group>
    )
}
