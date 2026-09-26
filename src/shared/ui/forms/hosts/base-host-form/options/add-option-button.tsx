import { Button, Combobox, rem, Text, useCombobox } from '@mantine/core'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TbPlus } from 'react-icons/tb'

import { HOST_OPTION_GROUPS } from './host-option-fields'
import { useHostOptions } from './host-options.context'

export function AddOptionButton() {
    const { activate, inactiveFields } = useHostOptions()
    const { t } = useTranslation()
    const [search, setSearch] = useState('')

    const combobox = useCombobox({
        onDropdownClose: () => {
            combobox.resetSelectedOption()
            setSearch('')
        }
    })

    const query = search.trim().toLowerCase()

    const groups = useMemo(
        () =>
            HOST_OPTION_GROUPS.map((group) => ({
                group,
                options: inactiveFields
                    .filter((field) => field.group === group)
                    .map((field) => ({
                        label: String(t(field.labelKey as never)),
                        value: field.name
                    }))
                    .filter((option) => option.label.toLowerCase().includes(query))
            })).filter(({ options }) => options.length > 0),
        [inactiveFields, query, t]
    )

    return (
        <Combobox
            onOptionSubmit={(value) => {
                activate(value)
                combobox.closeDropdown()
            }}
            position="bottom-end"
            store={combobox}
            width={rem(320)}
            withinPortal={true}
        >
            <Combobox.Target>
                <Button
                    color="gray"
                    disabled={!inactiveFields.length}
                    leftSection={<TbPlus size={16} />}
                    miw={rem(200)}
                    onClick={() => combobox.toggleDropdown()}
                    size="sm"
                    variant="soft"
                >
                    {t('common.action.add')}
                </Button>
            </Combobox.Target>

            <Combobox.Dropdown>
                <Combobox.Search
                    onChange={(event) => setSearch(event.currentTarget.value)}
                    placeholder={t('common.action.search')}
                    value={search}
                />

                <Combobox.Options mah={280} style={{ overflowY: 'auto' }}>
                    {groups.length ? (
                        groups.map(({ group, options }) => (
                            <Combobox.Group
                                key={group}
                                label={t(`base-host-form.${group}` as never)}
                            >
                                {options.map((option) => (
                                    <Combobox.Option key={option.value} value={option.value}>
                                        {option.label}
                                    </Combobox.Option>
                                ))}
                            </Combobox.Group>
                        ))
                    ) : (
                        <Combobox.Empty>
                            <Text c="dimmed" size="sm">
                                {t('common.message.nothing-found')}
                            </Text>
                        </Combobox.Empty>
                    )}
                </Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    )
}
