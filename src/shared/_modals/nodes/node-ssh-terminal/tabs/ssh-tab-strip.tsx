import { ActionIcon, Box, Group, Scroller, Text } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { TbPlus, TbX } from 'react-icons/tb'

import { CountryFlag } from '@shared/ui/get-country-flag'

import classes from '../NodeSshTerminal.module.css'
import { useSshActiveTabId, useSshStatuses, useSshTabs, useSshTabsActions } from './ssh-tabs.store'

interface IProps {
    onAdd: () => void
    onClose: (id: string) => void
}

export const SshTabStrip = (props: IProps) => {
    const { onAdd, onClose } = props
    const { t } = useTranslation()

    const tabs = useSshTabs()
    const activeId = useSshActiveTabId()
    const statuses = useSshStatuses()
    const { selectTab } = useSshTabsActions()

    return (
        <Scroller className={classes.tabStrip} draggable>
            <Group gap="xs" p={6} role="tablist" wrap="nowrap">
                <ActionIcon color="gray" onClick={onAdd} size="md" variant="subtle">
                    <TbPlus size={16} />
                </ActionIcon>

                {tabs.map((tab) => {
                    const isActive = tab.id === activeId

                    return (
                        <Box
                            aria-selected={isActive}
                            className={classes.tab}
                            data-active={isActive || undefined}
                            key={tab.id}
                            onClick={() => selectTab(tab.id)}
                            onKeyDown={(event) => {
                                if (event.key !== 'Enter' && event.key !== ' ') return

                                event.preventDefault()
                                selectTab(tab.id)
                            }}
                            role="tab"
                            tabIndex={0}
                        >
                            <Box
                                className={classes.tabDot}
                                data-connected={statuses[tab.id]?.isConnected || undefined}
                            />

                            <CountryFlag countryCode={tab.node.countryCode} />

                            <Text className={classes.tabName} size="sm" truncate>
                                {tab.node.name}
                            </Text>

                            <ActionIcon
                                aria-label={t('common.action.close')}
                                className={classes.tabClose}
                                color="gray"
                                onClick={(event) => {
                                    event.stopPropagation()
                                    onClose(tab.id)
                                }}
                                size={18}
                                variant="subtle"
                            >
                                <TbX size={12} />
                            </ActionIcon>
                        </Box>
                    )
                })}
            </Group>
        </Scroller>
    )
}
