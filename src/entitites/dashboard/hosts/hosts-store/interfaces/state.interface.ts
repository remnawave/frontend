import { GetAllHostsCommand } from '@remnawave/backend-contract';

export interface IState {
    isHostsLoading: boolean;
    hosts: GetAllHostsCommand.Response['response'] | null;
}
