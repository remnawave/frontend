import {
    GetUserByUuidCommand,
    RevokeUserSubscriptionCommand,
    UpdateUserCommand,
} from '@remnawave/backend-contract';

export interface IActions {
    actions: {
        getUser: () => Promise<boolean>;
        updateUser: (body: UpdateUserCommand.Request) => Promise<boolean>;
        disableUser: () => Promise<boolean>;
        enableUser: () => Promise<boolean>;
        deleteUser: () => Promise<boolean>;
        reveokeSubscription: () => Promise<boolean>;
        changeModalState: (state: boolean) => void;
        setUserUuid: (userUuid: string) => Promise<void>;
        resetState: () => Promise<void>;
    };
}
