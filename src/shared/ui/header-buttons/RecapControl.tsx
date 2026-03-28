import { TbSparkles } from 'react-icons/tb'
import { modals } from '@mantine/modals'
import { rem } from '@mantine/core'

import { RecapContent } from '@widgets/dashboard/recap/recap.content.widget'

import { BaseOverlayHeader } from '../overlays/base-overlay-header'
import { HeaderControl } from './HeaderControl'

export function RecapControl() {
    const handleClick = () => {
        modals.open({
            title: (
                <BaseOverlayHeader
                    iconColor="indigo"
                    IconComponent={TbSparkles}
                    iconVariant="soft"
                    title="Recap"
                />
            ),
            centered: true,
            size: '980px',
            withCloseButton: true,
            children: <RecapContent />
        })
    }

    return (
        <HeaderControl onClick={handleClick}>
            <TbSparkles style={{ width: rem(22), height: rem(22) }} />
        </HeaderControl>
    )
}
