import { ActionIcon, ActionIconGroup, Tooltip } from '@mantine/core'
import { spotlight } from '@mantine/spotlight'
import { useTranslation } from 'react-i18next'
import { TbSearch } from 'react-icons/tb'

export const UniversalSpotlightActionIconShared = () => {
    const { t } = useTranslation()

    return (
        <ActionIconGroup>
            <Tooltip label={t('common.search')}>
                <ActionIcon color="gray" onClick={spotlight.open} size="input-md" variant="light">
                    <TbSearch size="24px" />
                </ActionIcon>
            </Tooltip>
        </ActionIconGroup>
    )
}
