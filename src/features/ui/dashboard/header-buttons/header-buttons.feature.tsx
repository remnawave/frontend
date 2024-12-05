import { Button, Image, Menu } from '@mantine/core'
import { PiSignOutDuotone } from 'react-icons/pi'
import { useNavigate } from 'react-router-dom'

import { resetAllStores } from '@/shared/hocs/store-wrapper'
import { clearQueryClient } from '@/shared/api'
import { removeToken } from '@entitites/auth'
import { ROUTES } from '@/shared/constants'
import { useAuth } from '@/shared/hooks'
import { app } from '@/config'

export const HeaderButtons = () => {
    const { setIsAuthenticated } = useAuth()

    const navigate = useNavigate()
    const handleLogout = () => {
        setIsAuthenticated(false)
        removeToken()
        resetAllStores()
        clearQueryClient()
        navigate(ROUTES.AUTH.LOGIN)
    }

    return (
        <Menu>
            <Image
                color="greem"
                h="2.6rem"
                onClick={() => window.open(app.githubOrg, '_blank')}
                radius="lg"
                src="https://img.shields.io/github/stars/remnawave?style=for-the-badge&logo=github&logoColor=fffff&label=Stars&labelColor=21262d&color=30363d&cacheSeconds=1"
                style={{ cursor: 'pointer' }}
                w={'auto'}
            />

            <Button leftSection={<PiSignOutDuotone size="1rem" />} onClick={handleLogout} size="md">
                Logout
            </Button>
        </Menu>
    )
}
