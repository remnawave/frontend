import {
    ActionIcon,
    Card,
    Code,
    Group,
    SimpleGrid,
    Stack,
    Text,
    TextInput,
    ThemeIcon
} from '@mantine/core'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TbArrowRight, TbLink } from 'react-icons/tb'
import { useNavigate } from 'react-router'

import { OPEN_ENTITY_TARGETS } from '@shared/_modals/open-entity-targets'
import { ROUTES, TOpenEntity } from '@shared/constants'
import { CopyEntityLinkButton, Page, PageHeaderShared } from '@shared/ui'

import classes from './quick-open.module.css'

export function QuickOpenPage() {
    const { t } = useTranslation()
    const navigate = useNavigate()

    const [ids, setIds] = useState<Record<string, string>>({})

    const entities = Object.entries(OPEN_ENTITY_TARGETS) as [
        TOpenEntity,
        (typeof OPEN_ENTITY_TARGETS)[string]
    ][]

    return (
        <Page title={t('constants.quick-open')}>
            <PageHeaderShared
                description={t('quick-open.page.description')}
                icon={<TbLink size={20} />}
                title={t('constants.quick-open')}
            />

            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
                {entities.map(([entity, target]) => {
                    const id = ids[entity] ?? ''
                    const isValid = target.validate(id)

                    const open = () => {
                        if (!isValid) return

                        navigate(
                            ROUTES.DASHBOARD.OPEN_ENTITY.replace(':entity', entity).replace(
                                ':id',
                                id
                            )
                        )
                    }

                    return (
                        <Card className={classes.card} key={entity} padding="md" withBorder>
                            <Stack gap="sm">
                                <Group gap="sm" wrap="nowrap">
                                    <ThemeIcon color="cyan" size="lg" variant="soft">
                                        <target.Icon size={20} />
                                    </ThemeIcon>

                                    <Stack gap={2} style={{ minWidth: 0 }}>
                                        <Text fw={600} size="sm">
                                            {t(target.titleKey)}
                                        </Text>

                                        <Code className={classes.pattern}>
                                            {`/dashboard/open/${entity}/:id`}
                                        </Code>
                                    </Stack>
                                </Group>

                                <Group align="center" gap="xs" wrap="nowrap">
                                    <TextInput
                                        error={Boolean(id) && !isValid}
                                        onChange={(event) => {
                                            const value = event.currentTarget.value.trim()

                                            setIds((prev) => ({ ...prev, [entity]: value }))
                                        }}
                                        onKeyDown={(event) => event.key === 'Enter' && open()}
                                        placeholder={target.idPlaceholder}
                                        style={{ flex: 1 }}
                                        value={id}
                                    />

                                    <CopyEntityLinkButton
                                        disabled={!isValid}
                                        entity={entity}
                                        iconSize={18}
                                        id={id}
                                        size="input-sm"
                                        variant="default"
                                    />

                                    <ActionIcon
                                        color="teal"
                                        disabled={!isValid}
                                        onClick={open}
                                        size="input-sm"
                                        variant="soft"
                                    >
                                        <TbArrowRight size={18} />
                                    </ActionIcon>
                                </Group>
                            </Stack>
                        </Card>
                    )
                })}
            </SimpleGrid>
        </Page>
    )
}
