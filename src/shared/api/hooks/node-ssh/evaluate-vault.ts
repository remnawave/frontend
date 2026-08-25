import { EvaluateVaultCommand } from '@remnawave/backend-contract'

import { instance } from '../../axios'

export const evaluateVault = async (blinded: string): Promise<string> => {
    const response = await instance.post<unknown>(EvaluateVaultCommand.TSQ_url, { blinded })
    const parsed = await EvaluateVaultCommand.ResponseSchema.safeParseAsync(response.data)

    if (!parsed.success) throw new Error('Malformed vault evaluation response')

    return parsed.data.response.evaluated
}
