import { ActionIcon, ActionIconGroup, Group, Tooltip } from '@mantine/core'
import { TbCards, TbTable } from 'react-icons/tb'

import { INBOUNDS_VIEW_MODE } from '@entities/dashboard/view-preferences-store'

interface IProps {
    setViewMode: (viewMode: INBOUNDS_VIEW_MODE) => void
    viewMode: INBOUNDS_VIEW_MODE
}

export const InboundsHeaderActionButtonsFeature = (props: IProps) => {
    const { setViewMode, viewMode } = props

    return (
        <Group grow preventGrowOverflow={false} wrap="wrap">
            <ActionIconGroup>
                <Tooltip label="Toggle view mode">
                    <ActionIcon
                        color="gray"
                        onClick={() =>
                            setViewMode(
                                viewMode === INBOUNDS_VIEW_MODE.TABLE
                                    ? INBOUNDS_VIEW_MODE.CARDS
                                    : INBOUNDS_VIEW_MODE.TABLE
                            )
                        }
                        size="input-md"
                        variant="soft"
                    >
                        {viewMode === INBOUNDS_VIEW_MODE.CARDS ? (
                            <TbTable size="24px" />
                        ) : (
                            <TbCards size="24px" />
                        )}
                    </ActionIcon>
                </Tooltip>
            </ActionIconGroup>
        </Group>
    )
}
