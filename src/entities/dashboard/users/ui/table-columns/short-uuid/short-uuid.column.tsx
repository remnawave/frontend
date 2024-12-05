import { CopyButton } from '@mantine/core'
import { LuCopy } from 'react-icons/lu'

import { IProps } from '@entities/dashboard/users/ui/table-columns/username/interface'
import { LinkChip } from '@shared/ui/stuff/link-chip'

export function ShortUuidColumnEntity(props: IProps) {
    const { user } = props

    const shortDisplay = user.shortUuid.slice(0, 5)

    return (
        <CopyButton value={user.shortUuid}>
            {({ copied, copy }) => (
                <LinkChip checked={copied} icon={<LuCopy />} inline onClick={copy}>
                    {shortDisplay}...
                </LinkChip>
            )}
        </CopyButton>
    )
}
