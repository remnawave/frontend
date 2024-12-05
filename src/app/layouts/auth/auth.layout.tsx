import { Box, Center } from '@mantine/core'
import { Outlet } from 'react-router-dom'

export function AuthLayout() {
    return (
        <Center mih="100vh" p="md">
            <Box maw="25rem">
                <Outlet />
            </Box>
        </Center>
    )
}
