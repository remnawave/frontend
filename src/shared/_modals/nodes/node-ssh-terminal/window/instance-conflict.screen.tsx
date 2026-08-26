import { Center } from '@mantine/core'
import { TbBrowserX } from 'react-icons/tb'

import { EmptyPageLayout } from '@shared/ui/layouts/empty-page'

export const InstanceConflictScreen = () => (
    <Center flex={1} p="md">
        <EmptyPageLayout icon={<TbBrowserX size={32} />} title="Already open in another tab" />
    </Center>
)
