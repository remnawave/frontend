import {
    GetExternalSquadByUuidCommand,
    SUBSCRIPTION_TEMPLATE_TYPE,
    TSubscriptionTemplateType
} from '@remnawave/backend-contract'
import { Button, Paper, Select, Stack, Text } from '@mantine/core'
import { useEffect, useMemo, useState } from 'react'
import { TbDeviceFloppy } from 'react-icons/tb'
import { useTranslation } from 'react-i18next'

import { useGetSubscriptionTemplates } from '@shared/api/hooks/subscription-template/subscription-template.query.hooks'
import { externalSquadsQueryKeys, useUpdateExternalSquad } from '@shared/api/hooks'
import { MihomoLogo, SingboxLogo, StashLogo, XrayLogo } from '@shared/ui/logos'
import { queryClient } from '@shared/api'

interface IProps {
    externalSquad: GetExternalSquadByUuidCommand.Response['response']
    isOpen: boolean
}

export const ExternalSquadsTemplatesTabWidget = (props: IProps) => {
    const { externalSquad, isOpen } = props

    const { t } = useTranslation()

    const { data: templatesData } = useGetSubscriptionTemplates()

    const availableTemplateTypes = [
        SUBSCRIPTION_TEMPLATE_TYPE.XRAY_JSON,
        SUBSCRIPTION_TEMPLATE_TYPE.MIHOMO,
        SUBSCRIPTION_TEMPLATE_TYPE.STASH,
        SUBSCRIPTION_TEMPLATE_TYPE.SINGBOX,
        SUBSCRIPTION_TEMPLATE_TYPE.CLASH
    ]

    const [selectedTemplates, setSelectedTemplates] = useState<
        Record<TSubscriptionTemplateType, null | string>
    >({
        [SUBSCRIPTION_TEMPLATE_TYPE.CLASH]: null,
        [SUBSCRIPTION_TEMPLATE_TYPE.MIHOMO]: null,
        [SUBSCRIPTION_TEMPLATE_TYPE.SINGBOX]: null,
        [SUBSCRIPTION_TEMPLATE_TYPE.STASH]: null,
        [SUBSCRIPTION_TEMPLATE_TYPE.XRAY_BASE64]: null,
        [SUBSCRIPTION_TEMPLATE_TYPE.XRAY_JSON]: null
    })

    const groupedTemplates = useMemo(() => {
        if (!templatesData?.templates) {
            return {} as Record<
                TSubscriptionTemplateType,
                Array<{ name: string; templateType: TSubscriptionTemplateType; uuid: string }>
            >
        }

        return templatesData.templates.reduce(
            (acc, template) => {
                if (!acc[template.templateType]) {
                    acc[template.templateType] = []
                }
                acc[template.templateType].push(template)
                return acc
            },
            {} as Record<
                TSubscriptionTemplateType,
                Array<{ name: string; templateType: TSubscriptionTemplateType; uuid: string }>
            >
        )
    }, [templatesData?.templates])

    useEffect(() => {
        if (isOpen && externalSquad) {
            const initialTemplates: Record<TSubscriptionTemplateType, null | string> = {
                [SUBSCRIPTION_TEMPLATE_TYPE.CLASH]: null,
                [SUBSCRIPTION_TEMPLATE_TYPE.MIHOMO]: null,
                [SUBSCRIPTION_TEMPLATE_TYPE.SINGBOX]: null,
                [SUBSCRIPTION_TEMPLATE_TYPE.STASH]: null,
                [SUBSCRIPTION_TEMPLATE_TYPE.XRAY_BASE64]: null,
                [SUBSCRIPTION_TEMPLATE_TYPE.XRAY_JSON]: null
            }

            if (externalSquad.templates && Array.isArray(externalSquad.templates)) {
                externalSquad.templates.forEach((template) => {
                    initialTemplates[template.templateType] = template.templateUuid
                })
            }

            setSelectedTemplates(initialTemplates)
        }
    }, [isOpen, externalSquad])

    const { mutate: updateExternalSquad, isPending: isUpdatingExternalSquad } =
        useUpdateExternalSquad({
            mutationFns: {
                onSuccess: () => {
                    queryClient.refetchQueries({
                        queryKey: externalSquadsQueryKeys.getExternalSquads.queryKey
                    })
                }
            }
        })

    const handleUpdateExternalSquad = () => {
        if (!externalSquad?.uuid) return

        const templates = Object.entries(selectedTemplates)
            .filter(([, templateUuid]) => templateUuid !== null)
            .map(([templateType, templateUuid]) => ({
                templateType: templateType as TSubscriptionTemplateType,
                templateUuid: templateUuid as string
            }))

        updateExternalSquad({
            variables: {
                templates: templates.length > 0 ? templates : undefined,
                uuid: externalSquad.uuid
            }
        })
    }

    const handleTemplateChange = (
        templateType: TSubscriptionTemplateType,
        value: null | string
    ) => {
        setSelectedTemplates((prev) => ({
            ...prev,
            [templateType]: value
        }))
    }

    const getTemplateTypeLogo = (type: TSubscriptionTemplateType) => {
        switch (type) {
            case SUBSCRIPTION_TEMPLATE_TYPE.CLASH:
                return <MihomoLogo size={16} />
            case SUBSCRIPTION_TEMPLATE_TYPE.MIHOMO:
                return <MihomoLogo size={16} />
            case SUBSCRIPTION_TEMPLATE_TYPE.SINGBOX:
                return <SingboxLogo size={16} />
            case SUBSCRIPTION_TEMPLATE_TYPE.STASH:
                return <StashLogo size={16} />
            case SUBSCRIPTION_TEMPLATE_TYPE.XRAY_BASE64:
            case SUBSCRIPTION_TEMPLATE_TYPE.XRAY_JSON:
                return <XrayLogo size={16} />
            default:
                return null
        }
    }

    const getTemplateTypeLabel = (type: TSubscriptionTemplateType) => {
        switch (type) {
            case SUBSCRIPTION_TEMPLATE_TYPE.CLASH:
                return 'Clash'
            case SUBSCRIPTION_TEMPLATE_TYPE.MIHOMO:
                return 'Mihomo'
            case SUBSCRIPTION_TEMPLATE_TYPE.SINGBOX:
                return 'Sing-box'
            case SUBSCRIPTION_TEMPLATE_TYPE.STASH:
                return 'Stash'
            case SUBSCRIPTION_TEMPLATE_TYPE.XRAY_BASE64:
                return 'Xray Base64'
            case SUBSCRIPTION_TEMPLATE_TYPE.XRAY_JSON:
                return 'Xray JSON'
            default:
                return type
        }
    }

    return (
        <Paper bg="dark.6" p="md" shadow="sm" withBorder>
            <Stack gap="md">
                <Text fw={600} size="md">
                    {t('external-squads.drawer.widget.subscription-templates')}
                </Text>
                <Text c="dimmed" size="sm">
                    {t('external-squads.drawer.widget.subscription-templates-description-line-1')}
                    <br />
                    {t('external-squads.drawer.widget.subscription-templates-description-line-2')}
                </Text>

                <Stack gap="sm">
                    {availableTemplateTypes.map((templateType) => {
                        const templates = groupedTemplates[templateType] || []

                        const nonDefaultTemplates = templates.filter(
                            (template: { name: string }) =>
                                template.name.toLowerCase() !== 'default'
                        )
                        const hasTemplates = nonDefaultTemplates.length > 0

                        return (
                            <Select
                                clearable
                                data={nonDefaultTemplates.map(
                                    (template: { name: string; uuid: string }) => ({
                                        label: template.name,
                                        value: template.uuid
                                    })
                                )}
                                disabled={!hasTemplates}
                                key={templateType}
                                label={getTemplateTypeLabel(templateType)}
                                leftSection={getTemplateTypeLogo(templateType)}
                                onChange={(value) => handleTemplateChange(templateType, value)}
                                placeholder={
                                    hasTemplates
                                        ? t('external-squads.drawer.widget.select-a-template')
                                        : t('external-squads.drawer.widget.default-template-in-use')
                                }
                                value={selectedTemplates[templateType]}
                            />
                        )
                    })}
                </Stack>

                <Button
                    color="teal"
                    fullWidth
                    leftSection={<TbDeviceFloppy size="1.2rem" />}
                    loading={isUpdatingExternalSquad}
                    mt="md"
                    onClick={handleUpdateExternalSquad}
                    size="md"
                    style={{
                        transition: 'all 0.2s ease'
                    }}
                    variant="light"
                >
                    {t('common.save')}
                </Button>
            </Stack>
        </Paper>
    )
}
