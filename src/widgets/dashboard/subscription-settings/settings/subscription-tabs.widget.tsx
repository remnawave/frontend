import {
    Box,
    Button,
    Card,
    Checkbox,
    Divider,
    Grid,
    Group,
    NumberInput,
    Select,
    Stack,
    Tabs,
    Text,
    Textarea,
    TextInput,
    ThemeIcon,
    Title,
    useMantineTheme
} from '@mantine/core'
import {
    PiChatsCircle,
    PiClockCountdown,
    PiClockUser,
    PiDeviceMobile,
    PiFloppyDisk,
    PiGear,
    PiInfo,
    PiProhibit,
    PiUserCircle
} from 'react-icons/pi'
import { UpdateSubscriptionSettingsCommand } from '@remnawave/backend-contract'
import { TbPrescription } from 'react-icons/tb'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useForm } from '@mantine/form'

import { TemplateInfoPopoverShared } from '@shared/ui/popovers/template-info-popover/template-info-popover.shared'
import { ROUTES } from '@shared/constants'

import { HeaderItem, HeadersManager } from './headers-manager.widget'
import { RemarksManager } from './remarks-manager.widget'

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
    const theme = useMantineTheme()
    const navigate = useNavigate()

    return (
        <form key="subscription-settings-form" onSubmit={handleSubmit}>
            <Stack gap="xl">
                <Tabs
                    color="cyan"
                    defaultValue="general"
                    radius="md"
                    style={{
                        width: '100%'
                    }}
                    styles={{
                        tab: {
                            paddingLeft: '20px',
                            paddingRight: '20px',
                            height: '52px',
                            fontSize: '16px',
                            fontWeight: 500
                        }
                    }}
                >
                    <Tabs.List>
                        <Tabs.Tab
                            leftSection={<PiInfo color={theme.colors.blue[6]} size="1.3rem" />}
                            value="general"
                        >
                            {t('subscription-settings.widget.subscription-info')}
                        </Tabs.Tab>
                        <Tabs.Tab
                            leftSection={
                                <PiDeviceMobile color={theme.colors.grape[6]} size="1.3rem" />
                            }
                            value="happ"
                        >
                            {t('subscription-settings.widget.happ-settings')}
                        </Tabs.Tab>
                        <Tabs.Tab
                            leftSection={
                                <PiChatsCircle color={theme.colors.teal[6]} size="1.3rem" />
                            }
                            value="remarks"
                        >
                            {t('subscription-settings.widget.user-status-remarks')}
                        </Tabs.Tab>
                        <Tabs.Tab
                            leftSection={
                                <TbPrescription color={theme.colors.indigo[6]} size="1.3rem" />
                            }
                            value="additional-response-headers"
                        >
                            {t('subscription-tabs.widget.additional-response-headers')}
                        </Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="general">
                        <Card mt="sm" p="md" radius="md" shadow="sm" withBorder>
                            <Card.Section inheritPadding p="md" withBorder>
                                <Group align="flex-start" wrap="nowrap">
                                    <ThemeIcon color="blue" radius="md" size="lg" variant="light">
                                        <PiUserCircle size="1.5rem" />
                                    </ThemeIcon>

                                    <Stack gap="xs">
                                        <Title fw={600} order={4}>
                                            {t('subscription-settings.widget.subscription-info')}
                                        </Title>

                                        <Text c="dimmed" size="sm">
                                            {t(
                                                'subscription-settings.widget.subscription-info-description'
                                            )}
                                        </Text>
                                    </Stack>
                                </Group>
                            </Card.Section>

                            <Card.Section p="md" pt="xl">
                                <Grid>
                                    <Grid.Col span={{ xs: 12, sm: 6 }}>
                                        <TextInput
                                            description={t(
                                                'subscription-settings.widget.this-title-will-be-displayed-as-subscription-name'
                                            )}
                                            key={form.key('profileTitle')}
                                            label={t('subscription-settings.widget.profile-title')}
                                            leftSection={
                                                <TemplateInfoPopoverShared
                                                    showHostDescription={false}
                                                />
                                            }
                                            placeholder={t(
                                                'subscription-settings.widget.enter-profile-title'
                                            )}
                                            radius="md"
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
                                            min={1}
                                            placeholder="60"
                                            radius="md"
                                            {...form.getInputProps('profileUpdateInterval')}
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={{ xs: 12, sm: 6 }}>
                                        <TextInput
                                            description={t(
                                                'subscription-settings.widget.support-link-description'
                                            )}
                                            key={form.key('supportLink')}
                                            label={t('subscription-settings.widget.support-link')}
                                            placeholder="https://support.example.com"
                                            radius="md"
                                            {...form.getInputProps('supportLink')}
                                        />
                                    </Grid.Col>

                                    <Grid.Col span={{ xs: 12, sm: 6 }}>
                                        <Select
                                            allowDeselect={false}
                                            comboboxProps={{
                                                transitionProps: {
                                                    transition: 'pop',
                                                    duration: 200
                                                }
                                            }}
                                            data={[
                                                {
                                                    label: t(
                                                        'subscription-settings.widget.enabled'
                                                    ),
                                                    value: 'true'
                                                },
                                                {
                                                    label: t(
                                                        'subscription-settings.widget.disabled'
                                                    ),
                                                    value: 'false'
                                                }
                                            ]}
                                            description={t(
                                                'subscription-settings.widget.profile-webpage-url-description'
                                            )}
                                            key={form.key('isProfileWebpageUrlEnabled')}
                                            label={t(
                                                'subscription-settings.widget.profile-webpage-url'
                                            )}
                                            radius="md"
                                            {...form.getInputProps('isProfileWebpageUrlEnabled')}
                                        />
                                    </Grid.Col>

                                    <Grid.Col span={12}>
                                        <Divider labelPosition="center" my="md" />
                                    </Grid.Col>

                                    <Grid.Col span={{ xs: 12, sm: 6 }}>
                                        <Box mb="md">
                                            <Checkbox
                                                key={form.key('serveJsonAtBaseSubscription')}
                                                label={t(
                                                    'subscription-settings.widget.serve-json-at-base-subscription'
                                                )}
                                                size="md"
                                                {...form.getInputProps(
                                                    'serveJsonAtBaseSubscription',
                                                    {
                                                        type: 'checkbox'
                                                    }
                                                )}
                                            />
                                            <Text
                                                c="dimmed"
                                                component="div"
                                                ml={30}
                                                pl={'0.4rem'}
                                                size="sm"
                                            >
                                                {t(
                                                    'subscription-settings.widget.serve-json-description'
                                                )}
                                            </Text>
                                        </Box>
                                    </Grid.Col>

                                    <Grid.Col span={{ xs: 12, sm: 6 }}>
                                        <Box>
                                            <Checkbox
                                                key={form.key('addUsernameToBaseSubscription')}
                                                label={t(
                                                    'subscription-settings.widget.add-username-to-base-subscription'
                                                )}
                                                size="md"
                                                {...form.getInputProps(
                                                    'addUsernameToBaseSubscription',
                                                    {
                                                        type: 'checkbox'
                                                    }
                                                )}
                                            />
                                            <Text
                                                c="dimmed"
                                                component="div"
                                                ml={30}
                                                pl={'0.4rem'}
                                                size="sm"
                                            >
                                                {t(
                                                    'subscription-settings.widget.add-username-description'
                                                )}
                                            </Text>
                                        </Box>
                                    </Grid.Col>
                                </Grid>
                            </Card.Section>
                        </Card>
                    </Tabs.Panel>

                    <Tabs.Panel value="happ">
                        <Card mt="sm" p="md" radius="md" shadow="sm" withBorder>
                            <Card.Section inheritPadding p="md" withBorder>
                                <Group align="flex-start" wrap="nowrap">
                                    <ThemeIcon color="grape" radius="md" size="lg" variant="light">
                                        <PiDeviceMobile size="1.5rem" />
                                    </ThemeIcon>

                                    <Stack gap="xs">
                                        <Title fw={600} order={4}>
                                            {t('subscription-settings.widget.happ-settings')}
                                        </Title>

                                        <Text c="dimmed" size="sm">
                                            {t(
                                                'subscription-settings.widget.happ-description-line-1'
                                            )}{' '}
                                            <br />
                                            {t(
                                                'subscription-settings.widget.happ-description-line-2'
                                            )}
                                        </Text>
                                    </Stack>
                                </Group>
                            </Card.Section>

                            <Card.Section p="md" pt="xl">
                                <Stack gap="lg">
                                    <Textarea
                                        description={t(
                                            'subscription-settings.widget.happ-announce-description'
                                        )}
                                        key={form.key('happAnnounce')}
                                        label={t('subscription-settings.widget.happ-announce')}
                                        minRows={4}
                                        placeholder={t(
                                            'subscription-settings.widget.enter-happ-announce-max-200-characters'
                                        )}
                                        radius="md"
                                        {...form.getInputProps('happAnnounce')}
                                    />

                                    <Textarea
                                        description={
                                            <>
                                                {t(
                                                    'subscription-settings.widget.happ-routing-description'
                                                )}{' '}
                                                <br />
                                                {t(
                                                    'subscription-settings.widget.happ-routing-description-line-2'
                                                )}
                                                <br />
                                                <Button
                                                    color="grape"
                                                    leftSection={<PiGear size="1.2rem" />}
                                                    mb="md"
                                                    mt={'md'}
                                                    onClick={() => {
                                                        navigate(
                                                            ROUTES.DASHBOARD.UTILS
                                                                .HAPP_ROUTING_BUILDER
                                                        )
                                                    }}
                                                    radius="md"
                                                    size="sm"
                                                    variant="light"
                                                    w="fit-content"
                                                >
                                                    {t(
                                                        'subscription-settings.widget.configure-happ-routing'
                                                    )}
                                                </Button>
                                            </>
                                        }
                                        key={form.key('happRouting')}
                                        label={t('subscription-settings.widget.happ-routing')}
                                        minRows={4}
                                        placeholder="happ://routing/add/..."
                                        radius="md"
                                        {...form.getInputProps('happRouting')}
                                    />
                                </Stack>
                            </Card.Section>
                        </Card>
                    </Tabs.Panel>

                    <Tabs.Panel value="remarks">
                        <Card mt="sm" p="md" radius="md" shadow="sm" withBorder>
                            <Card.Section inheritPadding p="md" withBorder>
                                <Group align="flex-start" wrap="nowrap">
                                    <ThemeIcon color="teal" radius="md" size="lg" variant="light">
                                        <PiChatsCircle size="1.5rem" />
                                    </ThemeIcon>

                                    <Stack gap="xs">
                                        <Title fw={600} order={4}>
                                            {t('subscription-settings.widget.user-status-remarks')}
                                        </Title>

                                        <Text c="dimmed" size="sm">
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

                            <Card.Section p="md" pt="xl" withBorder>
                                <Grid>
                                    <Grid.Col span={{ xs: 12, sm: 6 }}>
                                        <Box mb="md">
                                            <Checkbox
                                                key={form.key('isShowCustomRemarks')}
                                                label={t(
                                                    'subscription-tabs.widget.show-custom-remarks'
                                                )}
                                                size="md"
                                                {...form.getInputProps('isShowCustomRemarks', {
                                                    type: 'checkbox'
                                                })}
                                            />
                                            <Text
                                                c="dimmed"
                                                component="div"
                                                ml={30}
                                                pl={'0.4rem'}
                                                size="sm"
                                            >
                                                {t(
                                                    'subscription-tabs.widget.show-custom-remark-description-line-1'
                                                )}
                                                <br />
                                                {t(
                                                    'subscription-tabs.widget.show-custom-remark-description-line-2'
                                                )}
                                            </Text>
                                        </Box>
                                    </Grid.Col>
                                </Grid>
                            </Card.Section>

                            <Card.Section p="md" pt="xl">
                                <Grid>
                                    <Grid.Col span={{ xs: 12, sm: 6, md: 4 }}>
                                        <RemarksManager
                                            icon={<PiClockUser size="1rem" />}
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
                                            icon={<PiClockCountdown size="1rem" />}
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
                                            icon={<PiProhibit size="1rem" />}
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
                    </Tabs.Panel>

                    <Tabs.Panel value="additional-response-headers">
                        <Card mt="sm" p="md" radius="md" shadow="sm" withBorder>
                            <Card.Section inheritPadding p="md" withBorder>
                                <Group align="flex-start" wrap="nowrap">
                                    <ThemeIcon color="indigo" radius="md" size="lg" variant="light">
                                        <TbPrescription size="1.5rem" />
                                    </ThemeIcon>

                                    <Stack gap="xs">
                                        <Title fw={600} order={4}>
                                            {t(
                                                'subscription-tabs.widget.additional-response-headers'
                                            )}
                                        </Title>

                                        <Text c="dimmed" size="sm">
                                            {t(
                                                'subscription-tabs.widget.headers-that-will-be-sent-with-subscription-content'
                                            )}
                                        </Text>
                                    </Stack>
                                </Group>
                            </Card.Section>

                            <Card.Section p="md" pt="xl">
                                <HeadersManager initialHeaders={headers} onChange={updateHeaders} />
                            </Card.Section>
                        </Card>
                    </Tabs.Panel>
                </Tabs>

                <Group justify="flex-start" mb="xl">
                    <Button
                        color="blue"
                        leftSection={<PiFloppyDisk size="1.2rem" />}
                        loading={isUpdateSubscriptionSettingsPending}
                        size="md"
                        type="submit"
                    >
                        {t('subscription-settings.widget.update-settings')}
                    </Button>
                </Group>
            </Stack>
        </form>
    )
}
