import NiceModal, { useModal } from '@ebay/nice-modal-react'
import {
    ActionIcon,
    Group,
    Menu,
    ScrollArea,
    SegmentedControl,
    Select,
    Stack,
    Text,
    TextInput,
    ThemeIcon
} from '@mantine/core'
import { ComponentType, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TbBolt, TbChevronDown, TbChevronUp, TbDeviceFloppy, TbPlus, TbTrash } from 'react-icons/tb'

import { useNiceMantineModal } from '@shared/_modals/use-nice-modal'
import { CompoundModalShared } from '@shared/ui/compound-modal/compound-modal.shared'
import { EmptyPageLayout } from '@shared/ui/layouts/empty-page'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import type {
    IQuickLauncherRoute,
    TQuickIconName,
    TQuickLink,
    TQuickModalId
} from '@shared/ui/quick-launcher'
import {
    DEFAULT_QUICK_ICON,
    isSafeExternalUrl,
    MAX_QUICK_LINKS,
    QUICK_ICON_NAMES,
    QUICK_ICONS,
    QUICK_MODAL_IDS,
    QUICK_MODALS
} from '@shared/ui/quick-launcher'
import { SectionCard } from '@shared/ui/section-card'

import {
    useExperimentalFeatures,
    useQuickLinks,
    useViewPreferencesStoreActions
} from '@entities/dashboard/view-preferences-store'

const BODY_HEIGHT = 420

type TAddKind = 'external' | 'modal' | 'route'

interface IProps {
    routes: IQuickLauncherRoute[]
}

interface IRow {
    description: string
    Icon: ComponentType<{ size?: number }>
    index: number
    key: string
    label: string
}

export const QuickLinksModalShared = NiceModal.create((props: IProps) => {
    const { routes } = props

    const { t } = useTranslation()
    const modal = useModal()
    const { modalProps, hide } = useNiceMantineModal({ modal })

    const storedLinks = useQuickLinks()
    const experimental = useExperimentalFeatures()
    const { setQuickLinks } = useViewPreferencesStoreActions()

    const [links, setLinks] = useState<TQuickLink[]>(storedLinks)
    const [addKind, setAddKind] = useState<TAddKind>('modal')
    const [modalId, setModalId] = useState<null | TQuickModalId>(null)
    const [routePath, setRoutePath] = useState<null | string>(null)
    const [externalLabel, setExternalLabel] = useState('')
    const [externalUrl, setExternalUrl] = useState('')
    const [externalIcon, setExternalIcon] = useState<TQuickIconName>(DEFAULT_QUICK_ICON)

    const routeCatalog = useMemo(
        () => new Map(routes.map((route) => [route.href, route])),
        [routes]
    )

    const isFull = links.length >= MAX_QUICK_LINKS

    const modalOptions = useMemo(
        () =>
            QUICK_MODAL_IDS.filter((id) => {
                const entry = QUICK_MODALS[id]
                if (entry.experimental && !experimental[entry.experimental]) return false

                return !links.some((link) => link.kind === 'modal' && link.id === id)
            }).map((id) => ({ label: t(QUICK_MODALS[id].labelKey), value: id })),
        [links, experimental, t]
    )

    const routeOptions = useMemo(
        () =>
            routes
                .filter(
                    (route) =>
                        !links.some((link) => link.kind === 'route' && link.path === route.href)
                )
                .map((route) => ({ label: route.name, value: route.href })),
        [routes, links]
    )

    const rows = useMemo<IRow[]>(() => {
        const out: IRow[] = []

        links.forEach((link, index) => {
            if (link.kind === 'modal') {
                const entry = QUICK_MODALS[link.id]
                if (entry.experimental && !experimental[entry.experimental]) return

                out.push({
                    description: 'Modals',
                    Icon: entry.Icon,
                    index,
                    key: `modal-${link.id}-${index}`,
                    label: t(entry.labelKey)
                })

                return
            }

            if (link.kind === 'route') {
                const entry = routeCatalog.get(link.path)

                out.push({
                    description: link.path,
                    Icon: entry?.icon ?? TbBolt,
                    index,
                    key: `route-${link.path}`,
                    label: entry?.name ?? link.path
                })

                return
            }

            out.push({
                description: link.url,
                Icon: QUICK_ICONS[link.icon],
                index,
                key: `external-${index}-${link.url}`,
                label: link.label
            })
        })

        return out
    }, [links, routeCatalog, experimental, t])

    const move = (row: number, delta: number) => {
        const target = rows[row + delta]
        if (!target) return

        const next = [...links]
        const [moved] = next.splice(rows[row].index, 1)
        next.splice(target.index, 0, moved)

        setLinks(next)
    }

    const remove = (index: number) => setLinks(links.filter((_, i) => i !== index))

    const switchKind = (next: TAddKind) => {
        setAddKind(next)
        setModalId(null)
        setRoutePath(null)
        setExternalLabel('')
        setExternalUrl('')
        setExternalIcon(DEFAULT_QUICK_ICON)
    }

    const isExternal = addKind === 'external'
    const isUrlValid = externalUrl.length === 0 || isSafeExternalUrl(externalUrl)
    const isDuplicateUrl = links.some(
        (link) => link.kind === 'external' && link.url === externalUrl
    )

    const selectedModal = modalId ? QUICK_MODALS[modalId] : null
    const selectedRoute = routePath ? routeCatalog.get(routePath) : null

    const PreviewIcon = isExternal
        ? QUICK_ICONS[externalIcon]
        : (selectedModal?.Icon ?? selectedRoute?.icon ?? QUICK_ICONS[DEFAULT_QUICK_ICON])

    const previewLabel = isExternal
        ? externalLabel
        : ((selectedModal ? t(selectedModal.labelKey) : selectedRoute?.name) ?? '')

    const canAdd =
        !isFull &&
        (isExternal
            ? externalLabel.trim().length > 0 && isSafeExternalUrl(externalUrl) && !isDuplicateUrl
            : Boolean(addKind === 'modal' ? modalId : routePath))

    const add = () => {
        if (!canAdd) return

        if (addKind === 'modal' && modalId) {
            setLinks([...links, { id: modalId, kind: 'modal' }])
            setModalId(null)

            return
        }

        if (addKind === 'route' && routePath) {
            setLinks([...links, { kind: 'route', path: routePath }])
            setRoutePath(null)

            return
        }

        setLinks([
            ...links,
            { icon: externalIcon, kind: 'external', label: externalLabel.trim(), url: externalUrl }
        ])
        setExternalLabel('')
        setExternalUrl('')
        setExternalIcon(DEFAULT_QUICK_ICON)
    }

    return (
        <CompoundModalShared
            buttons={
                <ActionIcon
                    color="teal"
                    onClick={() => {
                        setQuickLinks(links)
                        hide()
                    }}
                    size="lg"
                    variant="soft"
                >
                    <TbDeviceFloppy size="20px" />
                </ActionIcon>
            }
            modalProps={modalProps}
            title={
                <BaseOverlayHeader
                    iconColor="cyan"
                    IconComponent={TbBolt}
                    iconVariant="soft"
                    title={t('constants.quick-launcher')}
                />
            }
        >
            <Stack gap="md" h={BODY_HEIGHT}>
                <SectionCard.Root>
                    <SectionCard.Section>
                        <Stack gap="sm">
                            <SegmentedControl
                                data={[
                                    { label: 'Modals', value: 'modal' },
                                    { label: 'Routes', value: 'route' },
                                    { label: 'External', value: 'external' }
                                ]}
                                fullWidth
                                onChange={(value) => switchKind(value as TAddKind)}
                                value={addKind}
                            />

                            <Group gap="xs" wrap="nowrap">
                                <Menu position="bottom-start" shadow="md" width={272}>
                                    <Menu.Target>
                                        <ActionIcon
                                            color="gray"
                                            disabled={!isExternal}
                                            size="input-sm"
                                            variant="default"
                                        >
                                            <PreviewIcon size={18} />
                                        </ActionIcon>
                                    </Menu.Target>

                                    <Menu.Dropdown>
                                        <ScrollArea h={148} scrollbars="y" type="auto">
                                            <Group gap={4} pr={6}>
                                                {QUICK_ICON_NAMES.map((name) => {
                                                    const Icon = QUICK_ICONS[name]
                                                    const isPicked = externalIcon === name

                                                    return (
                                                        <ActionIcon
                                                            color={isPicked ? 'cyan' : 'gray'}
                                                            key={name}
                                                            onClick={() => setExternalIcon(name)}
                                                            size="lg"
                                                            variant={isPicked ? 'soft' : 'subtle'}
                                                        >
                                                            <Icon size={18} />
                                                        </ActionIcon>
                                                    )
                                                })}
                                            </Group>
                                        </ScrollArea>
                                    </Menu.Dropdown>
                                </Menu>

                                <TextInput
                                    disabled={!isExternal}
                                    onChange={(event) =>
                                        setExternalLabel(event.currentTarget.value)
                                    }
                                    placeholder={t('common.field.name')}
                                    style={{ flex: 1 }}
                                    value={previewLabel}
                                />
                            </Group>

                            <Group align="flex-start" gap="xs" wrap="nowrap">
                                {isExternal ? (
                                    <TextInput
                                        error={
                                            isUrlValid ? null : 'Only https:// links are allowed.'
                                        }
                                        onChange={(event) =>
                                            setExternalUrl(event.currentTarget.value)
                                        }
                                        placeholder="https://example.com"
                                        style={{ flex: 1 }}
                                        value={externalUrl}
                                    />
                                ) : (
                                    <Select
                                        data={addKind === 'modal' ? modalOptions : routeOptions}
                                        onChange={(value) =>
                                            addKind === 'modal'
                                                ? setModalId(
                                                      QUICK_MODAL_IDS.find((id) => id === value) ??
                                                          null
                                                  )
                                                : setRoutePath(value)
                                        }
                                        placeholder={t('common.action.select')}
                                        searchable={addKind === 'route'}
                                        style={{ flex: 1 }}
                                        value={addKind === 'modal' ? modalId : routePath}
                                    />
                                )}

                                <ActionIcon
                                    color="teal"
                                    disabled={!canAdd}
                                    onClick={add}
                                    size="input-sm"
                                    variant="soft"
                                >
                                    <TbPlus size={18} />
                                </ActionIcon>
                            </Group>

                            {isFull ? (
                                <Text c="dimmed" size="xs" ta="right">
                                    {MAX_QUICK_LINKS} / {MAX_QUICK_LINKS}
                                </Text>
                            ) : null}
                        </Stack>
                    </SectionCard.Section>
                </SectionCard.Root>

                <ScrollArea scrollbars="y" style={{ flex: 1, minHeight: 0 }} type="auto">
                    {rows.length === 0 ? (
                        <EmptyPageLayout icon={<TbBolt size={48} />} />
                    ) : (
                        <SectionCard.Root gap="sm" p="sm">
                            {rows.map((row, index) => (
                                <SectionCard.Section key={row.key}>
                                    <Group gap="xs" wrap="nowrap">
                                        <ThemeIcon color="gray" size="lg" variant="light">
                                            <row.Icon size={18} />
                                        </ThemeIcon>

                                        <Stack gap={0} style={{ flex: 1, minWidth: 0 }}>
                                            <Text fw={500} size="sm" truncate>
                                                {row.label}
                                            </Text>
                                            <Text c="dimmed" size="xs" truncate>
                                                {row.description}
                                            </Text>
                                        </Stack>

                                        <ActionIcon.Group>
                                            <ActionIcon
                                                color="gray"
                                                disabled={index === 0}
                                                onClick={() => move(index, -1)}
                                                variant="default"
                                            >
                                                <TbChevronUp size={16} />
                                            </ActionIcon>

                                            <ActionIcon
                                                color="gray"
                                                disabled={index === rows.length - 1}
                                                onClick={() => move(index, 1)}
                                                variant="default"
                                            >
                                                <TbChevronDown size={16} />
                                            </ActionIcon>
                                        </ActionIcon.Group>

                                        <ActionIcon
                                            color="red"
                                            onClick={() => remove(row.index)}
                                            variant="subtle"
                                        >
                                            <TbTrash size={16} />
                                        </ActionIcon>
                                    </Group>
                                </SectionCard.Section>
                            ))}
                        </SectionCard.Root>
                    )}
                </ScrollArea>
            </Stack>
        </CompoundModalShared>
    )
})
