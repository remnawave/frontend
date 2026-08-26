import { Center, Stack, Text, ThemeIcon } from '@mantine/core'
import { useTranslation } from 'react-i18next'

import { SectionCard } from '@shared/ui/section-card'

interface IProps {
    icon: React.ReactNode
    mih?: string
    title?: React.ReactNode
}

export const EmptyPageLayout = (props: IProps) => {
    const { icon, mih, title } = props
    const { t } = useTranslation()
    return (
        <SectionCard.Root p="xl" mih={mih}>
            <SectionCard.Section>
                <Center py="xl" mih={mih}>
                    <Stack align="center" gap="lg">
                        <ThemeIcon color="gray" radius="xl" size={64} variant="soft">
                            {icon}
                        </ThemeIcon>

                        <Stack align="center" gap="xs">
                            <Text fw={600} size="lg" ta="center">
                                {title ?? t('common.message.nothing-found')}
                            </Text>
                        </Stack>
                    </Stack>
                </Center>
            </SectionCard.Section>
        </SectionCard.Root>
    )
}
