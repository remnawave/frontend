import { Button, Card, Select, Stack, Text } from '@mantine/core'
import { GetExternalSquadByUuidCommand } from '@remnawave/backend-contract'
import { IconPalette } from '@tabler/icons-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TbDeviceFloppy } from 'react-icons/tb'

import { queryClient } from '@shared/api'
import { QueryKeys, useGetSubpageConfigs, useUpdateExternalSquad } from '@shared/api/hooks'

interface IProps {
    externalSquad: GetExternalSquadByUuidCommand.Response['response']
}

export const ExternalSquadsSubpageConfigTabWidget = (props: IProps) => {
    const { externalSquad } = props
    const { t } = useTranslation()

    const { data: subpageConfigs } = useGetSubpageConfigs()

    const [selectedConfigUuid, setSelectedConfigUuid] = useState<null | string>(
        externalSquad.subpageConfigUuid || null
    )

    const { mutate: updateExternalSquad, isPending: isUpdatingExternalSquad } =
        useUpdateExternalSquad({
            mutationFns: {
                onSuccess: (data) => {
                    queryClient.setQueryData(
                        QueryKeys.externalSquads.getExternalSquad({
                            uuid: data.uuid
                        }).queryKey,
                        data
                    )
                }
            }
        })

    const handleSave = () => {
        if (!externalSquad?.uuid) return

        updateExternalSquad({
            variables: {
                subpageConfigUuid: selectedConfigUuid,
                uuid: externalSquad.uuid
            }
        })
    }

    const configOptions =
        subpageConfigs?.configs.map((config) => ({
            label: config.name,
            value: config.uuid
        })) || []

    return (
        <Card p="md" withBorder>
            <Stack gap="md">
                <Text fw={600} size="md">
                    {t('external-squads-subpage-config.tab.widget.subscription-page-config')}
                </Text>
                <Text c="dimmed" size="sm">
                    {t(
                        'external-squads-subpage-config.tab.widget.subscription-page-config-description'
                    )}
                </Text>

                <Select
                    clearable
                    data={configOptions}
                    label={t('external-squads-subpage-config.tab.widget.subpage-config')}
                    leftSection={<IconPalette size={16} />}
                    onChange={setSelectedConfigUuid}
                    placeholder={t('external-squads-subpage-config.tab.widget.select-config')}
                    value={selectedConfigUuid}
                />

                <Button
                    color="teal"
                    fullWidth
                    leftSection={<TbDeviceFloppy size="1.2rem" />}
                    loading={isUpdatingExternalSquad}
                    onClick={handleSave}
                    size="md"
                    variant="soft"
                >
                    {t('common.save')}
                </Button>
            </Stack>
        </Card>
    )
}
