import NiceModal from '@ebay/nice-modal-react'
import { ComponentType, FC, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Outlet } from 'react-router'

export interface ErrorBoundaryFallbackProps {
    componentStack: null | string
    error: unknown
    resetErrorBoundary: () => void
}

interface IProps {
    FallbackComponent: ComponentType<ErrorBoundaryFallbackProps>
}

export const ErrorBoundaryHoc: FC<IProps> = ({ FallbackComponent }) => {
    const [componentStack, setComponentStack] = useState<null | string>(null)

    return (
        <ErrorBoundary
            fallbackRender={({ error, resetErrorBoundary }) => (
                <FallbackComponent
                    componentStack={componentStack}
                    error={error}
                    resetErrorBoundary={resetErrorBoundary}
                />
            )}
            onError={(_error, info) => setComponentStack(info.componentStack ?? null)}
        >
            <NiceModal.Provider>
                <Outlet />
            </NiceModal.Provider>
        </ErrorBoundary>
    )
}
