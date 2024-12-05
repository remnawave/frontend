import { QueryClient } from '@tanstack/react-query'

import { sToMs } from '../utils/time-utils'

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: true,
            retry: false,
            gcTime: sToMs(120)

            // refetchOnMount: 'always'
        },
        mutations: {
            retry: false
        }
    }
})

export const clearQueryClient = () => {
    queryClient.clear()
}
