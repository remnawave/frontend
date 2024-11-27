import { LoginCommand } from '@remnawave/backend-contract';
import { instance } from '@shared/api';
import { AxiosError } from 'axios';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { notifications } from '@mantine/notifications';
import { removeToken, setToken } from '../session-store/use-session-store';
import type { IActions, IState } from './interfaces';

const initialState: IState = {
  isLoading: false,
  loginResponse: null,
};

const useAuthStore = create<IState & IActions>()(
  devtools(
    (set, getState) => ({
      ...initialState,
      actions: {
        login: async (data: LoginCommand.Request): Promise<void> => {
          try {
            set({ isLoading: true });
            const response = await instance.post<LoginCommand.Response>(LoginCommand.url, data);
            const {
              data: { response: dataResponse },
            } = response;
            const { accessToken } = dataResponse;
            setToken({ token: accessToken });
            set({ loginResponse: dataResponse });

            notifications.show({
              title: 'Welcome back!',
              message: 'You have successfully logged in',
            });
          } catch (e) {
            if (e instanceof AxiosError) {
              notifications.show({ message: e.message, color: 'red' });

              throw e;
            }
          } finally {
            set({ isLoading: false });
          }
        },
        resetState: async () => {
          removeToken();
          set({ ...initialState });
        },
      },
    }),
    {
      name: 'loginPageStore',
      anonymousActionType: 'loginPageStore',
    }
  )
);

export const useAuthStoreIsLoading = () => useAuthStore((store) => store.isLoading);
export const useLoginResponse = () => useAuthStore((state) => state.loginResponse);
export const useLoginPageStoreActions = () => useAuthStore((store) => store.actions);
