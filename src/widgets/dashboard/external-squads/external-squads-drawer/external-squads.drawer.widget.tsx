/* eslint-disable @stylistic/indent */
import {
    ActionIcon,
    Badge,
    Box,
    Button,
    CopyButton,
    Drawer,
    Group,
    Paper,
    Select,
    Stack,
    Text,
    Tooltip
} from '@mantine/core'
import { SUBSCRIPTION_TEMPLATE_TYPE, TSubscriptionTemplateType } from '@remnawave/backend-contract'
import { TbDeviceFloppy, TbWebhook } from 'react-icons/tb'
import { PiCheck, PiCopy, PiUsers } from 'react-icons/pi'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
    externalSquadsQueryKeys,
    useGetSubscriptionTemplates,
    useUpdateExternalSquad
} from '@shared/api/hooks'
import { MihomoLogo, SingboxLogo, StashLogo, XrayLogo } from '@shared/ui/logos'
import { MODALS, useModalsStore } from '@entities/dashboard/modal-store'
import { LoaderModalShared } from '@shared/ui/loader-modal'
import { queryClient } from '@shared/api/query-client'
import { formatInt } from '@shared/utils/misc'

import classes from './external-squads.module.css'

export const ExternalSquadsDrawer = () => {
    const { t } = useTranslation()

    const { isOpen, internalState: externalSquad } = useModalsStore(
        (state) => state.modals[MODALS.EXTERNAL_SQUAD_DRAWER]
    )
    const { close } = useModalsStore()

    const { data: templatesData, isLoading: isTemplatesLoading } = useGetSubscriptionTemplates()

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
                    close(MODALS.EXTERNAL_SQUAD_DRAWER)
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

    const renderDrawerContent = () => {
        if (!externalSquad) return null

        const isActive = externalSquad.info.membersCount > 0

        return (
            <Stack gap="md" h="100%">
                <Paper
                    p="md"
                    shadow="sm"
                    style={{
                        background:
                            'linear-gradient(135deg, var(--mantine-color-dark-6) 0%, var(--mantine-color-dark-7) 100%)',
                        border: '1px solid var(--mantine-color-dark-4)'
                    }}
                    withBorder
                >
                    <Stack gap="md">
                        <Stack gap="md">
                            <Group gap="md" wrap="nowrap">
                                <Box className={classes.iconWrapper}>
                                    <ActionIcon
                                        bg={isActive ? '' : 'dark.6'}
                                        className={classes.icon}
                                        color={isActive ? 'teal' : 'gray'}
                                        size="xl"
                                        variant={isActive ? 'light' : 'subtle'}
                                    >
                                        <TbWebhook size={28} />
                                    </ActionIcon>
                                </Box>

                                <Stack gap={6} style={{ flex: 1, minWidth: 0 }}>
                                    <Text
                                        className={classes.title}
                                        ff="monospace"
                                        fw={700}
                                        lineClamp={2}
                                        size="lg"
                                        title={externalSquad.name}
                                    >
                                        {externalSquad.name}
                                    </Text>
                                    <Group gap="xs" justify="left" wrap="nowrap">
                                        <Tooltip label={t('external-squad-card.widget.users')}>
                                            <Badge
                                                color={isActive ? 'teal' : 'gray'}
                                                leftSection={<PiUsers size={12} />}
                                                size="lg"
                                                variant="light"
                                            >
                                                {formatInt(externalSquad.info.membersCount, {
                                                    thousandSeparator: ','
                                                })}
                                            </Badge>
                                        </Tooltip>
                                        <CopyButton timeout={2000} value={externalSquad.uuid}>
                                            {({ copied, copy }) => (
                                                <ActionIcon
                                                    color={copied ? 'teal' : 'gray'}
                                                    onClick={copy}
                                                    size="lg"
                                                    style={{ flexShrink: 0 }}
                                                    variant="subtle"
                                                >
                                                    {copied ? (
                                                        <PiCheck size="18px" />
                                                    ) : (
                                                        <PiCopy size="18px" />
                                                    )}
                                                </ActionIcon>
                                            )}
                                        </CopyButton>
                                    </Group>
                                </Stack>
                            </Group>
                        </Stack>
                    </Stack>
                </Paper>

                <Paper bg="dark.6" p="md" shadow="sm" withBorder>
                    <Stack gap="md">
                        <Text fw={600} size="md">
                            {t('external-squads.drawer.widget.subscription-templates')}
                        </Text>
                        <Text c="dimmed" size="sm">
                            {t(
                                'external-squads.drawer.widget.subscription-templates-description-line-1'
                            )}
                            <br />
                            {t(
                                'external-squads.drawer.widget.subscription-templates-description-line-2'
                            )}
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
                                        onChange={(value) =>
                                            handleTemplateChange(templateType, value)
                                        }
                                        placeholder={
                                            hasTemplates
                                                ? t(
                                                      'external-squads.drawer.widget.select-a-template'
                                                  )
                                                : t(
                                                      'external-squads.drawer.widget.default-template-in-use'
                                                  )
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
                            {t('external-squads.drawer.widget.save')}
                        </Button>
                    </Stack>
                </Paper>
            </Stack>
        )
    }

    const isLoading = isTemplatesLoading || !externalSquad

    return (
        <Drawer
            keepMounted={true}
            onClose={() => close(MODALS.EXTERNAL_SQUAD_DRAWER)}
            opened={isOpen}
            overlayProps={{ backgroundOpacity: 0.6, blur: 0 }}
            padding="md"
            position="right"
            size="480px"
            title={t('external-squads.drawer.widget.edit-external-squad')}
        >
            {isLoading ? (
                <LoaderModalShared h="80vh" text="Loading..." w="100%" />
            ) : (
                renderDrawerContent()
            )}
        </Drawer>
    )
}
