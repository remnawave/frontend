/* eslint-disable no-nested-ternary */
import { CloseButton, Combobox, InputBase, Loader, useCombobox } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { PiTagDuotone } from 'react-icons/pi'
import { useEffect, useState } from 'react'

import { useGetHostTags } from '@shared/api/hooks'

import type { IProps } from './interfaces/props.interface'

export function HostTagsInputWidget(props: IProps) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { value, onChange, defaultValue, ...restProps } = props
    const [data, setData] = useState<string[]>([])
    const [search, setSearch] = useState(value?.toString() || '')
    const [error, setError] = useState('')

    const { t } = useTranslation()

    const {
        data: hostTags,
        isRefetching: isHostTagsRefetching,
        isLoading: isHostTagsLoading
    } = useGetHostTags({
        rQueryParams: {
            enabled: false
        }
    })

    const combobox = useCombobox({
        onDropdownOpen: async () => {
            if (!isHostTagsLoading && !isHostTagsRefetching) {
                setData(hostTags?.tags || [])
            }
        }
    })

    const validateTag = (tag: string) => {
        if (!/^[A-Z0-9_]+$/.test(tag)) {
            return t('host-tags-input.tag-can-only-contain-uppercase-letters-numbers-underscores')
        }
        if (tag.length > 16) {
            return t('host-tags-input.tag-must-be-less-than-16-characters')
        }
        return null
    }

    useEffect(() => {
        if (hostTags && !isHostTagsLoading && !isHostTagsRefetching) {
            setData(hostTags.tags)
        }
    }, [hostTags, isHostTagsLoading, isHostTagsRefetching])

    useEffect(() => {
        setSearch(value?.toString() || '')
    }, [value])

    const exactOptionMatch = data.some((item) => item === search)
    const filteredOptions = exactOptionMatch
        ? data
        : data.filter((item) => item.toLowerCase().includes(search.toLowerCase().trim()))

    const options = filteredOptions.map((item) => (
        <Combobox.Option key={item} value={item}>
            {item}
        </Combobox.Option>
    ))

    return (
        <Combobox
            onExitTransitionEnd={() => {
                combobox.resetSelectedOption()
            }}
            onOptionSubmit={(val) => {
                if (val === '$create') {
                    const validationError = validateTag(search)
                    if (validationError) {
                        setError(validationError)
                        return
                    }
                    setData((current) => [...current, search])
                    onChange?.(search)
                    setError('')

                    return
                }

                onChange?.(val)
                setSearch(val)
                setError('')

                combobox.closeDropdown()
            }}
            position="bottom"
            store={combobox}
            withinPortal={false}
        >
            <Combobox.Target>
                <InputBase
                    {...restProps}
                    description={t(
                        'host-tags-input.tags-are-not-visible-to-end-users-tag-will-be-sent-with-raw-subscription-only'
                    )}
                    error={error || restProps.error}
                    label="Tag"
                    leftSection={<PiTagDuotone size="16px" />}
                    onBlur={() => {
                        combobox.closeDropdown()
                        onChange?.(search.trim() === '' ? null : search)
                    }}
                    onChange={(event) => {
                        combobox.openDropdown()
                        combobox.updateSelectedOptionIndex()
                        setSearch(event.currentTarget.value)
                    }}
                    onClick={() => combobox.openDropdown()}
                    onFocus={() => combobox.openDropdown()}
                    placeholder="ROUTING_HOST"
                    rightSection={
                        isHostTagsRefetching ? (
                            <Loader size="xs" />
                        ) : (value !== null && value !== undefined) || search ? (
                            <CloseButton
                                aria-label={t('host-tags-input.clear-value')}
                                onClick={() => {
                                    onChange?.(null)
                                    setError('')
                                    setSearch('')
                                }}
                                onMouseDown={(event) => event.preventDefault()}
                                size="sm"
                            />
                        ) : (
                            <Combobox.Chevron />
                        )
                    }
                    rightSectionPointerEvents={
                        (value === null || value === undefined) && !search ? 'none' : 'all'
                    }
                    value={search}
                />
            </Combobox.Target>

            <Combobox.Dropdown>
                <Combobox.Options mah={200} style={{ overflowY: 'auto' }}>
                    {isHostTagsLoading || isHostTagsRefetching ? (
                        <Combobox.Empty>Loading....</Combobox.Empty>
                    ) : (
                        options
                    )}
                    {!exactOptionMatch && search.trim().length > 0 && (
                        <Combobox.Option value="$create">+ {search}</Combobox.Option>
                    )}
                </Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    )
}
