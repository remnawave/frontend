import xbytes from 'xbytes';

export function prettyBytesUtil(
    bytesInput: number | undefined | string,
    returnZero: boolean = false
): string | undefined {
    if (!bytesInput) {
        return returnZero ? '0' : undefined;
    }
    if (typeof bytesInput === 'string') {
        bytesInput = Number(bytesInput);
    }

    const res = xbytes.parseBytes(bytesInput, { sticky: true, prefixIndex: 3, iec: true });
    console.log(res);

    return String(res.size);
}
