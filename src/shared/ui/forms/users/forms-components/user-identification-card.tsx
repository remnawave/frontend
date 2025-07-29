import {
    ActionIcon,
    Code,
    CopyButton,
    Fieldset,
    Group,
    HoverCard,
    Stack,
    Text,
    TextInput
} from '@mantine/core'
import { PiCheck, PiCopy, PiLinkDuotone, PiUserDuotone } from 'react-icons/pi'
import { ForwardRefComponent, HTMLMotionProps, Variants } from 'motion/react'
import { HiIdentification, HiQuestionMarkCircle } from 'react-icons/hi'
import { GetUserByUuidCommand } from '@remnawave/backend-contract'
import { useTranslation } from 'react-i18next'

import { UserStatusBadge } from '@widgets/dashboard/users/user-status-badge'

interface IProps {
    cardVariants: Variants
    motionWrapper: ForwardRefComponent<HTMLDivElement, HTMLMotionProps<'div'>>
    user: GetUserByUuidCommand.Response['response']
    userSubscriptionUrlMemo: string
}

export const UserIdentificationCard = (props: IProps) => {
    const { t } = useTranslation()

    const { cardVariants, motionWrapper, user, userSubscriptionUrlMemo } = props

    const MotionWrapper = motionWrapper

    return (
        <MotionWrapper variants={cardVariants}>
            <Fieldset
                legend={
                    <Group gap="xs" mb="xs">
                        <HiIdentification
                            size={20}
                            style={{
                                color: 'var(--mantine-color-blue-4)'
                            }}
                        />
                        <UserStatusBadge key="view-user-status-badge" status={user.status} />
                    </Group>
                }
            >
                <Stack gap="md">
                    <CopyButton timeout={2000} value={user.username}>
                        {({ copied, copy }) => (
                            <TextInput
                                label="Username"
                                leftSection={
                                    copied ? (
                                        <PiCheck color="var(--mantine-color-teal-6)" size="16px" />
                                    ) : (
                                        <PiUserDuotone size="16px" />
                                    )
                                }
                                onClick={copy}
                                readOnly
                                styles={{
                                    input: {
                                        cursor: 'copy',
                                        fontFamily: 'monospace'
                                    }
                                }}
                                value={user.username}
                            />
                        )}
                    </CopyButton>

                    <TextInput
                        disabled
                        label={t('view-user-modal.widget.subscription-short-uuid')}
                        leftSection={<PiLinkDuotone size="16px" />}
                        rightSection={
                            <CopyButton timeout={2000} value={user.shortUuid}>
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
                        styles={{
                            label: { fontWeight: 500 }
                        }}
                        value={user.shortUuid}
                    />

                    <TextInput
                        disabled
                        label={
                            <Group gap={4} justify="flex-start">
                                <Text fw={500} fz="sm">
                                    {t('view-user-modal.widget.subscription-url')}
                                </Text>
                                <HoverCard shadow="md" width={280} withArrow>
                                    <HoverCard.Target>
                                        <ActionIcon color="gray" mb={2} size="xs" variant="subtle">
                                            <HiQuestionMarkCircle size={16} />
                                        </ActionIcon>
                                    </HoverCard.Target>
                                    <HoverCard.Dropdown>
                                        <Stack gap="sm">
                                            <Text fw={600} size="sm">
                                                {t('view-user-modal.widget.subscription-url')}
                                            </Text>
                                            <Text c="dimmed" size="sm">
                                                {t(
                                                    'view-user-modal.widget.subscription-url-description-line-1'
                                                )}
                                                <Code bg="gray.1" c="dark.4" fw={700}>
                                                    SUB_PUBLIC_DOMAIN
                                                </Code>
                                                <br />
                                                {t(
                                                    'view-user-modal.widget.subscription-url-description-line-2'
                                                )}
                                            </Text>
                                            <Code bg="gray.1" block c="dark.4" fw={700}>
                                                docker compose down && docker compose up -d
                                            </Code>
                                        </Stack>
                                    </HoverCard.Dropdown>
                                </HoverCard>
                            </Group>
                        }
                        leftSection={<PiLinkDuotone size="16px" />}
                        rightSection={
                            <CopyButton timeout={2000} value={userSubscriptionUrlMemo || ''}>
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
                        value={userSubscriptionUrlMemo || ''}
                    />
                </Stack>
            </Fieldset>
        </MotionWrapper>
    )
}
