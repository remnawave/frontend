import { UpdateUserCommand } from '@remnawave/backend-contract';

export interface IFormValues extends UpdateUserCommand.Request {
    username: string;
}
