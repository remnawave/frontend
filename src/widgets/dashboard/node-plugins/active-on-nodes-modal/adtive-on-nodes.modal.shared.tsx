import { Center, Stack, Text, ThemeIcon } from '@mantine/core'
import { GetNodesCommand } from '@remnawave/backend-contract'
import { useTranslation } from 'react-i18next'
import { PiCpu } from 'react-icons/pi'
import { TbServer } from 'react-icons/tb'

import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { SectionCard } from '@shared/ui/section-card'

interface IProps {
    nodes: GetNodesCommand.Response['response']
}

export const ActivePluginsOnNodesModalShared = (props: IProps) => {
    const { nodes } = props
    const { t } = useTranslation()

    if (nodes.length === 0) {
        return (
            <Center py="xl">
                <Stack align="center" gap="sm">
                    <ThemeIcon color="gray" size="xl" variant="soft">
                        <PiCpu size={24} />
                    </ThemeIcon>
                    <Text c="dimmed" size="sm" ta="center">
                        {t('active-on-nodes.modal.shared.this-plugin-is-not-active-on-any-nodes')}
                    </Text>
                </Stack>
            </Center>
        )
    }

    return (
        <Stack gap="md">
            <SectionCard.Root gap="xs">
                {nodes.map((node) => (
                    <SectionCard.Section key={node.uuid}>
                        <BaseOverlayHeader
                            countryCode={node.countryCode}
                            iconColor="blue"
                            IconComponent={TbServer}
                            iconVariant="soft"
                            subtitle={node.address}
                            title={node.name}
                            titleOrder={5}
                            withCopy={true}
                        />
                    </SectionCard.Section>
                ))}
            </SectionCard.Root>
        </Stack>
    )
}
