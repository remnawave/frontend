import { GetLegacyStatsNodeUserUsageCommand } from '@remnawave/backend-contract'
import ColorHash from 'color-hash'
import dayjs from 'dayjs'

import {
    HighchartsProcessedData,
    HighchartsSeriesData,
    ProcessHighchartsDataOptions
} from './highcharts-data-processor.types'

const ch = new ColorHash({
    hue: [
        { min: 120, max: 125 }, // green (#7EB26D)
        { min: 45, max: 50 }, // yellow (#EAB839)
        { min: 185, max: 190 }, // light blue (#6ED0E0)
        { min: 25, max: 30 }, // orange (#EF843C)
        { min: 0, max: 5 }, // red (#E24D42)
        { min: 210, max: 215 }, // blue (#1F78C1)
        { min: 300, max: 305 }, // purple (#BA43A9)
        { min: 270, max: 275 }, // violet (#705DA0)
        { min: 100, max: 105 }, // dark green (#508642)
        { min: 45, max: 50 }, // dark yellow (#CCA300)
        { min: 210, max: 215 }, // dark blue (#447EBC)
        { min: 25, max: 30 }, // dark orange (#C15C17)
        { min: 0, max: 5 }, // dark red (#890F02)
        { min: 150, max: 155 }, // teal (#2B908F)
        { min: 330, max: 335 }, // pink (#EA6460)
        { min: 240, max: 245 }, // indigo (#5195CE)
        { min: 60, max: 65 }, // lime (#B3DE69)
        { min: 15, max: 20 }, // coral (#FFA07A)
        { min: 285, max: 290 }, // magenta (#C71585)
        { min: 165, max: 170 } // turquoise (#40E0D0)
    ],
    lightness: [0.3, 0.4, 0.5, 0.6, 0.7],
    saturation: [0.4, 0.5, 0.6, 0.7, 0.8]
})

function formatDataForHighcharts(
    dbData: GetLegacyStatsNodeUserUsageCommand.Response['response'],
    options: ProcessHighchartsDataOptions
): HighchartsProcessedData {
    const {
        selectedUsers = [],
        minTrafficThreshold = 100 * 1024,
        maxDisplayedUsers = 100
    } = options

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

    const userTotals = new Map<string, number>()
    const dateSet = new Set<string>()
    const dataByDateAndUser = new Map<string, Map<string, number>>()

    for (const item of dbData) {
        const { username, total, date } = item
        const formattedDate = dayjs(date as unknown as string).format('MMM D')

        dateSet.add(formattedDate)
        userTotals.set(username, (userTotals.get(username) || 0) + total)

        let dateMap = dataByDateAndUser.get(formattedDate)
        if (!dateMap) {
            dateMap = new Map<string, number>()
            dataByDateAndUser.set(formattedDate, dateMap)
        }
        dateMap.set(username, total)
    }

    const categories = Array.from(dateSet).sort((a, b) => {
        return dayjs(a, 'MMM D').valueOf() - dayjs(b, 'MMM D').valueOf()
    })

    const userTotalsArray = Array.from(userTotals.entries())
    const significantUsersData = userTotalsArray
        .filter(([, total]) => total >= minTrafficThreshold)
        .sort((a, b) => b[1] - a[1])

    const significantUsers = significantUsersData.map(([name]) => name)
    const topSignificantUsers = significantUsers.slice(0, maxDisplayedUsers)

    const finalUsers =
        selectedUsers.length > 0
            ? topSignificantUsers.filter((user) => selectedUsers.includes(user))
            : topSignificantUsers

    const series: HighchartsSeriesData[] = finalUsers.map((userName) => {
        const data = new Array(categories.length)

        for (let i = 0; i < categories.length; i++) {
            const category = categories[i]
            const dateMap = dataByDateAndUser.get(category)
            data[i] = dateMap?.get(userName) || 0
        }

        return {
            name: userName,
            data,
            color: ch.hex(userName),
            total: userTotals.get(userName) || 0
        }
    })

    const remainingUsers = significantUsers.slice(maxDisplayedUsers)
    if (remainingUsers.length > 0 && selectedUsers.length === 0) {
        const othersData = new Array(categories.length).fill(0)
        let othersTotal = 0

        for (let i = 0; i < categories.length; i++) {
            const category = categories[i]
            const dateMap = dataByDateAndUser.get(category)

            for (const userName of remainingUsers) {
                const userValue = dateMap?.get(userName) || 0
                othersData[i] += userValue
            }
        }

        for (const userName of remainingUsers) {
            othersTotal += userTotals.get(userName) || 0
        }

        if (othersTotal > 0) {
            series.push({
                name: `Others (${remainingUsers.length} users)`,
                data: othersData,
                color: '#999999',
                total: othersTotal
            })
        }
    }

    const allUserCount = userTotals.size
    const significantUserCount = significantUsers.length
    const displayedUserCount = finalUsers.length

    let totalUsage = 0
    for (const total of userTotals.values()) {
        totalUsage += total
    }

    const trendData = categories.map((category) => {
        const dateMap = dataByDateAndUser.get(category)
        let dailyTotal = 0

        if (dateMap) {
            for (const value of dateMap.values()) {
                dailyTotal += value
            }
        }

        return { date: category, value: dailyTotal }
    })

    const allAvailableUsers = significantUsersData
        .slice(0, maxDisplayedUsers)
        .map(([name, total]) => ({ name, total }))

    return {
        categories,
        displayedUserCount,
        series,
        significantUserCount,
        topUsers: significantUsersData.slice(0, 3).map(([name]) => name),
        totalUsage,
        trendData,
        userCount: allUserCount,
        allAvailableUsers
    }
}

export async function processData(
    data: GetLegacyStatsNodeUserUsageCommand.Response['response'],
    options: ProcessHighchartsDataOptions
): Promise<HighchartsProcessedData> {
    return formatDataForHighcharts(data, options)
}
