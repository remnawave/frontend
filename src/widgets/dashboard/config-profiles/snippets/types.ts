import { GetSnippetsCommand } from '@remnawave/backend-contract'

export type TSnippet = GetSnippetsCommand.Response['response']['snippets'][number]
