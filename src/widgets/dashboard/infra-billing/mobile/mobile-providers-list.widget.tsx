import {
    ActionIcon,
    Avatar,
    Center,
    Group,
    MantineStyleProp,
    Stack,
    Text,
    ThemeIcon
} from '@mantine/core'
import { GetInfraProvidersCommand } from '@remnawave/backend-contract'
import { TbCloud, TbEdit, TbLink, TbTrash } from 'react-icons/tb'
import { useTranslation } from 'react-i18next'
import { modals } from '@mantine/modals'

import { MODALS, useModalsStoreOpenWithData } from '@entities/dashboard/modal-store'
import { faviconResolver, formatCurrencyWithIntl } from '@shared/utils/misc'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { QueryKeys, useDeleteInfraProvider } from '@shared/api/hooks'
import { CountryFlag } from '@shared/ui/get-country-flag'
import { SectionCard } from '@shared/ui/section-card'
import { queryClient } from '@shared/api'

interface IProps {
    providers: GetInfraProvidersCommand.Response['response']['providers']
    style: MantineStyleProp
}

export function MobileProvidersListWidget(props: IProps) {
    const { providers, style } = props
    const openModalWithData = useModalsStoreOpenWithData()
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

    const handleOpenProvider = (
        provider: GetInfraProvidersCommand.Response['response']['providers'][number]
    ) => {
        openModalWithData(MODALS.VIEW_INFRA_PROVIDER_DRAWER, provider)
    }

    const handleDeleteProvider = (uuid: string) =>
        modals.openConfirmModal({
            title: t('common.confirm-action'),
            children: t('common.confirm-action-description'),
            labels: { confirm: t('common.delete'), cancel: t('common.cancel') },
            centered: true,
            confirmProps: { color: 'red' },
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
                                    onClick={() => handleOpenProvider(provider)}
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
                                    {t('users-metrics.widget.total')}
                                </Text>
                            </Stack>
                        </Group>
                    </SectionCard.Section>

                    {provider.billingNodes.length > 0 && (
                        <SectionCard.Section>
                            <Group gap="xs">
                                {provider.billingNodes.slice(0, 3).map((node, index) => (
                                    <Group gap={4} key={`${node.nodeUuid}-${index}`}>
                                        <CountryFlag countryCode={node.countryCode} />
                                        <Text c="white" fw={500} size="xs">
                                            {node.name}
                                        </Text>
                                    </Group>
                                ))}
                                {provider.billingNodes.length > 3 && (
                                    <Text c="dimmed" fw={500} size="xs">
                                        +{provider.billingNodes.length - 3}
                                    </Text>
                                )}
                            </Group>
                        </SectionCard.Section>
                    )}
                </SectionCard.Root>
            ))}
        </Stack>
    )
}
