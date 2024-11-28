import { createContext, ReactNode, useEffect, useMemo, useState } from 'react';
import { useToken } from '../../entitites/auth';
import { useDashboardStoreActions } from '../../entitites/dashboard/dashboard-store/dashboard-store';

interface AuthContextValues {
    isAuthenticated: boolean;
    isInitialized: boolean;
    setIsAuthenticated: (isAuthenticated: boolean) => void;
}

export const AuthContext = createContext<AuthContextValues | null>(null);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const token = useToken();
    const actions = useDashboardStoreActions();

    useEffect(() => {
        (async () => {
            if (!token) {
                setIsAuthenticated(false);
                setIsInitialized(true);
                return;
            }

            try {
                await actions.getSystemInfo();
                setIsAuthenticated(true);
            } catch (error) {
                setIsAuthenticated(false);
            } finally {
                setIsInitialized(true);
            }
        })();
    }, []);

    const value = useMemo(
        () => ({ isAuthenticated, isInitialized, setIsAuthenticated }),
        [isAuthenticated, isInitialized]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
