import {
    Accordion,
    AccordionControlProps,
    ActionIcon,
    ActionIconGroup,
    Box,
    Center,
    Group
} from '@mantine/core'
import { GetConfigProfilesCommand } from '@remnawave/backend-contract'
import { githubDarkTheme, JsonEditor } from 'json-edit-react'
import { PiCheckBold, PiXBold } from 'react-icons/pi'
import { modals } from '@mantine/modals'

import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { XrayLogo } from '@shared/ui/logos'

interface IProps extends AccordionControlProps {
    hideSelectActions?: boolean
    onSelectAllInbounds: (profileUuid: string) => void

    onUnselectAllInbounds: (profileUuid: string) => void
    profile: GetConfigProfilesCommand.Response['response']['configProfiles'][number]
}

export const AccordionControlShared = (props: IProps) => {
    const { profile, onSelectAllInbounds, onUnselectAllInbounds, hideSelectActions, ...rest } =
        props

    const handleShowJson = () => {
        if (!profile) return

        modals.open({
            children: (
                <Box>
                    <JsonEditor
                        collapse={3}
                        data={profile.config as object}
                        indent={4}
                        maxWidth="100%"
                        rootName=""
                        theme={githubDarkTheme}
                        viewOnly
                    />
                </Box>
            ),
            title: (
                <BaseOverlayHeader
                    iconColor="teal"
                    IconComponent={XrayLogo}
                    iconVariant="soft"
                    title={profile.name}
                />
            ),
            size: 'xl'
        })
    }

    return (
        <Center>
            <Accordion.Control {...rest} />

            <Group gap="0" mr="xs" wrap="nowrap">
                <ActionIconGroup>
                    {!hideSelectActions && (
                        <>
                            <ActionIcon
                                color="gray"
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    e.nativeEvent.stopImmediatePropagation()
                                    onSelectAllInbounds(profile.uuid)
                                }}
                                size="lg"
                                variant="subtle"
                            >
                                <PiCheckBold size={16} />
                            </ActionIcon>
                            <ActionIcon
                                color="gray"
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    e.nativeEvent.stopImmediatePropagation()
                                    onUnselectAllInbounds(profile.uuid)
                                }}
                                size="lg"
                                variant="subtle"
                            >
                                <PiXBold size={16} />
                            </ActionIcon>
                        </>
                    )}
                    <ActionIcon
                        color="gray"
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            e.nativeEvent.stopImmediatePropagation()

                            handleShowJson()
                        }}
                        size="lg"
                        variant="subtle"
                    >
                        <XrayLogo size={16} />
                    </ActionIcon>
                </ActionIconGroup>
            </Group>
        </Center>
    )
}
