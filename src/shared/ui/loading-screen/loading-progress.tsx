import { nprogress } from '@mantine/nprogress'
import { useEffect } from 'react'

export function LoadingProgress() {
    useEffect(() => {
        nprogress.start()
        return () => nprogress.complete()
    }, [])

    return <></>
}
