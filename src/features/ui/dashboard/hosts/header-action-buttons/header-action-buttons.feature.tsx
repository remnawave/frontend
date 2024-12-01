import { PiArrowsClockwise, PiBookmarks, PiPlus } from 'react-icons/pi'
import { Button, Group, Select } from '@mantine/core'
import consola from 'consola/browser'
import { useState } from 'react'

import { useHostsStoreActions, useHostsStoreSelectedInboundTag } from '@entitites/dashboard'

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
            consola.error(error)
        } finally {
            setTimeout(() => {
                setIsLoading(false)
            }, 500)
        }
    }

    return (
        <Group>
            <Select
                data={[
                    { value: 'ALL', label: 'ALL' },
                    ...inbounds.map((inbound) => ({
                        value: inbound.tag,
                        label: inbound.tag
                    }))
                ]}
                defaultValue="ALL"
                leftSection={<PiBookmarks size="1rem" />}
                leftSectionPointerEvents="none"
                onChange={(value) => actions.setSelectedInboundTag(value || 'ALL')}
                radius="lg"
                size="xs"
                value={selectedInboundTag}
            />
            <Button
                leftSection={<PiArrowsClockwise size="1rem" />}
                loading={isLoading}
                onClick={handleUpdate}
                size="xs"
                variant="default"
            >
                Update
            </Button>

            <Button
                leftSection={<PiPlus size="1rem" />}
                onClick={handleCreate}
                size="xs"
                variant="default"
            >
                Create new host
            </Button>
        </Group>
    )
}
