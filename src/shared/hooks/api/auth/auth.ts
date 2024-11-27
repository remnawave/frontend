// import { LoginCommand } from '@remnawave/backend-contract';
// import { setClientAccessToken } from '@shared/api/axios';
// import { createPostMutationHook } from '@shared/api/axios-proxy';
// import { notifications } from '@mantine/notifications';

// export const useLogin = createPostMutationHook({
//   endpoint: LoginCommand.url,
//   bodySchema: LoginCommand.RequestSchema,
//   responseSchema: LoginCommand.ResponseSchema,
//   rMutationParams: {
//     onSuccess: (data) => {
//       setClientAccessToken(data.response.accessToken);
//     },
//     onError: (error) => {
//       notifications.show({ message: error.message, color: 'red' });
//     },
//   },
// });
