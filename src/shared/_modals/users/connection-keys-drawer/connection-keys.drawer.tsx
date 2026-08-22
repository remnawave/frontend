import NiceModal, { useModal } from '@ebay/nice-modal-react'
import {
    ActionIcon,
    Badge,
    CopyButton,
    Drawer,
    Group,
    Stack,
    TextInput,
    ThemeIcon,
    Text,
    Box,
    Button
} from '@mantine/core'
import { modals } from '@mantine/modals'
import { githubDarkTheme } from 'json-edit-react'
import { JsonEditor } from 'json-edit-react'
import { useTranslation } from 'react-i18next'
import {
    PiEyeSlashDuotone,
    PiWifiHighDuotone,
    PiLinkBreakDuotone,
    PiProhibitDuotone,
    PiCheck,
    PiCopy,
    PiEmptyDuotone,
    PiQrCodeDuotone
} from 'react-icons/pi'
import { TbJson } from 'react-icons/tb'

import { useNiceMantineModal } from '@shared/_modals/use-nice-modal'
import { useGetConnectionKeysByUserId, useGetRawSubscription } from '@shared/api/hooks'
import { EmptyPageLayout } from '@shared/ui/layouts/empty-page'
import { LoaderModalShared } from '@shared/ui/loader-modal'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { QrCodeBuilder } from '@shared/ui/qr-code-builder'
import { SectionCardRoot } from '@shared/ui/section-card/section-card.root'
import { SectionCardSection } from '@shared/ui/section-card/section-card.section'

interface IProps {
    userId: number
    shortUuid: string
}

export const ConnectionKeysDrawer = NiceModal.create((props: IProps) => {
    const { userId, shortUuid } = props
    const { t } = useTranslation()

    const modal = useModal()
    const { modalProps } = useNiceMantineModal({
        modal,
        drawer: true
    })

    const { data: connectionKeys, isLoading } = useGetConnectionKeysByUserId({
        route: {
            userId: userId
        }
    })

    const { data: rawSubscription, isLoading: isRawSubscriptionLoading } = useGetRawSubscription({
        route: { shortUuid }
    })

    const renderQrCode = (link: string, remark: string) => {
        modals.open({
            centered: true,
            size: 'auto',
            title: (
                <BaseOverlayHeader
                    iconColor="teal"
                    IconComponent={PiQrCodeDuotone}
                    iconVariant="soft"
                    title={remark}
                />
            ),
            children: <QrCodeBuilder data={link} title={remark} />
        })
    }

    const renderLinkItem = (link: string) => {
        const encodedName = link.split('#').at(-1) || 'Host'
        const name = decodeURIComponent(encodedName)

        return (
            <TextInput
                key={link}
                label={name}
                leftSection={
                    <CopyButton timeout={2000} value={link}>
                        {({ copied, copy }) => (
                            <ActionIcon
                                color={copied ? 'teal' : 'gray'}
                                onClick={copy}
                                variant="subtle"
                            >
                                {copied ? <PiCheck size="16px" /> : <PiCopy size="16px" />}
                            </ActionIcon>
                        )}
                    </CopyButton>
                }
                readOnly
                rightSection={
                    <ActionIcon onClick={() => renderQrCode(link, name)} variant="subtle">
                        <PiQrCodeDuotone size="16px" />
                    </ActionIcon>
                }
                value={link}
            />
        )
    }

    const renderSection = (keys: string[], label: string, icon: React.ReactNode, color: string) => {
        if (!keys.length) return null

        return (
            <SectionCardRoot gap="sm">
                <SectionCardSection>
                    <Group gap="xs">
                        <ThemeIcon color={color} size="sm" variant="light">
                            {icon}
                        </ThemeIcon>
                        <Text c={color} fw={500} size="sm">
                            {label}
                        </Text>
                        <Badge color={color} size="sm" variant="light">
                            {keys.length}
                        </Badge>
                    </Group>
                </SectionCardSection>
                {keys.map(renderLinkItem)}
            </SectionCardRoot>
        )
    }

    const renderLinks = () => {
        const hasNoKeys =
            !connectionKeys?.enabledKeys.length &&
            !connectionKeys?.disabledKeys.length &&
            !connectionKeys?.hiddenKeys.length

        if (hasNoKeys) {
            return <EmptyPageLayout icon={<PiEmptyDuotone size="3rem" />} />
        }

        return (
            <Stack gap="md">
                {renderSection(
                    connectionKeys?.enabledKeys ?? [],
                    'Active',
                    <PiWifiHighDuotone />,
                    'teal'
                )}

                {renderSection(
                    connectionKeys?.hiddenKeys ?? [],
                    'Hidden',
                    <PiEyeSlashDuotone />,
                    'gray'
                )}
                {renderSection(
                    connectionKeys?.disabledKeys ?? [],
                    'Disabled',
                    <PiProhibitDuotone />,
                    'orange'
                )}
            </Stack>
        )
    }

    const renderRawSubscription = () => {
        modals.open({
            centered: true,
            size: 'xl',
            title: (
                <BaseOverlayHeader
                    iconColor="teal"
                    IconComponent={TbJson}
                    iconVariant="soft"
                    title="Raw Subscription"
                />
            ),
            children: (
                <Box>
                    <JsonEditor
                        collapse={({ path }) => {
                            if (path.length === 0) return false
                            if (path[0] !== 'resolvedProxyConfigs') return true
                            return path.length > 2
                        }}
                        data={JSON.parse(JSON.stringify(rawSubscription))}
                        indent={4}
                        keySort={([a], [b]) => {
                            if (a === 'resolvedProxyConfigs') return -1
                            if (b === 'resolvedProxyConfigs') return 1
                            return 0
                        }}
                        maxWidth="100%"
                        rootName=""
                        theme={githubDarkTheme}
                        viewOnly
                        jsonStringify={(data) => JSON.stringify(data)}
                    />
                </Box>
            )
        })
    }

    return (
        <Drawer
            {...modalProps}
            padding="lg"
            position="right"
            size="md"
            title={
                <BaseOverlayHeader
                    iconColor="teal"
                    IconComponent={PiLinkBreakDuotone}
                    iconVariant="soft"
                    title={t('get-user-subscription-links.feature.connection-keys')}
                />
            }
        >
            <Stack>
                <Button
                    fullWidth
                    onClick={renderRawSubscription}
                    leftSection={<TbJson size="16px" />}
                    variant="soft"
                    loading={isRawSubscriptionLoading}
                >
                    Raw Subscription
                </Button>
                {isLoading ? <LoaderModalShared mih="240px" /> : <Stack>{renderLinks()}</Stack>}
            </Stack>
        </Drawer>
    )
})
