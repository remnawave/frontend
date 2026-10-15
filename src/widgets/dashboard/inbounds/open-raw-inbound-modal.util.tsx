import { Box } from '@mantine/core'
import { modals } from '@mantine/modals'
import { GetAllInboundsCommand } from '@remnawave/backend-contract'
import { githubDarkTheme, JsonEditor } from 'json-edit-react'
import { TbTag } from 'react-icons/tb'

import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'

type Inbound = GetAllInboundsCommand.Response['response']['inbounds'][number]

export const openRawInboundModal = (inbound: Pick<Inbound, 'rawInbound' | 'tag'>) => {
    modals.open({
        children: (
            <Box>
                <JsonEditor
                    collapse={3}
                    data={inbound.rawInbound as object}
                    indent={4}
                    maxWidth="100%"
                    rootName=""
                    theme={githubDarkTheme}
                    viewOnly
                />
            </Box>
        ),
        size: 'xl',
        title: (
            <BaseOverlayHeader
                iconColor="teal"
                IconComponent={TbTag}
                iconVariant="soft"
                title={inbound.tag}
                titleOrder={5}
            />
        )
    })
}
