import { ActionIcon, ActionIconGroup, Tooltip } from '@mantine/core'
import { GetHttpStatsCommand } from '@remnawave/backend-contract'
import { HttpStatsTableWidget } from '@widgets/dashboard/http-stats/http-stats-table/http-stats-table.widget'
import { useTranslation } from 'react-i18next'
import { TbApi, TbRefresh } from 'react-icons/tb'

import { Page, PageHeaderShared } from '@shared/ui'

interface IProps {
    refetch: () => void
    isFetching: boolean
    httpStats: GetHttpStatsCommand.Response['response']
}

export default function HttpStatsPageComponent({ refetch, isFetching, httpStats }: IProps) {
    const { t } = useTranslation()
    return (
        <Page title={t('constants.http-stats')}>
            <PageHeaderShared
                actions={
                    <ActionIconGroup>
                        <Tooltip label={t('common.action.update')} withArrow>
                            <ActionIcon
                                loading={isFetching}
                                onClick={() => refetch()}
                                size="input-md"
                                variant="soft"
                            >
                                <TbRefresh size="24px" />
                            </ActionIcon>
                        </Tooltip>
                    </ActionIconGroup>
                }
                description={t('http-stats.page.component.http-stats-description')}
                icon={<TbApi size={24} />}
                title={t('constants.http-stats')}
            />

            <HttpStatsTableWidget httpStats={httpStats} />
        </Page>
    )
}
