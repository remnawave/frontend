import { ComboboxItem, Group, Select, Text } from '@mantine/core'
import ReactCountryFlag from 'react-country-flag'
import { useTranslation } from 'react-i18next'
import { forwardRef, useState } from 'react'

import { useGetInfraBillingNodes } from '@shared/api/hooks'
import { LoadingScreen } from '@shared/ui/loading-screen'

import type { IProps } from './interfaces/props.interface'

interface ItemProps extends ComboboxItem {
    countryCode: null | string
    name: string
}

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
    ({ countryCode, name, ...others }: ItemProps, ref) => (
        <div ref={ref} {...others}>
            <Group gap="sm">
                {countryCode && countryCode !== 'XX' && (
                    <ReactCountryFlag
                        countryCode={countryCode}
                        style={{
                            fontSize: '1.1em',
                            borderRadius: '2px'
                        }}
                    />
                )}

                <Text fw={500} size="sm">
                    {name}
                </Text>
            </Group>
        </div>
    )
)

SelectItem.displayName = 'SelectItem'

export const SelectBillingNodeShared = (props: IProps) => {
    const { selectedBillingNodeUuid, setSelectedBillingNodeUuid } = props
    const { data: infraBillingNodes, isLoading } = useGetInfraBillingNodes()

    const { t } = useTranslation()

    const [selectedValue, setSelectedValue] = useState<null | string>(
        selectedBillingNodeUuid || null
    )

    if (isLoading) return <LoadingScreen />

    if (!infraBillingNodes?.availableBillingNodes?.length) {
        return (
            <Select
                data={[]}
                disabled
                label={t('select-billing-node.shared.billing-node')}
                placeholder={t('select-billing-node.shared.no-billing-nodes-available')}
            />
        )
    }

    const selectData: ItemProps[] = infraBillingNodes.availableBillingNodes.map((billingNode) => ({
        value: billingNode.uuid,
        label: billingNode.name,
        name: billingNode.name,
        countryCode: billingNode.countryCode
    }))

    const handleChange = (value: null | string) => {
        setSelectedValue(value)
        setSelectedBillingNodeUuid(value)
    }

    const currentSelectedUuid = selectedValue || selectedBillingNodeUuid

    let selectedBillingNode = null
    if (currentSelectedUuid) {
        selectedBillingNode = infraBillingNodes.availableBillingNodes.find(
            (billingNode) => billingNode.uuid === currentSelectedUuid
        )
    }

    let leftSection
    if (
        selectedBillingNode &&
        selectedBillingNode.countryCode &&
        selectedBillingNode.countryCode !== 'XX'
    ) {
        leftSection = (
            <ReactCountryFlag
                countryCode={selectedBillingNode.countryCode}
                style={{
                    fontSize: '1.1em',
                    borderRadius: '2px'
                }}
            />
        )
    }

    return (
        <Select
            allowDeselect
            clearable
            comboboxProps={{
                transitionProps: { transition: 'pop', duration: 200 },
                shadow: 'md'
            }}
            data={selectData}
            description={t('select-billing-node.shared.select-the-billing-node')}
            label={t('select-billing-node.shared.billing-node')}
            leftSection={leftSection}
            leftSectionPointerEvents="none"
            leftSectionWidth={selectedBillingNode ? 40 : 0}
            maxDropdownHeight={300}
            onChange={handleChange}
            placeholder={t('select-billing-node.shared.select-billing-node')}
            renderOption={(item) => {
                const option = item.option as ItemProps
                return <SelectItem {...option} />
            }}
            value={selectedValue}
        />
    )
}
