import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { setAuthorizationToken } from '@/shared/api';
import { IActions, ISetTokenAction, IState } from './interfaces';

export const useSessionStore = create<IState & IActions>()(
    persist(
        devtools(
            (set) => ({
                token: '',
                actions: {
                    setToken: (dto: ISetTokenAction) => {
                        set({ token: dto.token });
                    },
                    removeToken: () => {
                        set({ token: '' });
                    },
                },
            }),
            { name: 'sessionStore', anonymousActionType: 'sessionStore' }
        ),
        {
            name: 'sessionStore',
            partialize: (state) => ({
                token: state.token,
            }),
            storage: createJSONStorage(() => localStorage),
        }
    )
);

useSessionStore.subscribe((state) => {
    setAuthorizationToken(state.token);
});

setAuthorizationToken(useSessionStore.getState().token);

export const useToken = () => useSessionStore((state) => state.token);
export const useSessionStoreActions = () => useSessionStore((state) => state.actions);

export const setToken = (dto: ISetTokenAction) => useSessionStore.setState({ ...dto });
export const removeToken = () => useSessionStore.getState().actions.removeToken();
