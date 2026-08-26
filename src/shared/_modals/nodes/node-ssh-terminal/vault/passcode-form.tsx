import { Button, Stack, Text } from '@mantine/core'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TbKey } from 'react-icons/tb'

import { PASSCODE_MAX_LENGTH, describeVaultError, isValidPasscode } from '@entities/ssh-vault'

import { PasscodeInput } from './passcode-input'

interface IProps {
    onSubmit: (passcode: string) => Promise<void>
    submitLabel: string
}

export const PasscodeForm = (props: IProps) => {
    const { onSubmit, submitLabel } = props
    const { t } = useTranslation()

    const [passcode, setPasscode] = useState('')
    const [isBusy, setIsBusy] = useState(false)
    const [submitError, setSubmitError] = useState<null | string>(null)

    const isReady = isValidPasscode(passcode)
    const isRejected = passcode.length === PASSCODE_MAX_LENGTH && !isReady

    const submit = async () => {
        setSubmitError(null)
        setIsBusy(true)
        try {
            await onSubmit(passcode)
        } catch (error) {
            setPasscode('')
            setSubmitError(describeVaultError(error))
        } finally {
            setIsBusy(false)
        }
    }

    return (
        <Stack align="center" gap="md">
            <PasscodeInput
                error={isRejected || Boolean(submitError)}
                length={PASSCODE_MAX_LENGTH}
                onChange={setPasscode}
                success={isReady}
                value={passcode}
            />

            <Text c={isRejected || submitError ? 'red' : 'dimmed'} size="xs" ta="center">
                {submitError ??
                    t(isRejected ? 'node-ssh.passcode-needs-letter' : 'node-ssh.passcode-length', {
                        length: PASSCODE_MAX_LENGTH
                    })}
            </Text>

            <Button
                disabled={!isReady}
                fullWidth
                leftSection={<TbKey size={16} />}
                loading={isBusy}
                onClick={() => void submit()}
                variant="soft"
            >
                {submitLabel}
            </Button>
        </Stack>
    )
}
