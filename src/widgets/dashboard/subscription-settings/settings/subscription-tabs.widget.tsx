import {
    Alert,
    Box,
    Button,
    Card,
    Checkbox,
    Container,
    Grid,
    Group,
    NumberInput,
    px,
    Stack,
    Tabs,
    Text,
    Textarea,
    TextInput,
    ThemeIcon,
    Title,
    Transition
} from '@mantine/core'
import {
    PiChatsCircle,
    PiClock,
    PiClockCountdown,
    PiClockUser,
    PiDeviceMobile,
    PiFloppyDisk,
    PiGear,
    PiInfo,
    PiLink,
    PiProhibit,
    PiUserCircle
} from 'react-icons/pi'
import { UpdateSubscriptionSettingsCommand } from '@remnawave/backend-contract'
import { TbPrescription } from 'react-icons/tb'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useForm } from '@mantine/form'
import { useState } from 'react'

import { TemplateInfoPopoverShared } from '@shared/ui/popovers/template-info-popover/template-info-popover.shared'
import { ROUTES } from '@shared/constants'

import { HeaderItem, HeadersManager } from './headers-manager.widget'
import { RemarksManager } from './remarks-manager.widget'
import styles from './SubscriotionTabs.module.css'

interface SubscriptionTabsProps {
    form: ReturnType<typeof useForm<UpdateSubscriptionSettingsCommand.Request>>
    handleSubmit: () => void
    headers: HeaderItem[]
    isUpdateSubscriptionSettingsPending: boolean
    remarks: Record<string, string[]>
    updateDisabledRemarks: (newRemarks: string[]) => void
    updateExpiredRemarks: (newRemarks: string[]) => void
    updateHeaders: (newHeaders: HeaderItem[]) => void
    updateLimitedRemarks: (newRemarks: string[]) => void
}

export const SubscriptionTabs = ({
    form,
    remarks,
    updateExpiredRemarks,
    updateLimitedRemarks,
    updateDisabledRemarks,
    handleSubmit,
    isUpdateSubscriptionSettingsPending,
    headers,
    updateHeaders
}: SubscriptionTabsProps) => {
    const { t } = useTranslation()
    const navigate = useNavigate()

    const [activeTab, setActiveTab] = useState<string>('general')

    return (
        <form key="subscription-settings-form" onSubmit={handleSubmit}>
            <Container p={0} pb="lg" size="xl">
                <Stack gap="xl">
                    <Tabs
                        classNames={{
                            tab: styles.tab,
                            tabLabel: styles.tabLabel
                        }}
                        color="cyan"
                        defaultValue="general"
                        onChange={(value) => {
                            if (value) {
                                setActiveTab(value)
                            }
                        }}
                        style={{
                            width: '100%'
                        }}
                        value={activeTab}
                        variant="unstyled"
                    >
                        <Tabs.List>
                            <Tabs.Tab leftSection={<PiInfo size={px('1.2rem')} />} value="general">
                                {t('subscription-settings.widget.subscription-info')}
                            </Tabs.Tab>
                            <Tabs.Tab
                                leftSection={<PiChatsCircle size={px('1.2rem')} />}
                                value="remarks"
                            >
                                {t('subscription-settings.widget.user-status-remarks')}
                            </Tabs.Tab>
                            <Tabs.Tab
                                leftSection={<TbPrescription size={px('1.2rem')} />}
                                value="additional-response-headers"
                            >
                                {t('subscription-tabs.widget.additional-response-headers')}
                            </Tabs.Tab>
                        </Tabs.List>

                        <Tabs.Panel pt="xl" value="general">
                            <Transition
                                duration={200}
                                mounted={activeTab === 'general'}
                                timingFunction="linear"
                                transition="fade"
                            >
                                {(styles) => (
                                    <Stack gap="lg" style={styles}>
                                        <Card shadow="md" withBorder>
                                            <Card.Section p="lg" withBorder>
                                                <Group align="center" gap="md" wrap="nowrap">
                                                    <ThemeIcon
                                                        color="blue"
                                                        size={40}
                                                        variant="light"
                                                    >
                                                        <PiUserCircle size="1.8rem" />
                                                    </ThemeIcon>
                                                    <Stack gap={4}>
                                                        <Title fw={600} mb={2} order={4}>
                                                            {t(
                                                                'subscription-settings.widget.subscription-info'
                                                            )}
                                                        </Title>
                                                        <Text c="dimmed" lh={1.5} size="sm">
                                                            {t(
                                                                'subscription-settings.widget.subscription-info-description'
                                                            )}
                                                        </Text>
                                                    </Stack>
                                                </Group>
                                            </Card.Section>

                                            <Card.Section p="lg">
                                                <Grid>
                                                    <Grid.Col span={{ xs: 12, sm: 6 }}>
                                                        <TextInput
                                                            description={t(
                                                                'subscription-settings.widget.this-title-will-be-displayed-as-subscription-name'
                                                            )}
                                                            key={form.key('profileTitle')}
                                                            label={t(
                                                                'subscription-settings.widget.profile-title'
                                                            )}
                                                            leftSection={
                                                                <TemplateInfoPopoverShared
                                                                    showHostDescription={false}
                                                                />
                                                            }
                                                            placeholder={t(
                                                                'subscription-settings.widget.enter-profile-title'
                                                            )}
                                                            size="sm"
                                                            {...form.getInputProps('profileTitle')}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={{ xs: 12, sm: 6 }}>
                                                        <NumberInput
                                                            description={t(
                                                                'subscription-settings.widget.auto-update-description'
                                                            )}
                                                            key={form.key('profileUpdateInterval')}
                                                            label={t(
                                                                'subscription-settings.widget.auto-update-interval-hours'
                                                            )}
                                                            leftSection={
                                                                <PiClock size={px('1.2rem')} />
                                                            }
                                                            min={1}
                                                            placeholder="60"
                                                            size="sm"
                                                            {...form.getInputProps(
                                                                'profileUpdateInterval'
                                                            )}
                                                        />
                                                    </Grid.Col>
                                                    <Grid.Col span={{ xs: 12, sm: 6 }}>
                                                        <TextInput
                                                            description={t(
                                                                'subscription-settings.widget.support-link-description'
                                                            )}
                                                            key={form.key('supportLink')}
                                                            label={t(
                                                                'subscription-settings.widget.support-link'
                                                            )}
                                                            leftSection={
                                                                <PiLink size={px('1.2rem')} />
                                                            }
                                                            placeholder="https://support.example.com"
                                                            size="sm"
                                                            {...form.getInputProps('supportLink')}
                                                        />
                                                    </Grid.Col>
                                                </Grid>
                                            </Card.Section>
                                        </Card>

                                        <Card shadow="md" withBorder>
                                            <Card.Section p="lg" withBorder>
                                                <Group align="center" gap="md" wrap="nowrap">
                                                    <ThemeIcon
                                                        color="cyan"
                                                        size={40}
                                                        variant="light"
                                                    >
                                                        <PiGear size="1.8rem" />
                                                    </ThemeIcon>
                                                    <Stack gap={4}>
                                                        <Title fw={600} mb={2} order={4}>
                                                            {t(
                                                                'subscription-tabs.widget.additional-options'
                                                            )}
                                                        </Title>
                                                        <Text c="dimmed" lh={1.5} size="sm">
                                                            {t(
                                                                'subscription-tabs.widget.configure-additional-subscription-options'
                                                            )}
                                                        </Text>
                                                    </Stack>
                                                </Group>
                                            </Card.Section>

                                            <Card.Section p="lg">
                                                <Grid>
                                                    <Grid.Col span={{ xs: 12, sm: 6 }}>
                                                        <Checkbox
                                                            description={t(
                                                                'subscription-settings.widget.serve-json-description'
                                                            )}
                                                            key={form.key(
                                                                'serveJsonAtBaseSubscription'
                                                            )}
                                                            label={t(
                                                                'subscription-settings.widget.serve-json-at-base-subscription'
                                                            )}
                                                            size="sm"
                                                            {...form.getInputProps(
                                                                'serveJsonAtBaseSubscription',
                                                                {
                                                                    type: 'checkbox'
                                                                }
                                                            )}
                                                        />
                                                    </Grid.Col>

                                                    <Grid.Col span={{ xs: 12, sm: 6 }}>
                                                        <Checkbox
                                                            description={t(
                                                                'subscription-settings.widget.add-username-description'
                                                            )}
                                                            key={form.key(
                                                                'addUsernameToBaseSubscription'
                                                            )}
                                                            label={t(
                                                                'subscription-settings.widget.add-username-to-base-subscription'
                                                            )}
                                                            size="sm"
                                                            {...form.getInputProps(
                                                                'addUsernameToBaseSubscription',
                                                                {
                                                                    type: 'checkbox'
                                                                }
                                                            )}
                                                        />
                                                    </Grid.Col>

                                                    <Grid.Col span={{ xs: 12, sm: 6 }}>
                                                        <Checkbox
                                                            description={t(
                                                                'subscription-tabs.widget.randomize-hosts-description'
                                                            )}
                                                            key={form.key('randomizeHosts')}
                                                            label={t(
                                                                'subscription-tabs.widget.randomize-hosts'
                                                            )}
                                                            size="sm"
                                                            {...form.getInputProps(
                                                                'randomizeHosts',
                                                                {
                                                                    type: 'checkbox'
                                                                }
                                                            )}
                                                        />
                                                    </Grid.Col>

                                                    <Grid.Col span={{ xs: 12, sm: 6 }}>
                                                        <Checkbox
                                                            description={t(
                                                                'subscription-settings.widget.profile-webpage-url-description'
                                                            )}
                                                            key={form.key(
                                                                'isProfileWebpageUrlEnabled'
                                                            )}
                                                            label={t(
                                                                'subscription-settings.widget.profile-webpage-url'
                                                            )}
                                                            size="sm"
                                                            {...form.getInputProps(
                                                                'isProfileWebpageUrlEnabled',
                                                                {
                                                                    type: 'checkbox'
                                                                }
                                                            )}
                                                        />
                                                    </Grid.Col>
                                                </Grid>
                                            </Card.Section>
                                        </Card>
                                        <Card shadow="md" withBorder>
                                            <Card.Section p="lg" withBorder>
                                                <Group align="center" gap="md" wrap="nowrap">
                                                    <ThemeIcon
                                                        color="cyan"
                                                        size={40}
                                                        variant="light"
                                                    >
                                                        <PiDeviceMobile size="1.8rem" />
                                                    </ThemeIcon>
                                                    <Stack gap={4}>
                                                        <Title fw={600} mb={2} order={4}>
                                                            {t(
                                                                'subscription-tabs.widget.announce-and-routing'
                                                            )}
                                                        </Title>
                                                        <Text c="dimmed" lh={1.5} size="sm">
                                                            {t(
                                                                'subscription-tabs.widget.announce-and-routing-description'
                                                            )}
                                                        </Text>
                                                    </Stack>
                                                </Group>
                                            </Card.Section>

                                            <Card.Section p="lg">
                                                <Stack gap="xl">
                                                    <Textarea
                                                        description={t(
                                                            'subscription-tabs.widget.announce-description'
                                                        )}
                                                        key={form.key('happAnnounce')}
                                                        label="Announce"
                                                        leftSection={
                                                            <TemplateInfoPopoverShared
                                                                showHostDescription={false}
                                                            />
                                                        }
                                                        minRows={4}
                                                        placeholder={t(
                                                            'subscription-tabs.widget.enter-announce-text-max-200-characters'
                                                        )}
                                                        size="sm"
                                                        style={{
                                                            placeContent: 'center'
                                                        }}
                                                        {...form.getInputProps('happAnnounce')}
                                                    />

                                                    <Textarea
                                                        description={
                                                            <Box>
                                                                <Text c="dimmed" size="sm">
                                                                    {t(
                                                                        'subscription-settings.widget.happ-routing-description'
                                                                    )}{' '}
                                                                    <br />
                                                                    {t(
                                                                        'subscription-settings.widget.happ-routing-description-line-2'
                                                                    )}
                                                                </Text>
                                                                <Button
                                                                    color="grape"
                                                                    leftSection={
                                                                        <PiGear
                                                                            size={px('1.2rem')}
                                                                        />
                                                                    }
                                                                    mb="xs"
                                                                    mt="xs"
                                                                    onClick={() => {
                                                                        navigate(
                                                                            ROUTES.DASHBOARD.UTILS
                                                                                .HAPP_ROUTING_BUILDER
                                                                        )
                                                                    }}
                                                                    size="sm"
                                                                    variant="light"
                                                                    w="fit-content"
                                                                >
                                                                    {t(
                                                                        'subscription-settings.widget.configure-happ-routing'
                                                                    )}
                                                                </Button>
                                                            </Box>
                                                        }
                                                        key={form.key('happRouting')}
                                                        label={t(
                                                            'subscription-settings.widget.happ-routing'
                                                        )}
                                                        minRows={4}
                                                        placeholder="happ://routing/add/..."
                                                        size="sm"
                                                        {...form.getInputProps('happRouting')}
                                                    />
                                                </Stack>
                                            </Card.Section>
                                        </Card>
                                    </Stack>
                                )}
                            </Transition>
                        </Tabs.Panel>

                        <Tabs.Panel pt="xl" value="remarks">
                            <Transition
                                duration={200}
                                mounted={activeTab === 'remarks'}
                                timingFunction="linear"
                                transition="fade"
                            >
                                {(styles) => (
                                    <Stack gap="lg" style={styles}>
                                        <Card shadow="sm" withBorder>
                                            <Card.Section p="lg" withBorder>
                                                <Group align="center" gap="md" wrap="nowrap">
                                                    <ThemeIcon
                                                        color="blue"
                                                        size={40}
                                                        variant="light"
                                                    >
                                                        <PiChatsCircle size="24px" />
                                                    </ThemeIcon>
                                                    <Stack gap={4}>
                                                        <Title fw={600} mb={2} order={4}>
                                                            {t(
                                                                'subscription-settings.widget.user-status-remarks'
                                                            )}
                                                        </Title>
                                                        <Text c="dimmed" lh={1.5} size="sm">
                                                            {t(
                                                                'subscription-settings.widget.user-status-remarks-description'
                                                            )}
                                                            <br />
                                                            {t(
                                                                'subscription-settings.widget.user-status-remarks-description-line-2'
                                                            )}
                                                            <br />
                                                            {t(
                                                                'subscription-settings.widget.user-status-remarks-description-line-3'
                                                            )}
                                                        </Text>
                                                    </Stack>
                                                </Group>
                                            </Card.Section>

                                            <Card.Section p="lg" withBorder>
                                                <Box>
                                                    <Checkbox
                                                        description={
                                                            <>
                                                                {t(
                                                                    'subscription-tabs.widget.show-custom-remark-description-line-1'
                                                                )}
                                                                <br />
                                                                {t(
                                                                    'subscription-tabs.widget.show-custom-remark-description-line-2'
                                                                )}
                                                            </>
                                                        }
                                                        key={form.key('isShowCustomRemarks')}
                                                        label={t(
                                                            'subscription-tabs.widget.show-custom-remarks'
                                                        )}
                                                        size="sm"
                                                        {...form.getInputProps(
                                                            'isShowCustomRemarks',
                                                            {
                                                                type: 'checkbox'
                                                            }
                                                        )}
                                                    />
                                                </Box>
                                            </Card.Section>

                                            <Card.Section p="lg" withBorder>
                                                <Grid>
                                                    <Grid.Col span={{ xs: 12, sm: 6, md: 4 }}>
                                                        <RemarksManager
                                                            icon={<PiClockUser size="16px" />}
                                                            iconColor="red"
                                                            initialRemarks={remarks.expired}
                                                            onChange={updateExpiredRemarks}
                                                            title={t(
                                                                'subscription-settings.widget.expired-users-remarks'
                                                            )}
                                                        />
                                                    </Grid.Col>

                                                    <Grid.Col span={{ xs: 12, sm: 6, md: 4 }}>
                                                        <RemarksManager
                                                            icon={<PiClockCountdown size="16px" />}
                                                            iconColor="orange"
                                                            initialRemarks={remarks.limited}
                                                            onChange={updateLimitedRemarks}
                                                            title={t(
                                                                'subscription-settings.widget.limited-users-remarks'
                                                            )}
                                                        />
                                                    </Grid.Col>

                                                    <Grid.Col span={{ xs: 12, sm: 6, md: 4 }}>
                                                        <RemarksManager
                                                            icon={<PiProhibit size="16px" />}
                                                            iconColor="gray"
                                                            initialRemarks={remarks.disabled}
                                                            onChange={updateDisabledRemarks}
                                                            title={t(
                                                                'subscription-settings.widget.disabled-users-remarks'
                                                            )}
                                                        />
                                                    </Grid.Col>
                                                </Grid>
                                            </Card.Section>
                                        </Card>
                                    </Stack>
                                )}
                            </Transition>
                        </Tabs.Panel>

                        <Tabs.Panel pt="xl" value="additional-response-headers">
                            <Transition
                                duration={200}
                                mounted={activeTab === 'additional-response-headers'}
                                timingFunction="linear"
                                transition="fade"
                            >
                                {(styles) => (
                                    <Card shadow="sm" style={styles} withBorder>
                                        <Card.Section p="lg" withBorder>
                                            <Group align="center" gap="md" wrap="nowrap">
                                                <ThemeIcon color="blue" size={40} variant="light">
                                                    <TbPrescription size="24px" />
                                                </ThemeIcon>
                                                <Stack gap={4}>
                                                    <Title fw={600} mb={2} order={4}>
                                                        {t(
                                                            'subscription-tabs.widget.additional-response-headers'
                                                        )}
                                                    </Title>
                                                    <Text c="dimmed" lh={1.5} size="sm">
                                                        {t(
                                                            'subscription-tabs.widget.headers-that-will-be-sent-with-subscription-content'
                                                        )}
                                                    </Text>
                                                </Stack>
                                            </Group>
                                        </Card.Section>

                                        {form.errors.customResponseHeaders && (
                                            <Card.Section p="lg">
                                                <Alert
                                                    color="red"
                                                    icon={<PiInfo />}
                                                    title={t('subscription-tabs.widget.error')}
                                                >
                                                    {form.errors.customResponseHeaders}
                                                </Alert>
                                            </Card.Section>
                                        )}

                                        <Card.Section p="lg">
                                            <HeadersManager
                                                initialHeaders={headers}
                                                onChange={updateHeaders}
                                            />
                                        </Card.Section>
                                    </Card>
                                )}
                            </Transition>
                        </Tabs.Panel>
                    </Tabs>

                    <Card className={styles.footer} h="auto" m="0" mt="md" pos="sticky">
                        <Card.Section p="lg">
                            <Group align="center" justify="flex-start">
                                <Button
                                    color="teal"
                                    leftSection={<PiFloppyDisk size={px('1.2rem')} />}
                                    loading={isUpdateSubscriptionSettingsPending}
                                    size="md"
                                    type="submit"
                                >
                                    {t('subscription-settings.widget.update-settings')}
                                </Button>
                            </Group>
                        </Card.Section>
                    </Card>
                </Stack>
            </Container>
        </form>
    )
}
