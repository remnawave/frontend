import { BoxProps, Group } from '@mantine/core'

import { LanguageControl } from './LanguageControl'
import { TelegramControl } from './TelegramControl'
import { RefreshControl } from './RefreshControl'
import { SupportControl } from './SupportControl'
import { VersionControl } from './VersionControl'
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
    withVersion?: boolean
}

export function HeaderControls({
    githubLink,
    withGithub = true,
    withTelegram = true,
    withSupport = true,
    withLogout = true,
    withRefresh = true,
    withLanguage = true,
    withVersion = true,
    telegramLink,
    stars,
    isGithubLoading,
    ...others
}: HeaderControlsProps) {
    return (
        <Group gap="xs" {...others}>
            {withTelegram && <TelegramControl link={telegramLink} />}
            {withSupport && <SupportControl />}
            {withVersion && <VersionControl />}
            {withGithub && (
                <GithubControl isLoading={isGithubLoading} link={githubLink!} stars={stars} />
            )}
            {withLanguage && <LanguageControl />}
            {withRefresh && <RefreshControl />}
            {withLogout && <LogoutControl />}
        </Group>
    )
}
