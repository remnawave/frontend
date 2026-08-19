import { useModal } from '@ebay/nice-modal-react'
import { Center, Code, Stack, Text, ThemeIcon } from '@mantine/core'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate, useNavigate, useParams } from 'react-router'

import type { TOpenEntityModalTarget, TOpenEntityTarget } from '@shared/_modals/open-entity-targets'
import { OPEN_ENTITY_TARGETS } from '@shared/_modals/open-entity-targets'
import { ROUTES } from '@shared/constants'
import { SectionCard } from '@shared/ui/section-card'

interface IModalRedirectProps {
    id: string
    target: TOpenEntityModalTarget
}

function OpenEntityStage(props: IModalRedirectProps) {
    const { id, target } = props

    const { t } = useTranslation()

    return (
        <Center style={{ height: `calc(100dvh - var(--app-shell-header-height) - 48px)` }}>
            <SectionCard.Root maw="90vw" miw={320} p="xl">
                <SectionCard.Section>
                    <Stack align="center" gap="lg">
                        <ThemeIcon color="gray" radius="xl" size={64} variant="soft">
                            <target.Icon size={32} />
                        </ThemeIcon>

                        <Stack align="center" gap="xs">
                            <Text c="dimmed" fw={600} size="md" ta="center">
                                {t(target.titleKey)}
                            </Text>

                            <Code>{id}</Code>
                        </Stack>
                    </Stack>
                </SectionCard.Section>
            </SectionCard.Root>
        </Center>
    )
}

function OpenEntityModal(props: IModalRedirectProps) {
    const { id, target } = props

    const navigate = useNavigate()
    const modal = useModal(target.modalId)

    const wasVisibleRef = useRef(false)

    useEffect(() => {
        target.open(id)
    }, [id, target])

    useEffect(() => {
        if (modal.visible) {
            wasVisibleRef.current = true
            return
        }

        if (!wasVisibleRef.current) return

        navigate(target.fallback, { replace: true })
    }, [modal.visible, navigate, target])

    return <OpenEntityStage id={id} target={target} />
}

export function OpenEntityPage() {
    const { entity, id } = useParams()

    const target: TOpenEntityTarget | undefined = entity ? OPEN_ENTITY_TARGETS[entity] : undefined

    if (!target || !id) {
        return <Navigate replace to={ROUTES.DASHBOARD.HOME} />
    }

    if (!target.validate(id)) {
        return <Navigate replace to={target.fallback} />
    }

    if (target.kind === 'route') {
        return <Navigate replace to={target.buildPath(id)} />
    }

    return <OpenEntityModal id={id} target={target} />
}
