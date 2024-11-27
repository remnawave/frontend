import { z } from 'zod';

export const booleanSchema = z
    .union([z.boolean(), z.literal('true'), z.literal('false')])
    .transform((value) => value === true || value === 'true');
