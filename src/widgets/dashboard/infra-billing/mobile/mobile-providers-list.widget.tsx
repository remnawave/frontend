import {
    ActionIcon,
    Avatar,
    Badge,
    Center,
    Group,
    MantineStyleProp,
    Stack,
    Text,
    ThemeIcon,
    Tooltip
} from '@mantine/core'
import { modals } from '@mantine/modals'
import { GetInfraProvidersCommand } from '@remnawave/backend-contract'
import { useTranslation } from 'react-i18next'
import { TbCloud, TbEdit, TbLink, TbServer, TbTrash } from 'react-icons/tb'

import { showModal } from '@shared/_modals/show-modal'
import { queryClient } from '@shared/api'
import { QueryKeys, useDeleteInfraProvider } from '@shared/api/hooks'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { SectionCard } from '@shared/ui/section-card'
import { SingleRowOverflowList } from '@shared/ui/single-row-overflow-list'
import { faviconResolver, formatCurrencyWithIntl } from '@shared/utils/misc'
import { resolveCountryCode } from '@shared/utils/misc/resolve-country-code'

interface IProps {
    providers: GetInfraProvidersCommand.Response['response']['providers']
    style: MantineStyleProp
}

export function MobileProvidersListWidget(props: IProps) {
    const { providers, style } = props
    const { t } = useTranslation()

    const { mutate: deleteProvider } = useDeleteInfraProvider({
        mutationFns: {
            onSuccess: () => {
                queryClient.refetchQueries({
                    queryKey: QueryKeys.infraBilling.getInfraProviders.queryKey
                })
                queryClient.refetchQueries({
                    queryKey: QueryKeys.infraBilling.getInfraBillingNodes.queryKey
                })
            }
        }
    })

    const handleDeleteProvider = (uuid: string) =>
        modals.openConfirmModal({
            title: t('common.action.confirm-action'),
            children: t('common.message.confirm-action-description'),
            labels: { confirm: t('common.action.delete'), cancel: t('common.action.cancel') },
            centered: true,
            confirmProps: { color: 'red', variant: 'soft' },
            cancelProps: {
                variant: 'subtle'
            },
            onConfirm: () => deleteProvider({ route: { uuid } })
        })

    if (providers.length === 0) {
        return (
            <SectionCard.Root p="xl">
                <SectionCard.Section>
                    <Center py="xl">
                        <Stack align="center" gap="lg">
                            <ThemeIcon color="gray" radius="xl" size={64} variant="soft">
                                <TbCloud size={32} />
                            </ThemeIcon>

                            <Stack align="center" gap="xs">
                                <Text c="dimmed" fw={600} size="md" ta="center">
                                    {t('infra-providers-table.widget.no-providers-found')}
                                </Text>
                            </Stack>
                        </Stack>
                    </Center>
                </SectionCard.Section>
            </SectionCard.Root>
        )
    }

    return (
        <Stack gap="xs" style={style}>
            {providers.map((provider) => (
                <SectionCard.Root key={provider.uuid}>
                    <SectionCard.Section>
                        <Group justify="space-between" wrap="nowrap">
                            <BaseOverlayHeader
                                icon={
                                    <Avatar
                                        alt={provider.name}
                                        color="initials"
                                        imageProps={{ decoding: 'async', loading: 'lazy' }}
                                        name={provider.name}
                                        onLoad={(event) => {
                                            const img = event.target as HTMLImageElement
                                            if (img.naturalWidth <= 24 && img.naturalHeight <= 24) {
                                                img.src = ''
                                            }
                                        }}
                                        radius="sm"
                                        size={18}
                                        src={faviconResolver(provider.faviconLink)}
                                    />
                                }
                                iconColor="violet"
                                IconComponent={TbCloud}
                                iconVariant="soft"
                                title={provider.name}
                                truncateTitle
                            />

                            <Group gap={4} wrap="nowrap">
                                {provider.loginUrl && (
                                    <ActionIcon
                                        color="teal"
                                        onClick={() => {
                                            window.open(
                                                provider.loginUrl!,
                                                '_blank',
                                                'noopener,noreferrer'
                                            )
                                        }}
                                        size="input-xs"
                                        variant="soft"
                                    >
                                        <TbLink size={16} />
                                    </ActionIcon>
                                )}
                                <ActionIcon
                                    color="blue"
                                    onClick={() =>
                                        showModal('infraBilling_viewInfraProviderModal', {
                                            infraProvider: provider
                                        })
                                    }
                                    size="input-xs"
                                    variant="soft"
                                >
                                    <TbEdit size={16} />
                                </ActionIcon>
                                <ActionIcon
                                    color="red"
                                    onClick={() => handleDeleteProvider(provider.uuid)}
                                    size="input-xs"
                                    variant="soft"
                                >
                                    <TbTrash size={16} />
                                </ActionIcon>
                            </Group>
                        </Group>
                    </SectionCard.Section>

                    <SectionCard.Section>
                        <Group grow>
                            <Stack align="center" gap={0}>
                                <Text fw={700} size="sm">
                                    {provider.billingNodes.length}
                                </Text>
                                <Text c="dimmed" size="xs">
                                    {t('constants.nodes')}
                                </Text>
                            </Stack>
                            <Stack align="center" gap={0}>
                                <Text fw={700} size="sm">
                                    {provider.billingHistory.totalBills}
                                </Text>
                                <Text c="dimmed" size="xs">
                                    {t('mobile-providers-list.widget.invoices')}
                                </Text>
                            </Stack>
                            <Stack align="center" gap={0}>
                                <Text c="teal" fw={700} size="sm">
                                    {formatCurrencyWithIntl(provider.billingHistory.totalAmount)}
                                </Text>
                                <Text c="dimmed" size="xs">
                                    {t('common.field.total')}
                                </Text>
                            </Stack>
                        </Group>
                    </SectionCard.Section>

                    {provider.billingNodes.length > 0 && (
                        <SectionCard.Section>
                            <SingleRowOverflowList
                                data={provider.billingNodes}
                                gap={4}
                                maxVisibleItems={3}
                                renderItem={(node) => (
                                    <Badge
                                        autoContrast
                                        color="gray"
                                        key={`${node.details ? node.details.nodeUuid : node.name}`}
                                        leftSection={
                                            node.details ? (
                                                resolveCountryCode(node.details.countryCode, 18)
                                            ) : (
                                                <TbServer size={18} />
                                            )
                                        }
                                        size="md"
                                        variant="soft"
                                    >
                                        {node.name}
                                    </Badge>
                                )}
                                renderOverflow={(items) => (
                                    <Tooltip
                                        label={
                                            <Stack gap="xs">
                                                {items.map((node) => (
                                                    <Badge
                                                        color="gray"
                                                        fullWidth
                                                        key={`${node.details ? node.details.nodeUuid : node.name}`}
                                                        leftSection={
                                                            node.details ? (
                                                                resolveCountryCode(
                                                                    node.details.countryCode,
                                                                    18
                                                                )
                                                            ) : (
                                                                <TbServer size={18} />
                                                            )
                                                        }
                                                        variant="soft"
                                                    >
                                                        {node.name}
                                                    </Badge>
                                                ))}
                                            </Stack>
                                        }
                                        multiline
                                        position="top"
                                    >
                                        <Badge color="gray" size="md" variant="soft">
                                            +{items.length}
                                        </Badge>
                                    </Tooltip>
                                )}
                            />
                        </SectionCard.Section>
                    )}
                </SectionCard.Root>
            ))}
        </Stack>
    )
}
