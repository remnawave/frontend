import { Button, PinInput, Stack, Text } from '@mantine/core'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TbKey } from 'react-icons/tb'

import { isValidPasscode, PASSCODE_MAX_LENGTH } from '@entities/ssh-vault'

interface IProps {
    onSubmit: (passcode: string) => Promise<void>
    submitLabel: string
}

export const PasscodeForm = (props: IProps) => {
    const { onSubmit, submitLabel } = props
    const { t } = useTranslation()

    const [passcode, setPasscode] = useState('')
    const [isBusy, setIsBusy] = useState(false)

    const isReady = isValidPasscode(passcode)
    const isRejected = passcode.length === PASSCODE_MAX_LENGTH && !isReady

    const submit = async () => {
        setIsBusy(true)
        try {
            await onSubmit(passcode)
        } finally {
            setIsBusy(false)
        }
    }

    return (
        <Stack align="center" gap="md">
            <PinInput
                error={isRejected}
                length={PASSCODE_MAX_LENGTH}
                mask
                onChange={setPasscode}
                placeholder=""
                size="md"
                success={isReady}
                value={passcode}
            />

            <Text c={isRejected ? 'red' : 'dimmed'} size="xs" ta="center">
                {t(isRejected ? 'node-ssh.passcode-needs-letter' : 'node-ssh.passcode-length', {
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
