import {
    ActionIcon,
    Box,
    Center,
    Group,
    ScrollArea,
    Stack,
    Text,
    Tooltip,
    Transition
} from '@mantine/core'
import { modals } from '@mantine/modals'
import { GetApiTokensCommand } from '@remnawave/backend-contract'
import { useTranslation } from 'react-i18next'
import { PiEmpty } from 'react-icons/pi'
import { TbCookie, TbPlus, TbRefresh } from 'react-icons/tb'

import { useGetApiTokens } from '@shared/api/hooks'
import { useIsMobile } from '@shared/hooks'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { SettingsCardShared } from '@shared/ui/settings-card'

import classes from './api-token-card.module.css'
import { ApiTokenItem } from './api-token-item'
import { CreateApiTokenContentWidget } from './modals/create-api-token-modal.widget'

interface IProps {
    apiTokensData: GetApiTokensCommand.Response['response']
}

export const ApiTokensCardWidget = (props: IProps) => {
    const { apiTokensData } = props
    const { t } = useTranslation()
    const isMobile = useIsMobile()

    const { isRefetching, refetch } = useGetApiTokens()

    return (
        <SettingsCardShared.Container>
            <SettingsCardShared.Header
                description={t('api-tokens-card.widget.api-tokens-description')}
                icon={<TbCookie size={24} />}
                iconColor="cyan"
                iconVariant="soft"
                title={t('api-tokens-card.widget.api-tokens')}
            />

            <SettingsCardShared.Content>
                {apiTokensData.tokens.length === 0 && (
                    <Center h="300px">
                        <Stack align="center" gap="xs">
                            <PiEmpty size={48} />
                            <Text c="dimmed" size="sm" ta="center">
                                {t('api-tokens-card.widget.no-api-tokens-found')}
                            </Text>
                        </Stack>
                    </Center>
                )}

                <Transition mounted={apiTokensData.tokens.length > 0} transition="fade">
                    {(styles) => (
                        <Box style={{ ...styles }}>
                            {apiTokensData.tokens.length > 0 && (
                                <Box className={classes.tokenTable}>
                                    <Box className={classes.tokenHeaderRow}>
                                        <Text className={classes.tokenColLabel}>
                                            {t('common.field.name')}
                                        </Text>
                                        <Text className={classes.tokenColLabel}>
                                            {t('api-tokens-card.widget.col-scopes')}
                                        </Text>
                                        <Text className={classes.tokenColLabel} visibleFrom="sm">
                                            {t('api-tokens-card.widget.col-expires')}
                                        </Text>
                                        <span />
                                    </Box>
                                    <ScrollArea.Autosize mah={300} mih={300}>
                                        <Stack gap={0}>
                                            {apiTokensData.tokens.map((apiToken) => (
                                                <ApiTokenItem
                                                    apiToken={apiToken}
                                                    key={apiToken.uuid}
                                                />
                                            ))}
                                        </Stack>
                                    </ScrollArea.Autosize>
                                </Box>
                            )}
                        </Box>
                    )}
                </Transition>
            </SettingsCardShared.Content>

            <SettingsCardShared.Bottom>
                <Group justify="space-between">
                    <ActionIcon.Group>
                        <Tooltip label={t('common.action.refresh')}>
                            <ActionIcon
                                loading={isRefetching}
                                onClick={() => refetch()}
                                size="input-md"
                                variant="soft"
                            >
                                <TbRefresh size={24} />
                            </ActionIcon>
                        </Tooltip>
                    </ActionIcon.Group>

                    <Tooltip label={t('common.action.create')}>
                        <ActionIcon
                            onClick={() => {
                                modals.open({
                                    title: (
                                        <BaseOverlayHeader
                                            iconColor="teal"
                                            IconComponent={TbCookie}
                                            iconVariant="soft"
                                            title={t('api-tokens-card.widget.create-api-token')}
                                        />
                                    ),
                                    fullScreen: isMobile,
                                    centered: true,
                                    size: 'min(800px, 90vw)',
                                    children: <CreateApiTokenContentWidget isMobile={isMobile} />
                                })
                            }}
                            size="input-md"
                            color="teal"
                            variant="soft"
                        >
                            <TbPlus size={24} />
                        </ActionIcon>
                    </Tooltip>
                </Group>
            </SettingsCardShared.Bottom>
        </SettingsCardShared.Container>
    )
}
