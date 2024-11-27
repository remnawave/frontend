import { PiSignOutDuotone } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';
import { Button, Menu } from '@mantine/core';
import { removeToken, useSessionStoreActions } from '../../../../entitites/auth';
import { ROUTES } from '../../../../shared/constants';
import { useAuth } from '../../../../shared/hooks/use-auth';

export const HeaderButtons = () => {
    const { setIsAuthenticated } = useAuth();

    const navigate = useNavigate();
    const handleLogout = () => {
        setIsAuthenticated(false);
        removeToken();
        navigate(ROUTES.AUTH.LOGIN);
    };

    return (
        <Menu>
            <Button
                variant="outline"
                size="md"
                leftSection={<PiSignOutDuotone size="1rem" />}
                onClick={handleLogout}
            >
                Logout
            </Button>
        </Menu>
    );
};
