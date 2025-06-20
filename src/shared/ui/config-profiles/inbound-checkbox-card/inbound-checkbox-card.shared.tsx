import { ActionIcon, Badge, Checkbox, Group, Text } from '@mantine/core'
import { GetConfigProfilesCommand } from '@remnawave/backend-contract'
import { githubDarkTheme, JsonEditor } from 'json-edit-react'
import { modals } from '@mantine/modals'
import { TbCode } from 'react-icons/tb'
import { useCallback } from 'react'

import type { IProps } from './interfaces/props.interface'

import classes from './InboundCheckboxCard.module.css'

export const InboundCheckboxCardShared = (props: IProps) => {
    const { inbound, isSelected, onInboundToggle } = props

    const handleShowInboundJson = useCallback(
        (
            inbound: GetConfigProfilesCommand.Response['response']['configProfiles'][number]['inbounds'][number]
        ) => {
            modals.open({
                children: (
                    <JsonEditor
                        collapse={3}
                        data={inbound.rawInbound!}
                        indent={4}
                        maxWidth="100%"
                        rootName=""
                        theme={githubDarkTheme}
                        viewOnly
                    />
                ),
                title: `Inbound Config: ${inbound.tag}`,
                size: 'xl'
            })
        },
        []
    )

    return (
        <Checkbox.Card
            checked={isSelected}
            className={classes.compactRoot}
            key={inbound.uuid}
            onClick={() => onInboundToggle(inbound)}
            radius="md"
            value={inbound.uuid}
        >
            <Group align="center" gap="xs" justify="space-between" wrap="nowrap">
                <Group align="center" gap="xs" style={{ flex: 1, minWidth: 0 }} wrap="nowrap">
                    <Checkbox.Indicator size="sm" />
                    <Text className={classes.compactLabel} size="sm" truncate>
                        {inbound.tag}
                    </Text>
                </Group>

                <Group gap="xs" wrap="nowrap">
                    <Badge color="gray" size="xs" variant="outline">
                        {inbound.type}
                    </Badge>
                    {inbound.port && (
                        <Badge color="teal" size="xs" variant="outline">
                            {inbound.port}
                        </Badge>
                    )}

                    <ActionIcon
                        component="a"
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            e.nativeEvent.stopImmediatePropagation()

                            handleShowInboundJson(inbound)
                        }}
                        radius={'md'}
                    >
                        <TbCode size={16} />
                    </ActionIcon>
                </Group>
            </Group>
        </Checkbox.Card>
    )
}
