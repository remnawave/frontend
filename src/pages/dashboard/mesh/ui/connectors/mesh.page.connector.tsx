import { useGetMeshStatus } from '@shared/api/hooks'

import MeshPageComponent from '../components/mesh.page.component'

export function MeshPageConnector() {
    const query = useGetMeshStatus()
    return (
        <MeshPageComponent
            status={query.data}
            isError={query.isError}
            isLoading={query.isLoading}
        />
    )
}
