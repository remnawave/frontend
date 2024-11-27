import { fromBytes } from '@tsmx/human-readable';
import prettyBytes from 'pretty-bytes';
import xbytes from 'xbytes';

export function bytesToGbUtil(bytesInput: number | undefined | string): number | undefined {
    if (!bytesInput) return undefined;
    if (typeof bytesInput === 'string') {
        bytesInput = Number(bytesInput);
    }
    const res = xbytes.parseBytes(bytesInput, {
        sticky: true,
        prefixIndex: 3,
        iec: true,
        space: false,
    });

    return Number(res.size.replace('GiB', ''));
}
