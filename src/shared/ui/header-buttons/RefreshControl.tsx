import { PiArrowsClockwise } from 'react-icons/pi'
import { useNavigate } from 'react-router-dom'
import { rem } from '@mantine/core'

import { resetAllStores } from '@shared/hocs/store-wrapper'
import { clearQueryClient } from '@shared/api'

import { HeaderControl } from './HeaderControl'

export function RefreshControl() {
    const navigate = useNavigate()

    const handleRefresh = () => {
        resetAllStores()
        clearQueryClient()
        navigate(0)
    }

    return (
        <HeaderControl onClick={handleRefresh}>
            <PiArrowsClockwise style={{ width: rem(22), height: rem(22) }} />
        </HeaderControl>
    )
}
