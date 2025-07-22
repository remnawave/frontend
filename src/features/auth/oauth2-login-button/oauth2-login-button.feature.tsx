import { TOAuth2ProvidersKeys } from '@remnawave/backend-contract'
import { BiLogoGithub } from 'react-icons/bi'
import { Button, Stack } from '@mantine/core'

import { useOAuth2Authorize } from '@shared/api/hooks'

import { IProps } from './interfaces/props.interface'

export const OAuth2LoginButtonsFeature = (props: IProps) => {
    const { oauth2 } = props

    const { mutate: oauth2AuthorizePocketid, isPending: isPendingPocketid } = useOAuth2Authorize({
        mutationFns: {
            onSuccess: (data) => {
                if (data.authorizationUrl) {
                    window.location.assign(data.authorizationUrl)
                }
            }
        }
    })
    const { mutate: oauth2AuthorizeGithub, isPending: isPendingGithub } = useOAuth2Authorize({
        mutationFns: {
            onSuccess: (data) => {
                if (data.authorizationUrl) {
                    window.location.assign(data.authorizationUrl)
                }
            }
        }
    })

    const handleOAuth2Login = (provider: TOAuth2ProvidersKeys) => {
        switch (provider) {
            case 'github':
                oauth2AuthorizeGithub({
                    variables: {
                        provider
                    }
                })
                break
            case 'pocketid':
                oauth2AuthorizePocketid({
                    variables: {
                        provider
                    }
                })
                break
            default:
                break
        }
    }

    return (
        <Stack>
            {oauth2.providers.pocketid && (
                <Button
                    color="dark"
                    leftSection={
                        <svg
                            height={20}
                            viewBox="0 0 1015 1015"
                            width={20}
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M506.6,0c209.52,0,379.98,170.45,379.98,379.96,0,82.33-25.9,160.68-74.91,226.54-48.04,64.59-113.78,111.51-190.13,135.71l-21.1,6.7-50.29-248.04,13.91-6.73c45.41-21.95,74.76-68.71,74.76-119.11,0-72.91-59.31-132.23-132.21-132.23s-132.23,59.32-132.23,132.23c0,50.4,29.36,97.16,74.77,119.11l13.65,6.61-81.01,499.24h-226.36V0h351.18Z"
                                fill="white"
                            />
                        </svg>
                    }
                    loaderProps={{ type: 'dots' }}
                    loading={isPendingPocketid}
                    onClick={() => handleOAuth2Login('pocketid')}
                    radius={'md'}
                    variant="filled"
                >
                    PocketID
                </Button>
            )}

            {oauth2.providers.github && (
                <Button
                    color={'#24292e'}
                    leftSection={<BiLogoGithub color={'white'} size={20} />}
                    loaderProps={{ type: 'dots' }}
                    loading={isPendingGithub}
                    onClick={() => handleOAuth2Login('github')}
                    radius={'md'}
                    variant="filled"
                >
                    GitHub
                </Button>
            )}
        </Stack>
    )
}
