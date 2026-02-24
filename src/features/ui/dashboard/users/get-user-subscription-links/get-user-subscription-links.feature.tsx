import {
    PiCheck,
    PiCopy,
    PiEmptyDuotone,
    PiEyeSlashDuotone,
    PiLinkBreakDuotone,
    PiProhibitDuotone,
    PiQrCodeDuotone,
    PiWifiHighDuotone
} from 'react-icons/pi'
import {
    ActionIcon,
    Badge,
    Center,
    CopyButton,
    Drawer,
    Group,
    Menu,
    Stack,
    Text,
    TextInput,
    ThemeIcon
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useTranslation } from 'react-i18next'
import { modals } from '@mantine/modals'
import { useEffect } from 'react'
import { renderSVG } from 'uqr'

import { SectionCardSection } from '@shared/ui/section-card/section-card.section'
import { SectionCardRoot } from '@shared/ui/section-card/section-card.root'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { useGetConnectionKeysByUuid } from '@shared/api/hooks'
import { LoaderModalShared } from '@shared/ui/loader-modal'

import { IProps } from './interfaces'

export function GetUserSubscriptionLinksFeature(props: IProps) {
    const { uuid } = props
    const { t } = useTranslation()

    const [opened, handlers] = useDisclosure(false)

    const {
        data: connectionKeys,
        isLoading,
        refetch
    } = useGetConnectionKeysByUuid({
        route: {
            uuid
        }
    })

    useEffect(() => {
        refetch()
    }, [opened])

    const renderQrCode = (link: string, remark: string) => {
        modals.open({
            centered: true,
            title: (
                <BaseOverlayHeader
                    IconComponent={PiQrCodeDuotone}
                    iconVariant="gradient-teal"
                    title={remark}
                />
            ),
            children: (
                <div
                    dangerouslySetInnerHTML={{
                        __html: renderSVG(link, {
                            whiteColor: '#161B22',
                            blackColor: '#3CC9DB'
                        })
                    }}
                />
            )
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
            return (
                <Center py="xl">
                    <Stack align="center" gap="xs">
                        <PiEmptyDuotone color="var(--mantine-color-gray-5)" size="3rem" />
                        <Text c="dimmed" size="sm">
                            {t(
                                'get-user-subscription-links.feature.no-available-hosts-found-for-this-user'
                            )}
                        </Text>
                    </Stack>
                </Center>
            )
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

    return (
        <>
            <Drawer
                keepMounted={false}
                onClose={handlers.close}
                opened={opened}
                overlayProps={{ backgroundOpacity: 0.6, blur: 0 }}
                padding="lg"
                position="right"
                size="md"
                title={
                    <BaseOverlayHeader
                        IconComponent={PiLinkBreakDuotone}
                        iconVariant="gradient-teal"
                        title={t('get-user-subscription-links.feature.connection-keys')}
                    />
                }
            >
                {isLoading ? (
                    <LoaderModalShared
                        text={t('get-user-subscription-links.feature.loading-subscription-links')}
                    />
                ) : (
                    <Stack>{renderLinks()}</Stack>
                )}
            </Drawer>

            <Menu.Item
                leftSection={<PiLinkBreakDuotone color="var(--mantine-color-teal-5)" size="16px" />}
                onClick={handlers.open}
            >
                {t('get-user-subscription-links.feature.connection-keys')}
            </Menu.Item>
        </>
    )
}
