import { Box, Container, Stack } from '@mantine/core'
import { modals } from '@mantine/modals'
import { GetAllInboundsCommand, GetConfigProfilesCommand } from '@remnawave/backend-contract'
import { InboundCardWidget } from '@widgets/dashboard/inbounds/inbound-card/inbound-card.widget'
import {
    EMPTY_INBOUND_NODE_AGGREGATE,
    IInboundNodeAggregate
} from '@widgets/dashboard/inbounds/inbound-status-tile/get-inbound-node-status.util'
import { githubDarkTheme, JsonEditor } from 'json-edit-react'
import { memo, useMemo } from 'react'
import { TbTag } from 'react-icons/tb'

import { showModal } from '@shared/_modals/show-modal'
import { useIsMobile } from '@shared/hooks'
import { EmptyPageLayout } from '@shared/ui/layouts/empty-page'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'

type Inbound = GetAllInboundsCommand.Response['response']['inbounds'][number]

interface IProps {
    inbounds: Inbound[] | undefined
    configProfiles: GetConfigProfilesCommand.Response['response']['configProfiles'] | undefined
    nodeAggregateByInboundUuid: Map<string, IInboundNodeAggregate>
}

const openRawInboundModal = (inbound: Inbound) => {
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

export const InboundsCardsWidget = memo((props: IProps) => {
    const { inbounds, configProfiles, nodeAggregateByInboundUuid } = props
    const isMobile = useIsMobile()

    const profileNameByUuid = useMemo(
        () => new Map((configProfiles ?? []).map((profile) => [profile.uuid, profile.name])),
        [configProfiles]
    )

    const handleOpenUsage = (inbound: Inbound) => {
        showModal('configProfiles_inboundUsageDrawer', { inboundUuid: inbound.uuid })
    }

    if (!inbounds) return null

    if (inbounds.length === 0) {
        return <EmptyPageLayout />
    }

    return (
        <Container fluid>
            <Stack gap={0}>
                {inbounds.map((inbound) => (
                    <InboundCardWidget
                        inbound={inbound}
                        isMobile={isMobile}
                        key={inbound.uuid}
                        nodeAggregate={
                            nodeAggregateByInboundUuid.get(inbound.uuid) ??
                            EMPTY_INBOUND_NODE_AGGREGATE
                        }
                        onOpenRawInbound={openRawInboundModal}
                        onOpenUsage={handleOpenUsage}
                        profileName={profileNameByUuid.get(inbound.profileUuid)}
                    />
                ))}
            </Stack>
        </Container>
    )
})
