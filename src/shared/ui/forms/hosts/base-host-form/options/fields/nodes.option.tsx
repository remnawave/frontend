import { Badge, Checkbox, Group, MultiSelect } from '@mantine/core'

import { useSettingsRowControl } from '@shared/ui/settings-row'
import { TagInputPill } from '@shared/ui/tag-input-pill'
import { emojiFlag, resolveCountryCode } from '@shared/utils/misc/resolve-country-code'

import { useHostFormData } from '../host-form-data.context'

export function NodesOption() {
    const { form, nodes } = useHostFormData()
    const rowControl = useSettingsRowControl()

    return (
        <MultiSelect
            clearButtonProps={{ size: 'xs' }}
            data={nodes.map((node) => ({
                label: `${emojiFlag(node.countryCode)} ${node.name}${
                    node.provider ? ` (${node.provider.name})` : ''
                }`,
                value: node.uuid
            }))}
            key={form.key('nodes')}
            renderOption={(item) => {
                const node = nodes.find((node) => node.uuid === item.option.value)
                if (!node) return null
                return (
                    <>
                        <Checkbox
                            aria-hidden
                            checked={item.checked}
                            onChange={() => {}}
                            style={{ pointerEvents: 'none' }}
                            tabIndex={-1}
                        />
                        <Group gap={7} justify="space-between" w="100%">
                            <Group gap={7}>
                                {resolveCountryCode(node.countryCode)}
                                <span>{node.name}</span>
                            </Group>
                            {node.provider && (
                                <Badge color="gray" size="xs">
                                    {node.provider.name}
                                </Badge>
                            )}
                        </Group>
                    </>
                )
            }}
            renderPill={({ option, value, onRemove }) => (
                <TagInputPill onRemove={onRemove} value={option?.label ?? value} />
            )}
            searchable
            w="100%"
            {...rowControl}
            {...form.getInputProps('nodes')}
        />
    )
}
