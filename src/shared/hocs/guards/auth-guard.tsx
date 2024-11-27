import { ReactNode } from 'react';
import { ROUTES } from '@shared/constants/routes';
import { useAuth } from '@shared/hooks';
import { LoadingScreen } from '@shared/ui/loading-screen';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export function AuthGuard() {
  console.log('123131');
  const location = useLocation();

  const { isAuthenticated, isInitialized } = useAuth();

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    if (location.pathname.includes(ROUTES.AUTH.ROOT)) {
      return <Outlet />;
    }
    return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
  }

  if (isAuthenticated) {
    if (location.pathname.includes(ROUTES.DASHBOARD.ROOT)) {
      return <Outlet />;
    }
    return <Navigate to={ROUTES.DASHBOARD.ROOT} replace />;
  }

  return <Outlet />;
}
