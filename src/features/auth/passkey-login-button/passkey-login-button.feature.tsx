import {
    type PublicKeyCredentialRequestOptionsJSON,
    startAuthentication
} from '@simplewebauthn/browser'
import { GetStatusCommand } from '@remnawave/backend-contract'
import { notifications } from '@mantine/notifications'
import { TbFingerprint } from 'react-icons/tb'
import { Button } from '@mantine/core'
import { useState } from 'react'

import { usePasskeyAuthenticationOptions, usePasskeyAuthenticationVerify } from '@shared/api/hooks'
import { useAuth } from '@shared/hooks/use-auth'

interface IProps {
    authentication: NonNullable<GetStatusCommand.Response['response']['authentication']>
}

export const PasskeyLoginButtonFeature = (props: IProps) => {
    const { authentication } = props

    const [isLoading, setIsLoading] = useState(false)

    const { setIsAuthenticated } = useAuth()

    const { mutateAsync: verifyAuthentication, isPending } = usePasskeyAuthenticationVerify()
    const { refetch } = usePasskeyAuthenticationOptions()

    const handlePasskeyLogin = async () => {
        setIsLoading(true)

        try {
            const verificationOptions = await refetch()

            const authenticationResponse = await startAuthentication({
                optionsJSON: verificationOptions.data as PublicKeyCredentialRequestOptionsJSON
            })

            await verifyAuthentication(
                {
                    variables: {
                        response: authenticationResponse
                    }
                },
                {
                    onSuccess: () => {
                        setIsAuthenticated(true)
                    }
                }
            )
        } catch (error: unknown) {
            if (error instanceof Error) {
                if (error.name === 'NotAllowedError') {
                    notifications.show({
                        title: 'Passkey Authentication',
                        message: 'Authentication was cancelled',
                        color: 'yellow'
                    })
                } else if (error.name === 'NotSupportedError') {
                    notifications.show({
                        title: 'Passkey Authentication',
                        message: 'Passkeys are not supported on this device',
                        color: 'red'
                    })
                }
            }
        } finally {
            setIsLoading(false)
        }
    }

    if (!authentication.passkey.enabled) return null

    return (
        <Button
            color="dark"
            leftSection={<TbFingerprint color="white" size={20} />}
            loaderProps={{ type: 'dots' }}
            loading={isLoading || isPending}
            onClick={handlePasskeyLogin}
            variant="filled"
        >
            Passkey
        </Button>
    )
}
