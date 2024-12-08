import { AnimatePresence } from 'framer-motion'

import { EmptyPageLayout } from '@shared/ui/layouts/empty-page'

import { ApiTokenCardWidget } from '../api-token-card'
import { IProps } from './interfaces'

export function ApiTokensTableWidget(props: IProps) {
    const { apiTokens } = props

    if (!apiTokens) {
        return null
    }

    return (
        <AnimatePresence initial={false} mode="popLayout">
            {apiTokens.length === 0 ? (
                <EmptyPageLayout key="empty" />
            ) : (
                apiTokens.map((apiToken) => (
                    <ApiTokenCardWidget apiToken={apiToken} key={apiToken.uuid} />
                ))
            )}
        </AnimatePresence>
    )
}
