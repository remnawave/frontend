import { Spotlight, SpotlightProps } from '@mantine/spotlight'
import { Center, Stack, Text } from '@mantine/core'
import { PiEmptyDuotone } from 'react-icons/pi'
import { useTranslation } from 'react-i18next'
import { TbSearch } from 'react-icons/tb'

interface IProps {
    actions: SpotlightProps['actions']
}

export const UniversalSpotlightContentShared = (props: IProps) => {
    const { actions } = props
    const { t } = useTranslation()

    return (
        <Spotlight
            actions={actions}
            centered
            highlightQuery
            maxHeight={350}
            nothingFound={
                <Center h="230">
                    <Stack align="center" gap="xs">
                        <PiEmptyDuotone color="var(--mantine-color-gray-5)" size="3rem" />
                        <Text c="dimmed" size="sm">
                            {t('common.nothing-found')}
                        </Text>
                    </Stack>
                </Center>
            }
            overlayProps={{ backgroundOpacity: 0.6, blur: 0 }}
            scrollable
            searchProps={{
                leftSection: <TbSearch color="var(--mantine-color-gray-5)" size={16} />,
                placeholder: `${t('common.search')}...`
            }}
            shortcut={['mod + F']}
        />
    )
}
