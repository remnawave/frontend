import { Spotlight, SpotlightProps } from '@mantine/spotlight'
import { useTranslation } from 'react-i18next'
import { TbSearch } from 'react-icons/tb'

import { EmptyPageLayout } from '../layouts/empty-page'

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
            nothingFound={<EmptyPageLayout icon={<TbSearch size="32px" />} />}
            overlayProps={{ backgroundOpacity: 0.6, blur: 0 }}
            scrollable
            searchProps={{
                leftSection: <TbSearch color="var(--mantine-color-gray-5)" size={16} />,
                placeholder: `${t('common.action.search')}...`
            }}
            shortcut={['mod + F']}
        />
    )
}
