import { RESET_PERIODS } from '@remnawave/backend-contract';
import prettyBytes from 'pretty-bytes';
import { LuCopy } from 'react-icons/lu';
import { Box, Button, Chip, CopyButton, Group, Indicator, Progress, Text } from '@mantine/core';
import { IProps } from '@/entitites/dashboard/users/ui/table-columns/username/interface';
import { LinkChip } from '@/shared/ui/stuff/link-chip';

export function ShortUuidColumnEntity(props: IProps) {
    const { user } = props;
    const shortDisplay = user.shortUuid.slice(0, 5);

    return (
        <CopyButton
            value={user.shortUuid} // копируется полное значение
        >
            {({ copied, copy }) => (
                <LinkChip inline onClick={copy} checked={copied} icon={<LuCopy />}>
                    {shortDisplay}...
                </LinkChip>
            )}
        </CopyButton>
    );
}
