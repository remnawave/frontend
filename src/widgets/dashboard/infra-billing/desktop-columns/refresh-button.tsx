import { ActionIcon, Tooltip } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { TbRefresh } from 'react-icons/tb'

interface RefreshButtonProps {
    loading: boolean
    onClick: () => void
}

export function RefreshButton(props: RefreshButtonProps) {
    const { loading, onClick } = props
    const { t } = useTranslation()

    return (
        <Tooltip label={t('common.action.refresh')} withArrow>
            <ActionIcon
                color="cyan"
                loading={loading}
                onClick={onClick}
                size="input-xs"
                variant="soft"
            >
                <TbRefresh size={18} />
            </ActionIcon>
        </Tooltip>
    )
}
