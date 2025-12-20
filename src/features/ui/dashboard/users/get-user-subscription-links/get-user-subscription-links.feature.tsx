import {
    PiCheck,
    PiCopy,
    PiEmptyDuotone,
    PiLinkBreakDuotone,
    PiQrCodeDuotone
} from 'react-icons/pi'
import { ActionIcon, Center, CopyButton, Drawer, Menu, Stack, Text, TextInput } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useTranslation } from 'react-i18next'
import { modals } from '@mantine/modals'
import { useEffect } from 'react'
import { renderSVG } from 'uqr'

import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { useGetSubscriptionInfoByUuid } from '@shared/api/hooks'
import { LoaderModalShared } from '@shared/ui/loader-modal'

import { IProps } from './interfaces'

export function GetUserSubscriptionLinksFeature(props: IProps) {
    const { uuid } = props
    const { t } = useTranslation()

    const [opened, handlers] = useDisclosure(false)

    const {
        data: subscriptionInfo,
        isLoading,
        refetch
    } = useGetSubscriptionInfoByUuid({
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

    const renderLinks = () => {
        if (!subscriptionInfo?.links.length) {
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

        return subscriptionInfo?.links.map((link) => {
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
        })
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
                        title={t('get-user-subscription-links.feature.subscription-links')}
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
                {t('get-user-subscription-links.feature.subscription-links')}
            </Menu.Item>
        </>
    )
}
