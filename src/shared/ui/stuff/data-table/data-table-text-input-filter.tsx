import { TextInput, type TextInputProps } from '@mantine/core';
import type { UseDataTableReturn } from './use-data-table';

interface DataTableTextInputFilterProps
  extends Pick<UseDataTableReturn, 'filters'>,
    Omit<TextInputProps, 'value' | 'onChange'> {
  name: string;
  label: string;
}

export function DataTableTextInputFilter({
  name,
  label,
  filters,
  ...props
}: DataTableTextInputFilterProps) {
  return (
    <TextInput
      {...props}
      value={filters.filters[name]?.value as string}
      onChange={(e) => filters.change({ name, label, value: e.currentTarget.value })}
    />
  );
}
