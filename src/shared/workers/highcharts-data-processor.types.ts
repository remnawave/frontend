export interface HighchartsSeriesData {
    color: string
    data: number[]
    name: string
    total: number
}

export interface HighchartsProcessedData {
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

export interface ProcessHighchartsDataOptions {
    maxDisplayedUsers: number
    minTrafficThreshold: number
    selectedUsers: string[]
}
