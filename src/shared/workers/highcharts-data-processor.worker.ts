import { GetNodeUserUsageByRangeCommand } from '@remnawave/backend-contract'
import ColorHash from 'color-hash'
import dayjs from 'dayjs'

interface HighchartsSeriesData {
    color: string
    data: number[]
    name: string
    total: number
}

interface ProcessHighchartsDataMessage {
    data: GetNodeUserUsageByRangeCommand.Response['response']
    payload: {
        maxDisplayedUsers: number
        minTrafficThreshold: number
        selectedUsers: string[]
    }
    type: 'PROCESS_HIGHCHARTS_DATA'
}

interface ProcessHighchartsDataResponse {
    result: {
        allAvailableUsers: Array<{ name: string; total: number }>
        categories: string[]
        displayedUserCount: number
        series: HighchartsSeriesData[]
        significantUserCount: number
        topUsers: string[]
        totalUsage: number
        trendData: { date: string; value: number }[]
        userCount: number
    }
    type: 'HIGHCHARTS_DATA_PROCESSED'
}

const ch = new ColorHash({ lightness: 0.5, saturation: 0.7 })

function formatDataForHighcharts(
    dbData: GetNodeUserUsageByRangeCommand.Response['response'] = [],
    selectedUsers: string[] = [],
    minTrafficThreshold = 100 * 1024,
    maxDisplayedUsers = 100
) {
    if (!dbData || dbData.length === 0) {
        return {
            categories: [],
            displayedUserCount: 0,
            series: [],
            significantUserCount: 0,
            topUsers: [],
            totalUsage: 0,
            trendData: [],
            userCount: 0,
            allAvailableUsers: []
        }
    }

    const dateSet = new Set<string>()
    const userTotals: Record<string, number> = {}

    const dataByDateAndUser: Record<string, Record<string, number>> = {}

    for (let i = 0; i < dbData.length; i++) {
        const { username, total, date } = dbData[i]
        const formattedDate = dayjs(date as unknown as string).format('MMM D')

        dateSet.add(formattedDate)
        userTotals[username] = (userTotals[username] || 0) + total

        if (!dataByDateAndUser[formattedDate]) {
            dataByDateAndUser[formattedDate] = {}
        }
        dataByDateAndUser[formattedDate][username] = total
    }

    const categories = Array.from(dateSet).sort((a, b) => {
        const dateA = dayjs(a, 'MMM D')
        const dateB = dayjs(b, 'MMM D')
        return dateA.isBefore(dateB) ? -1 : 1
    })

    const totalUsage = Object.values(userTotals).reduce((sum, val) => sum + val, 0)

    const significantUsersData = Object.entries(userTotals)
        .filter(([, total]) => total >= minTrafficThreshold)
        .map(([name, total]) => ({ name, total }))
        .sort((a, b) => b.total - a.total)

    const significantUsers = significantUsersData.map((item) => item.name)
    const topSignificantUsers = significantUsers.slice(0, maxDisplayedUsers)

    const finalUsers =
        selectedUsers.length > 0
            ? topSignificantUsers.filter((user) => selectedUsers.includes(user))
            : topSignificantUsers

    const allUserCount = Object.keys(userTotals).length
    const significantUserCount = significantUsers.length
    const displayedUserCount = finalUsers.length

    const series: HighchartsSeriesData[] = finalUsers.map((userName) => {
        const data = categories.map((category) => {
            return dataByDateAndUser[category]?.[userName] || 0
        })

        return {
            name: userName,
            data,
            color: ch.hex(userName),
            total: userTotals[userName] || 0
        }
    })

    const allAvailableUsers = significantUsersData.slice(0, maxDisplayedUsers)

    const trendData = categories.map((category) => {
        const dailyTotal = Object.values(dataByDateAndUser[category] || {}).reduce(
            (sum, value) => sum + value,
            0
        )
        return { date: category, value: dailyTotal }
    })

    return {
        categories,
        displayedUserCount,
        series,
        significantUserCount,
        topUsers: significantUsersData.slice(0, 3).map((item) => item.name),
        totalUsage,
        trendData,
        userCount: allUserCount,
        allAvailableUsers
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const self: any

self.addEventListener('message', (e: MessageEvent<ProcessHighchartsDataMessage>) => {
    const { type, data, payload } = e.data

    if (type === 'PROCESS_HIGHCHARTS_DATA') {
        try {
            const result = formatDataForHighcharts(
                data,
                payload.selectedUsers,
                payload.minTrafficThreshold,
                payload.maxDisplayedUsers
            )

            const response: ProcessHighchartsDataResponse = {
                result,
                type: 'HIGHCHARTS_DATA_PROCESSED'
            }

            self.postMessage(response)
        } catch (error) {
            self.postMessage({
                error: error instanceof Error ? error.message : 'Unknown error',
                type: 'ERROR'
            })
        }
    }
})
