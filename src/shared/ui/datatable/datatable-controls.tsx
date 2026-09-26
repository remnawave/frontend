import { type DataTableColumnToggle } from '@kastov/mantine-datatable'
import { Button, Group, Menu } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { TbChevronDown, TbRestore } from 'react-icons/tb'

import { ColumnsVisibilityPopover } from './columns-visibility-popover'

interface IProps {
    onResetColumnsOrder: () => void
    onResetColumnsToggle: () => void
    onResetColumnsWidth: () => void
    onResetSort?: () => void
    sortResetDisabled?: boolean

    columnsToggle?: DataTableColumnToggle[]
    labelByAccessor?: Record<string, string>
    setColumnsToggle?: (toggle: DataTableColumnToggle[]) => void
}

export function DataTableControls(props: IProps) {
    const { t } = useTranslation()
    const {
        onResetColumnsOrder,
        onResetColumnsToggle,
        onResetColumnsWidth,
        onResetSort,
        sortResetDisabled,
        columnsToggle,
        labelByAccessor,
        setColumnsToggle
    } = props

    return (
        <Group gap="xs" justify="right" mt="md">
            <Menu position="top-end" shadow="md" width={230} withinPortal>
                <Menu.Target>
                    <Button
                        leftSection={<TbRestore size={16} />}
                        rightSection={<TbChevronDown size={14} />}
                        size="sm"
                        variant="default"
                    >
                        {t('common.action.reset')}
                    </Button>
                </Menu.Target>
                <Menu.Dropdown>
                    {onResetSort && (
                        <Menu.Item
                            disabled={sortResetDisabled}
                            leftSection={<TbRestore size={14} />}
                            onClick={onResetSort}
                        >
                            {t('hosts-datatable.widget.reset-sort')}
                        </Menu.Item>
                    )}
                    <Menu.Item leftSection={<TbRestore size={14} />} onClick={onResetColumnsWidth}>
                        {t('nodes-datatable.widget.column-width')}
                    </Menu.Item>
                    <Menu.Item leftSection={<TbRestore size={14} />} onClick={onResetColumnsOrder}>
                        {t('nodes-datatable.widget.column-order')}
                    </Menu.Item>
                    <Menu.Item leftSection={<TbRestore size={14} />} onClick={onResetColumnsToggle}>
                        {t('nodes-datatable.widget.column-toggle')}
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>

            {columnsToggle && setColumnsToggle && (
                <ColumnsVisibilityPopover
                    columnsToggle={columnsToggle}
                    labelByAccessor={labelByAccessor ?? {}}
                    setColumnsToggle={setColumnsToggle}
                />
            )}
        </Group>
    )
}
