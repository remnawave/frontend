import { z } from 'zod'

const uuidSchema = z.uuid()

export function isDefined(value: unknown): value is NonNullable<typeof value> {
    return value !== null && value !== undefined && value !== ''
}

export function isValidUuid(value: string): boolean {
    return uuidSchema.safeParse(value).success
}
