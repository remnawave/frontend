export type QueryKey =
    | [string, Record<string, number | string | undefined>]
    | [string, string]
    | [string]
    | readonly string[]
