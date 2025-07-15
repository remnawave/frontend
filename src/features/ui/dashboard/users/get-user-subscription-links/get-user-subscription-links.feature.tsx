import { ActionIcon, Center, CopyButton, Drawer, Menu, Stack, Text, TextInput } from '@mantine/core'
import { PiCheck, PiCopy, PiEmptyDuotone, PiLinkBreakDuotone } from 'react-icons/pi'
import { useDisclosure } from '@mantine/hooks'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'

import { useGetSubscriptionInfoByShortUuid } from '@shared/api/hooks'
import { LoaderModalShared } from '@shared/ui/loader-modal'

import { IProps } from './interfaces'

export function GetUserSubscriptionLinksFeature(props: IProps) {
    const { shortUuid } = props
    const { t } = useTranslation()

    const [opened, handlers] = useDisclosure(false)

    const {
        data: subscriptionInfo,
        isLoading,
        refetch
    } = useGetSubscriptionInfoByShortUuid({
        route: {
            shortUuid
        }
    })

    useEffect(() => {
        refetch()
    }, [opened])

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
                title={t('get-user-subscription-links.feature.subscription-links')}
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
