import { BoxProps, Group } from '@mantine/core'

import { TelegramControl } from './TelegramControl'
import { LanguageControl } from './LanguageControl'
import { SupportControl } from './SupportControl'
import { RefreshControl } from './RefreshControl'
import { GithubControl } from './GithubControl'
import { LogoutControl } from './LogoutControl'

interface HeaderControlsProps extends BoxProps {
    githubLink?: string
    isGithubLoading?: boolean
    stars?: number
    telegramLink: string
    withGithub?: boolean
    withLanguage?: boolean
    withLogout?: boolean
    withRefresh?: boolean
    withSupport?: boolean
    withTelegram?: boolean
}

export function HeaderControls({
    githubLink,
    withGithub = true,
    withTelegram = true,
    withSupport = true,
    withLogout = true,
    withRefresh = true,
    withLanguage = true,
    telegramLink,
    stars,
    isGithubLoading,
    ...others
}: HeaderControlsProps) {
    return (
        <Group gap="xs" {...others}>
            {withTelegram && <TelegramControl link={telegramLink} />}
            {withSupport && <SupportControl />}
            {withGithub && (
                <GithubControl isLoading={isGithubLoading} link={githubLink!} stars={stars} />
            )}
            {withLanguage && <LanguageControl />}
            {withRefresh && <RefreshControl />}
            {withLogout && <LogoutControl />}
        </Group>
    )
}
