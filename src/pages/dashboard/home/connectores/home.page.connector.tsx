import { useEffect } from 'react';
import {
  useDashboardStoreActions,
  useDashboardStoreSystemInfo,
} from '@/entitites/dashboard/dashboard-store/dashboard-store';
import { HomePage } from '@/pages/dashboard/home/components';
import { LoadingScreen } from '@/shared/ui/loading-screen';
import { BREADCRUMBS } from './constant';

export const HomePageConnectior = () => {
  const actions = useDashboardStoreActions();
  const systemInfo = useDashboardStoreSystemInfo();

  useEffect(() => {
    const intervalTime = setInterval(() => {
      actions.getSystemInfo();
    }, 5000);

    return () => clearInterval(intervalTime);
  }, [actions]);

  if (!systemInfo) {
    return <LoadingScreen />;
  }

  return <HomePage systemInfo={systemInfo} breadcrumbs={BREADCRUMBS} />;
};
