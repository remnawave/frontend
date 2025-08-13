import { Avatar, ComboboxItem, Group, Select, Skeleton, Stack, Text } from '@mantine/core'
import { forwardRef, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useGetInfraProviders } from '@shared/api/hooks'
import { faviconResolver } from '@shared/utils/misc'

import type { IProps } from './interfaces/props.interface'

interface ItemProps extends ComboboxItem {
    faviconLink: null | string
    name: string
}

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
    ({ faviconLink, name, ...others }: ItemProps, ref) => (
        <div ref={ref} {...others}>
            <Group gap="sm">
                <Avatar
                    alt={name}
                    color="initials"
                    name={name}
                    onLoad={(event) => {
                        const img = event.target as HTMLImageElement
                        if (img.naturalWidth <= 16 && img.naturalHeight <= 16) {
                            img.src = ''
                        }
                    }}
                    radius="sm"
                    size={20}
                    src={faviconResolver(faviconLink)}
                />
                <Text fw={500} size="sm">
                    {name}
                </Text>
            </Group>
        </div>
    )
)

SelectItem.displayName = 'SelectItem'

export const SelectInfraProviderShared = (props: IProps) => {
    const { selectedInfraProviderUuid, setSelectedInfraProviderUuid } = props
    const { data: infraProviders, isLoading } = useGetInfraProviders()
    const { t } = useTranslation()

    const [selectedValue, setSelectedValue] = useState<null | string>(
        selectedInfraProviderUuid || null
    )

    useEffect(() => {
        setSelectedValue(selectedInfraProviderUuid || null)
    }, [selectedInfraProviderUuid])

    if (isLoading) {
        return (
            <Group gap="xs">
                <Stack gap={4} w="100%">
                    <Skeleton height={20} width="40%" />
                    <Skeleton height={15} width="80%" />
                    <Skeleton height={37} width="100%" />
                </Stack>
            </Group>
        )
    }

    if (!infraProviders?.providers?.length) {
        return (
            <Select
                data={[]}
                disabled
                label={t('select-infra-provider.shared.infrastructure-provider')}
                placeholder={t('select-infra-provider.shared.no-providers-available')}
            />
        )
    }

    const selectData: ItemProps[] = infraProviders.providers.map((provider) => ({
        value: provider.uuid,
        label: provider.name,
        name: provider.name,
        faviconLink: provider.faviconLink
    }))

    const handleChange = (value: null | string) => {
        setSelectedValue(value)
        setSelectedInfraProviderUuid(value)
    }

    const currentSelectedUuid = selectedValue || selectedInfraProviderUuid
    const selectedProvider = currentSelectedUuid
        ? infraProviders.providers.find((provider) => provider.uuid === currentSelectedUuid)
        : null

    const leftSection = selectedProvider ? (
        <Avatar
            alt={selectedProvider.name}
            color="initials"
            name={selectedProvider.name}
            onLoad={(event) => {
                const img = event.target as HTMLImageElement
                if (img.naturalWidth <= 16 && img.naturalHeight <= 16) {
                    img.src = ''
                }
            }}
            radius="sm"
            size={16}
            src={faviconResolver(selectedProvider.faviconLink)}
            style={{
                minWidth: 16,
                minHeight: 16
            }}
        />
    ) : undefined

    return (
        <Select
            allowDeselect
            clearable
            comboboxProps={{
                transitionProps: { transition: 'fade', duration: 200 },
                shadow: 'md'
            }}
            data={selectData}
            description={t('select-infra-provider.shared.select-the-infrastructure-provider')}
            label={t('select-infra-provider.shared.infrastructure-provider')}
            leftSection={leftSection}
            leftSectionPointerEvents="none"
            leftSectionWidth={selectedProvider ? 40 : 0}
            maxDropdownHeight={300}
            onChange={handleChange}
            placeholder={t('select-infra-provider.shared.select-provider')}
            renderOption={(item) => {
                const option = item.option as ItemProps
                return <SelectItem {...option} />
            }}
            searchable
            value={selectedValue}
        />
    )
}
