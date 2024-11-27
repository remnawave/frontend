import {
  GetAllUsersCommand,
  GetInboundsCommand,
  GetStatsCommand,
} from '@remnawave/backend-contract';
import { IUsersParams } from '../interfaces';

export interface IState {
  isLoading: boolean;
  isInboundsLoading: boolean;
  systemInfo: GetStatsCommand.Response['response'] | null;
  users: GetAllUsersCommand.Response['response']['users'] | null;
  usersParams: IUsersParams;
  totalUsers: number;
  inbounds: GetInboundsCommand.Response['response'] | null;
}
