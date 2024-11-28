export function isDefined(value: unknown): value is NonNullable<typeof value> {
    return value !== null && value !== undefined && value !== ''
}
