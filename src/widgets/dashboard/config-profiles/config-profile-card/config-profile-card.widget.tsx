import { Badge, Box, CopyButton, Divider, Group, Loader, Menu, Text, Tooltip } from '@mantine/core'
import { PiCheck, PiCopy, PiCpu, PiPencil, PiTag, PiTrashDuotone } from 'react-icons/pi'
import { TbCheck, TbCpu2, TbDownload, TbEdit, TbEye } from 'react-icons/tb'
import { GetConfigProfilesCommand } from '@remnawave/backend-contract'
import { githubDarkTheme, JsonEditor } from 'json-edit-react'
import { generatePath, useNavigate } from 'react-router-dom'
import { notifications } from '@mantine/notifications'
import { useTranslation } from 'react-i18next'
import { modals } from '@mantine/modals'

import { useGetComputedConfigProfile } from '@shared/api/hooks/config-profiles/config-profiles.query.hooks'
import { MODALS, useModalsStoreOpenWithData } from '@entities/dashboard/modal-store'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { WithDndSortable } from '@shared/hocs/with-dnd-sortable'
import { EntityCardShared } from '@shared/ui/entity-card'
import { formatInt } from '@shared/utils/misc'
import { XrayLogo } from '@shared/ui/logos'
import { ROUTES } from '@shared/constants'

interface IProps {
    configProfile: GetConfigProfilesCommand.Response['response']['configProfiles'][number]
    handleDeleteConfigProfile: (configProfileUuid: string) => void
    isDragOverlay?: boolean
}

export function ConfigProfileCardWidget(props: IProps) {
    const { configProfile, handleDeleteConfigProfile, isDragOverlay = false } = props
    const { t } = useTranslation()

    const openModalWithData = useModalsStoreOpenWithData()

    const navigate = useNavigate()

    const nodesCount = configProfile.nodes.length
    const inboundsCount = configProfile.inbounds.length
    const isActive = nodesCount > 0

    const handleEditConfigProfile = () => {
        navigate(
            generatePath(ROUTES.DASHBOARD.MANAGEMENT.CONFIG_PROFILE_BY_UUID, {
                uuid: configProfile.uuid
            })
        )
    }

    const { refetch: refetchComputedConfigProfile, isLoading: isLoadingComputedConfigProfile } =
        useGetComputedConfigProfile({
            route: {
                uuid: configProfile.uuid
            }
        })

    const handleViewComputedConfigProfile = async () => {
        notifications.show({
            id: 'view-computed-config-profile',
            loading: true,
            title: t('common.loading'),
            message: t('config-profile-card.widget.loading-computed-config-profile'),
            autoClose: false,
            withCloseButton: false
        })

        const computedConfigProfile = await refetchComputedConfigProfile()

        if (computedConfigProfile && computedConfigProfile.data) {
            notifications.update({
                id: 'view-computed-config-profile',
                loading: false,
                title: t('common.success'),
                message: t(
                    'config-profile-card.widget.computed-config-profile-loaded-successfully'
                ),
                icon: <TbCheck size={18} />,
                autoClose: 3000
            })

            modals.openConfirmModal({
                children: (
                    <>
                        <Text size="sm">
                            {t(
                                'config-profile-card.widget.the-computed-config-profile-description'
                            )}
                        </Text>
                        <Divider my="md" />
                        <JsonEditor
                            data={computedConfigProfile.data.config as object}
                            indent={4}
                            maxWidth="100%"
                            rootName=""
                            theme={githubDarkTheme}
                            viewOnly
                        />
                    </>
                ),
                cancelProps: {
                    variant: 'subtle',
                    color: 'gray'
                },
                confirmProps: {
                    color: 'teal'
                },
                labels: {
                    confirm: t('common.download'),
                    cancel: t('common.cancel')
                },
                size: 'xl',
                title: (
                    <BaseOverlayHeader
                        IconComponent={TbEye}
                        iconVariant="gradient-teal"
                        title={computedConfigProfile.data.name}
                        titleOrder={5}
                    />
                ),
                onConfirm: () => {
                    const jsonString = JSON.stringify(computedConfigProfile.data.config, null, 2)
                    const blob = new Blob([jsonString], {
                        type: 'application/json'
                    })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = `${computedConfigProfile.data.name}.json`
                    document.body.appendChild(a)
                    a.click()
                    document.body.removeChild(a)
                    URL.revokeObjectURL(url)
                }
            })
        }
    }

    return (
        <WithDndSortable
            dragHandlePosition="top-right"
            id={configProfile.uuid}
            isDragOverlay={isDragOverlay}
        >
            <EntityCardShared.Root withTopAccent={isActive}>
                <EntityCardShared.Header>
                    <EntityCardShared.Icon highlight={isActive} onClick={handleEditConfigProfile}>
                        <XrayLogo size={28} />
                    </EntityCardShared.Icon>
                    <EntityCardShared.Content title={configProfile.name}>
                        <Group gap="xs" wrap="nowrap">
                            <Tooltip label={t('config-profiles-grid.widget.inbounds')}>
                                <Badge
                                    color="blue"
                                    leftSection={<PiTag size={12} />}
                                    onClick={() => {
                                        openModalWithData(
                                            MODALS.CONFIG_PROFILE_SHOW_INBOUNDS_DRAWER,
                                            configProfile
                                        )
                                    }}
                                    size="lg"
                                    style={{ cursor: 'pointer' }}
                                    variant="light"
                                >
                                    {formatInt(inboundsCount, {
                                        thousandSeparator: ','
                                    })}
                                </Badge>
                            </Tooltip>

                            <Tooltip label={t('config-profiles-grid.widget.nodes')}>
                                <Badge
                                    color={isActive ? 'teal' : 'gray'}
                                    leftSection={<PiCpu size={12} />}
                                    onClick={() => {
                                        openModalWithData(
                                            MODALS.CONFIG_PROFILES_SHOW_ACTIVE_NODE,
                                            configProfile.nodes
                                        )
                                    }}
                                    size="lg"
                                    style={{
                                        cursor: 'pointer'
                                    }}
                                    variant="light"
                                >
                                    {formatInt(nodesCount, {
                                        thousandSeparator: ','
                                    })}
                                </Badge>
                            </Tooltip>
                        </Group>
                    </EntityCardShared.Content>
                </EntityCardShared.Header>

                <EntityCardShared.Actions>
                    <EntityCardShared.Button
                        leftSection={<TbEdit size={16} />}
                        onClick={handleEditConfigProfile}
                    >
                        {t('config-profiles-grid.widget.xray-config')}
                    </EntityCardShared.Button>
                    <EntityCardShared.Menu>
                        <Menu.Item
                            leftSection={<TbEye size={18} />}
                            onClick={(e) => {
                                e.stopPropagation()
                                modals.open({
                                    children: (
                                        <Box>
                                            <JsonEditor
                                                collapse={3}
                                                data={configProfile.config as object}
                                                indent={4}
                                                maxWidth="100%"
                                                rootName=""
                                                theme={githubDarkTheme}
                                                viewOnly
                                            />
                                        </Box>
                                    ),
                                    title: (
                                        <BaseOverlayHeader
                                            IconComponent={TbEye}
                                            iconVariant="gradient-teal"
                                            title={configProfile.name}
                                            titleOrder={5}
                                        />
                                    ),
                                    size: 'xl'
                                })
                            }}
                        >
                            {t('config-profiles-grid.widget.quick-view')}
                        </Menu.Item>

                        <Menu.Item
                            leftSection={
                                isLoadingComputedConfigProfile ? (
                                    <Loader size={18} />
                                ) : (
                                    <TbCpu2 size={18} />
                                )
                            }
                            onClick={(e) => {
                                e.stopPropagation()
                                handleViewComputedConfigProfile()
                            }}
                        >
                            {t('config-profile-card.widget.view-computed')}
                        </Menu.Item>

                        <Menu.Item
                            leftSection={<TbDownload size={18} />}
                            onClick={(e) => {
                                e.stopPropagation()
                                const jsonString = JSON.stringify(configProfile.config, null, 2)
                                const blob = new Blob([jsonString], {
                                    type: 'application/json'
                                })
                                const url = URL.createObjectURL(blob)
                                const a = document.createElement('a')
                                a.href = url
                                a.download = `${configProfile.name}.json`
                                document.body.appendChild(a)
                                a.click()
                                document.body.removeChild(a)
                                URL.revokeObjectURL(url)
                            }}
                        >
                            {t('config-profiles-grid.widget.download')}
                        </Menu.Item>

                        <CopyButton timeout={2000} value={configProfile.uuid}>
                            {({ copied, copy }) => (
                                <Menu.Item
                                    color={copied ? 'teal' : undefined}
                                    leftSection={
                                        copied ? <PiCheck size={18} /> : <PiCopy size={18} />
                                    }
                                    onClick={copy}
                                >
                                    {t('common.copy-uuid')}
                                </Menu.Item>
                            )}
                        </CopyButton>

                        <Menu.Item
                            leftSection={<PiPencil size={18} />}
                            onClick={() => {
                                openModalWithData(MODALS.RENAME_SQUAD_OR_CONFIG_PROFILE_MODAL, {
                                    name: configProfile.name,
                                    uuid: configProfile.uuid
                                })
                            }}
                        >
                            {t('common.rename')}
                        </Menu.Item>

                        <Menu.Item
                            color="red"
                            leftSection={<PiTrashDuotone size={18} />}
                            onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteConfigProfile(configProfile.uuid)
                            }}
                        >
                            {t('config-profiles-grid.widget.delete-profile')}
                        </Menu.Item>
                    </EntityCardShared.Menu>
                </EntityCardShared.Actions>
            </EntityCardShared.Root>
        </WithDndSortable>
    )
}
