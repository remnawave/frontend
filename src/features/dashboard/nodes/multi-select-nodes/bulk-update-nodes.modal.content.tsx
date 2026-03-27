import {
    ActionIcon,
    Button,
    Group,
    HoverCard,
    NumberInput,
    NumberInputHandlers,
    rem,
    Select,
    Stack,
    TagsInput,
    Text
} from '@mantine/core'
import { BulkNodesUpdateCommand, GetAllNodesCommand } from '@remnawave/backend-contract'
import { TbCheck, TbMapPin, TbMinus, TbPackage, TbPlus } from 'react-icons/tb'
import { zodResolver } from 'mantine-form-zod-resolver'
import { HiQuestionMarkCircle } from 'react-icons/hi'
import { useTranslation } from 'react-i18next'
import { PiTagDuotone } from 'react-icons/pi'
import { modals } from '@mantine/modals'
import { useForm } from '@mantine/form'
import { motion } from 'motion/react'
import { useRef } from 'react'

import { SelectInfraProviderShared } from '@shared/ui/infra-billing/select-infra-provider/select-infra-provider.shared'
import {
    QueryKeys,
    useBulkNodesUpdate,
    useGetNodePlugins,
    useGetNodesTags
} from '@shared/api/hooks'
import { COUNTRIES } from '@shared/ui/forms/nodes/base-node-form/constants'
import { LoaderModalShared } from '@shared/ui/loader-modal'
import { queryClient } from '@shared/api/query-client'
import { SectionCard } from '@shared/ui/section-card'

type NodeType = GetAllNodesCommand.Response['response'][number]

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
    const handlersRef = useRef<NumberInputHandlers>(null)

    const uuids = selectedRecords.map((node) => node.uuid)

    const form = useForm<BulkNodesUpdateCommand.Request>({
        name: 'bulk-update-nodes-form',
        mode: 'uncontrolled',
        validate: zodResolver(BulkNodesUpdateCommand.RequestSchema),
        initialValues: {
            uuids,
            fields: {
                tags: undefined,
                countryCode: undefined,
                consumptionMultiplier: undefined,
                providerUuid: undefined,
                activePluginUuid: undefined
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

    if (isNodePluginsLoading || isTagsLoading || !nodePlugins) {
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
                            label="Tags"
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
                            handlersRef={handlersRef}
                            hideControls
                            key={form.key('fields.consumptionMultiplier')}
                            leftSection={
                                <ActionIcon
                                    color="red"
                                    onClick={() => handlersRef.current?.decrement()}
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
                                    onClick={() => handlersRef.current?.increment()}
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
                                        {t('base-node-form.consumption-multiplier')}
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
