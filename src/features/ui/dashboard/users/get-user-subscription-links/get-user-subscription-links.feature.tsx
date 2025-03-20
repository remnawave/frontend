import { ActionIcon, Button, CopyButton, Drawer, Stack, TextInput, Tooltip } from '@mantine/core'
import { PiCheck, PiCopy, PiLinkBreakDuotone } from 'react-icons/pi'
import { useDisclosure } from '@mantine/hooks'
import { useTranslation } from 'react-i18next'

import { useGetSubscriptionInfoByShortUuid } from '@shared/api/hooks'
import { LoaderModalShared } from '@shared/ui/loader-modal'

import { IProps } from './interfaces'

export function GetUserSubscriptionLinksFeature(props: IProps) {
    const { shortUuid } = props
    const { t } = useTranslation()
    const [opened, handlers] = useDisclosure(false)

    const { data: subscriptionInfo, isLoading } = useGetSubscriptionInfoByShortUuid({
        route: {
            shortUuid
        }
    })

    const renderLinks = () => {
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
                                    {copied ? <PiCheck size="1rem" /> : <PiCopy size="1rem" />}
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
            <Tooltip label={t('get-user-subscription-links.feature.subscription-links')}>
                <Button
                    color="green"
                    leftSection={<PiLinkBreakDuotone size="1.5rem" />}
                    onClick={handlers.open}
                    size="md"
                    type="button"
                >
                    {t('get-user-subscription-links.feature.show-links')}
                </Button>
            </Tooltip>
        </>
    )
}
