declare global {
    type ITelegramCallback = (dataOrFalse: false | ITelegramData) => void

    interface ITelegramData {
        auth_date: number
        first_name: string
        hash: string
        id: number
        last_name?: string
        photo_url?: string
        username?: string
    }

    interface ITelegramOptions {
        bot_id: string
        lang?: string
        request_access?: boolean
    }

    interface Window {
        Telegram: {
            Login: {
                auth(options: ITelegramOptions, callback: ITelegramCallback): void
            }
        }
    }
}

export {}
