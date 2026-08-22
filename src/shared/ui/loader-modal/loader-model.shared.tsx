import { Center, Loader, Stack } from '@mantine/core'

import { SectionCard } from '../section-card'

interface IProps {
    mih?: string
}

export function LoaderModalShared(props: IProps) {
    const { mih } = props

    return (
        <SectionCard.Root p="xl" mih={mih}>
            <SectionCard.Section>
                <Center mih={mih}>
                    <Stack align="center" gap="xs">
                        <Loader size="64px" />
                    </Stack>
                </Center>
            </SectionCard.Section>
        </SectionCard.Root>
    )
}
