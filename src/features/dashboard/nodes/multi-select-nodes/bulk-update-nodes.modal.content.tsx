import {
    ActionIcon,
    Button,
    CheckIcon,
    ComboboxItem,
    Group,
    HoverCard,
    MultiSelect,
    NumberInput,
    NumberInputHandlers,
    rem,
    Select,
    Stack,
    TagsInput,
    Text,
    Textarea
} from '@mantine/core'
import { useForm, schemaResolver } from '@mantine/form'
import { modals } from '@mantine/modals'
import { BulkNodesUpdateCommand, GetNodesCommand } from '@remnawave/backend-contract'
import { motion } from 'motion/react'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { HiQuestionMarkCircle } from 'react-icons/hi'
import { PiTagDuotone } from 'react-icons/pi'
import { TbCheck, TbMapPin, TbMinus, TbPackage, TbPlus, TbPlugConnected } from 'react-icons/tb'

import {
    QueryKeys,
    useBulkNodesUpdate,
    useGetNodeIntegrations,
    useGetNodePlugins,
    useGetNodesTags
} from '@shared/api/hooks'
import { queryClient } from '@shared/api/query-client'
import { COUNTRIES } from '@shared/ui/forms/nodes/base-node-form/constants'
import integrationsClasses from '@shared/ui/forms/nodes/base-node-form/integrations-select.module.css'
import { SelectInfraProviderShared } from '@shared/ui/infra-billing/select-infra-provider/select-infra-provider.shared'
import { LoaderModalShared } from '@shared/ui/loader-modal'
import { SectionCard } from '@shared/ui/section-card'
import { TagInputPill } from '@shared/ui/tag-input-pill'

type NodeType = GetNodesCommand.Response['response'][number]

interface IProps {
    selectedRecords: NodeType[]
    setSelectedRecords: (records: NodeType[]) => void
}

export const BulkUpdateNodesModalContent = (props: IProps) => {
    const { selectedRecords, setSelectedRecords } = props
    const { t } = useTranslation()
    const { mutateAsync: bulkUpdate, isPending } = useBulkNodesUpdate()
    const { data: nodePlugins, isLoading: isNodePluginsLoading } = useGetNodePlugins()
    const { data: tags, isLoading: isTagsLoading } = useGetNodesTags()
    const { data: nodeIntegrations, isLoading: isNodeIntegrationsLoading } =
        useGetNodeIntegrations()

    const consumptionMultiplierRef = useRef<NumberInputHandlers>(null)
    const nodeConsumptionMultiplierRef = useRef<NumberInputHandlers>(null)

    const uuids = selectedRecords.map((node) => node.uuid)

    const form = useForm<BulkNodesUpdateCommand.RequestBody>({
        name: 'bulk-update-nodes-form',
        mode: 'uncontrolled',
        validate: schemaResolver(BulkNodesUpdateCommand.RequestBodySchema),
        initialValues: {
            uuids,
            fields: {
                tags: undefined,
                countryCode: undefined,
                consumptionMultiplier: undefined,
                nodeConsumptionMultiplier: undefined,
                providerUuid: undefined,
                activePluginUuid: undefined,
                integrationUuids: undefined,
                note: undefined
            }
        }
    })

    const handleUpdate = async () => {
        if (isPending || uuids.length === 0) return

        const { fields } = form.getValues()
        await bulkUpdate({
            variables: {
                uuids,
                fields
            }
        })

        queryClient.refetchQueries({ queryKey: QueryKeys.nodes.getAllNodes.queryKey })
        modals.closeAll()
        setSelectedRecords([])
    }

    if (isNodePluginsLoading || isTagsLoading || isNodeIntegrationsLoading || !nodePlugins) {
        return (
            <motion.div
                animate={{ opacity: 1 }}
                initial={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
            >
                <LoaderModalShared h="78vh" />
            </motion.div>
        )
    }

    return (
        <Stack gap="md">
            <SectionCard.Root>
                <SectionCard.Section>
                    <Stack gap="md">
                        <Select
                            key={form.key('fields.countryCode')}
                            label={t('base-node-form.country')}
                            {...form.getInputProps('fields.countryCode')}
                            data={COUNTRIES}
                            leftSection={<TbMapPin size={16} />}
                            placeholder={t('base-node-form.select-country')}
                            searchable
                            styles={{
                                label: { fontWeight: 500 }
                            }}
                        />

                        <Select
                            key={form.key('fields.activePluginUuid')}
                            label={t('node-vitals.card.plugin')}
                            {...form.getInputProps('fields.activePluginUuid')}
                            allowDeselect
                            clearable
                            data={nodePlugins.nodePlugins.map((nodePlugin) => ({
                                label: nodePlugin.name,
                                value: nodePlugin.uuid
                            }))}
                            description={t(
                                'node-vitals.card.review-documentation-for-more-information'
                            )}
                            leftSection={<TbPackage size={16} />}
                            nothingFoundMessage={t('node-vitals.card.nothing-found')}
                            placeholder={t('node-vitals.card.select-plugin')}
                            searchable
                            styles={{
                                label: { fontWeight: 500 }
                            }}
                        />

                        <MultiSelect
                            key={form.key('fields.integrationUuids')}
                            label={t('node-integrations.select.label')}
                            {...form.getInputProps('fields.integrationUuids')}
                            clearable
                            data={(nodeIntegrations?.nodeIntegrations ?? []).map((integration) => ({
                                description: integration.description,
                                label: integration.name,
                                value: integration.uuid
                            }))}
                            leftSection={<TbPlugConnected size={16} />}
                            nothingFoundMessage={t('common.nothing-found')}
                            placeholder={t('node-integrations.select.placeholder')}
                            classNames={{ option: integrationsClasses.option }}
                            scrollAreaProps={{ styles: { content: { minWidth: '100%' } } }}
                            renderOption={({ option, checked }) => {
                                const { description } = option as ComboboxItem & {
                                    description?: null | string
                                }

                                return (
                                    <Group gap="xs" miw={0} wrap="nowrap" w="100%">
                                        <CheckIcon
                                            size={12}
                                            style={{
                                                flexShrink: 0,
                                                opacity: checked ? 1 : 0.25
                                            }}
                                        />
                                        <Stack flex={1} gap={0} miw={0}>
                                            <Text size="sm" truncate="end">
                                                {option.label}
                                            </Text>
                                            {description && (
                                                <Text c="dimmed" size="xs" truncate="end">
                                                    {description}
                                                </Text>
                                            )}
                                        </Stack>
                                    </Group>
                                )
                            }}
                            renderPill={({ option, value, onRemove }) => (
                                <TagInputPill onRemove={onRemove} value={option?.label ?? value} />
                            )}
                            searchable
                            styles={{
                                label: { fontWeight: 500 }
                            }}
                        />
                    </Stack>
                </SectionCard.Section>

                <SectionCard.Section>
                    <Stack gap="md">
                        <SelectInfraProviderShared
                            selectedInfraProviderUuid={form.getValues().fields.providerUuid}
                            setSelectedInfraProviderUuid={(providerUuid) => {
                                form.setFieldValue('fields.providerUuid', providerUuid)
                            }}
                        />

                        <TagsInput
                            clearable
                            data={tags?.tags || []}
                            key={form.key('fields.tags')}
                            label={t('use-nodes-table-widget.tags')}
                            leftSection={<PiTagDuotone size="16px" />}
                            maxTags={10}
                            placeholder="Enter tags (comma, space, semicolon)"
                            splitChars={[',', ' ', ';']}
                            {...form.getInputProps('fields.tags')}
                            error={
                                Object.keys(form.errors)
                                    .filter((key) => key.startsWith('fields.tags.'))
                                    .map((key) => form.errors[key])
                                    .join(', ') || form.getInputProps('fields.tags').error
                            }
                            renderPill={({ value, onRemove }) => (
                                <TagInputPill onRemove={onRemove} value={value} />
                            )}
                        />

                        <Textarea
                            key={form.key('fields.note')}
                            label={t('node-tracking-and-billing.card.note')}
                            resize="vertical"
                            {...form.getInputProps('fields.note')}
                            styles={{
                                label: { fontWeight: 500 }
                            }}
                        />
                    </Stack>
                </SectionCard.Section>

                <SectionCard.Section>
                    <Stack gap="md">
                        <NumberInput
                            allowDecimal
                            allowedDecimalSeparators={['.']}
                            allowNegative={false}
                            clampBehavior="strict"
                            decimalScale={1}
                            fixedDecimalScale
                            handlersRef={consumptionMultiplierRef}
                            hideControls
                            key={form.key('fields.consumptionMultiplier')}
                            leftSection={
                                <ActionIcon
                                    color="red"
                                    onClick={() => consumptionMultiplierRef.current?.decrement()}
                                    radius="md"
                                    size={rem(44)}
                                    variant="light"
                                >
                                    <TbMinus size={16} />
                                </ActionIcon>
                            }
                            leftSectionPointerEvents="all"
                            leftSectionProps={{
                                style: {
                                    overflow: 'hidden'
                                }
                            }}
                            leftSectionWidth={40}
                            max={100.0}
                            min={0}
                            rightSection={
                                <ActionIcon
                                    color="teal"
                                    onClick={() => consumptionMultiplierRef.current?.increment()}
                                    radius="md"
                                    size={rem(44)}
                                    variant="light"
                                >
                                    <TbPlus size={16} />
                                </ActionIcon>
                            }
                            rightSectionPointerEvents="all"
                            rightSectionProps={{
                                style: {
                                    overflow: 'hidden'
                                }
                            }}
                            rightSectionWidth={40}
                            step={0.1}
                            styles={{
                                input: {
                                    textAlign: 'center',
                                    fontWeight: 600
                                }
                            }}
                            {...form.getInputProps('fields.consumptionMultiplier')}
                            label={
                                <Group align="center" gap={3}>
                                    <HoverCard shadow="md" width={280} withArrow>
                                        <HoverCard.Target>
                                            <ActionIcon color="gray" size="xs" variant="subtle">
                                                <HiQuestionMarkCircle size={20} />
                                            </ActionIcon>
                                        </HoverCard.Target>
                                        <HoverCard.Dropdown>
                                            <Stack gap="sm">
                                                <Text c="dimmed" size="sm">
                                                    {t('base-node-form.consumption-m-line-1')}
                                                </Text>
                                                <Text c="dimmed" size="sm">
                                                    {t('base-node-form.consumption-m-line-2')}
                                                </Text>
                                            </Stack>
                                        </HoverCard.Dropdown>
                                    </HoverCard>
                                    <Text inherit>
                                        {t('node-consumption.card.user-consumption-multiplier')}
                                    </Text>
                                </Group>
                            }
                        />

                        <NumberInput
                            allowDecimal
                            allowedDecimalSeparators={['.']}
                            allowNegative={false}
                            clampBehavior="strict"
                            decimalScale={1}
                            fixedDecimalScale
                            handlersRef={nodeConsumptionMultiplierRef}
                            hideControls
                            key={form.key('fields.nodeConsumptionMultiplier')}
                            leftSection={
                                <ActionIcon
                                    color="red"
                                    onClick={() =>
                                        nodeConsumptionMultiplierRef.current?.decrement()
                                    }
                                    radius="md"
                                    size={rem(44)}
                                    variant="light"
                                >
                                    <TbMinus size={16} />
                                </ActionIcon>
                            }
                            leftSectionPointerEvents="all"
                            leftSectionProps={{
                                style: {
                                    overflow: 'hidden'
                                }
                            }}
                            leftSectionWidth={40}
                            max={100.0}
                            min={0}
                            rightSection={
                                <ActionIcon
                                    color="teal"
                                    onClick={() =>
                                        nodeConsumptionMultiplierRef.current?.increment()
                                    }
                                    radius="md"
                                    size={rem(44)}
                                    variant="light"
                                >
                                    <TbPlus size={16} />
                                </ActionIcon>
                            }
                            rightSectionPointerEvents="all"
                            rightSectionProps={{
                                style: {
                                    overflow: 'hidden'
                                }
                            }}
                            rightSectionWidth={40}
                            step={0.1}
                            styles={{
                                input: {
                                    textAlign: 'center',
                                    fontWeight: 600
                                }
                            }}
                            {...form.getInputProps('fields.nodeConsumptionMultiplier')}
                            label={
                                <Group align="center" gap={3}>
                                    <HoverCard shadow="md" width={280} withArrow>
                                        <HoverCard.Target>
                                            <ActionIcon color="gray" size="xs" variant="subtle">
                                                <HiQuestionMarkCircle size={20} />
                                            </ActionIcon>
                                        </HoverCard.Target>
                                        <HoverCard.Dropdown>
                                            <Stack gap="sm">
                                                <Text c="dimmed" size="sm">
                                                    {t(
                                                        'node-consumption.card.node-consumption-multiplier-1'
                                                    )}
                                                </Text>
                                                <Text c="dimmed" size="sm">
                                                    {t(
                                                        'node-consumption.card.node-consumption-multiplier-2'
                                                    )}
                                                </Text>
                                            </Stack>
                                        </HoverCard.Dropdown>
                                    </HoverCard>
                                    <Text inherit>
                                        {t('node-consumption.card.node-consumption-multiplier')}
                                    </Text>
                                </Group>
                            }
                        />
                    </Stack>
                </SectionCard.Section>

                <SectionCard.Section>
                    <Group justify="flex-end">
                        <Button
                            color="teal"
                            leftSection={<TbCheck size={16} />}
                            onClick={handleUpdate}
                            size="md"
                            variant="light"
                        >
                            {t('common.update')}
                        </Button>
                    </Group>
                </SectionCard.Section>
            </SectionCard.Root>
        </Stack>
    )
}
