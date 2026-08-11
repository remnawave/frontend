import { useGetAcmeCertificates, useGetAcmeCredentials, useGetNodes } from '@shared/api/hooks'
import { LoadingScreen } from '@shared/ui'

import { AcmePageComponent } from '../components/acme-page.component'

export function AcmePageConnector() {
    const { data: credentials, isLoading: isCredentialsLoading } = useGetAcmeCredentials({})
    const { data: certificates, isLoading: isCertificatesLoading } = useGetAcmeCertificates({})
    const { data: nodes, isLoading: isNodesLoading } = useGetNodes()

    if (
        isCredentialsLoading ||
        isCertificatesLoading ||
        isNodesLoading ||
        !credentials ||
        !certificates ||
        !nodes
    ) {
        return <LoadingScreen text="Loading certificates..." />
    }

    return (
        <AcmePageComponent
            certificates={certificates.certificates}
            credentials={credentials.credentials}
            nodes={nodes}
        />
    )
}
