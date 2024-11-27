import { GetAllUsersCommand } from '@remnawave/backend-contract';
import { createGetQueryHook } from '@shared/api/axios-proxy';

export const useGetSystemInfo = createGetQueryHook({
  endpoint: GetAllUsersCommand.url,
  responseSchema: GetAllUsersCommand.ResponseSchema,
  rQueryParams: { queryKey: ['system-info'] },
});
