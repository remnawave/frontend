import { Logo } from '@shared/ui/logo';
import { Outlet } from 'react-router-dom';
import { Paper, ScrollArea } from '@mantine/core';
import { Header } from '../header';
import { Sidebar } from '../sidebar';
import classes from './root.module.css';

export function DashboardLayout() {
  return (
    <div className={classes.root}>
      <Paper className={classes.sidebarWrapper} withBorder>
        <div className={classes.logoWrapper}>
          <Logo w="3rem" />
        </div>
        <ScrollArea flex="1" px="md">
          <Sidebar />
        </ScrollArea>
      </Paper>
      <div className={classes.content}>
        <Header />

        <main className={classes.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
