import { notifications } from '@mantine/notifications'
import { BiLogoTelegram } from 'react-icons/bi'
import { Avatar, Button } from '@mantine/core'

import { useTelegramCallback } from '@shared/api/hooks'
import { useAuth } from '@shared/hooks/use-auth'

import { IProps } from './interfaces/props.interface'

export const TelegramLoginButtonFeature = (props: IProps) => {
    const { tgAuth } = props

    const { mutate: telegramCallback, isPending } = useTelegramCallback()

    const { setIsAuthenticated } = useAuth()

    if (!tgAuth) {
        return null
    }

    const handleTelegramLogin = (data: false | ITelegramData) => {
        if (data) {
            telegramCallback(
                {
                    variables: {
                        id: data.id,
                        first_name: data.first_name,
                        last_name: data.last_name,
                        username: data.username,
                        auth_date: data.auth_date,
                        hash: data.hash,
                        photo_url: data.photo_url
                    }
                },
                {
                    onError: (error) => {
                        notifications.show({
                            title: 'Login',
                            message: error.message,
                            color: 'red'
                        })
                    },
                    onSuccess: () => {
                        notifications.show({
                            icon: (
                                <Avatar
                                    name={data.username ? `${data.username}` : data.first_name}
                                    src={data.photo_url}
                                    variant="filled"
                                />
                            ),
                            message: `Logged as ${data.username ? `@${data.username}` : data.first_name}`,
                            withBorder: true
                        })

                        setIsAuthenticated(true)
                    }
                }
            )
        }
    }

    const handleLogin = () => {
        window.Telegram.Login.auth(
            { bot_id: tgAuth.botId.toString(), request_access: true },
            handleTelegramLogin
        )
    }

    return (
        <Button
            color={'#0088cc'}
            leftSection={<BiLogoTelegram color={'white'} size={20} />}
            loaderProps={{ type: 'dots' }}
            loading={isPending}
            onClick={handleLogin}
            radius={'md'}
            variant="filled"
        >
            Telegram
        </Button>
    )
}
