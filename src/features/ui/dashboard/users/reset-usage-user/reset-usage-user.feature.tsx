import { PiClockCounterClockwiseDuotone } from 'react-icons/pi';
import { Button } from '@mantine/core';
import { IProps } from './interfaces';

export function ResetUsageUserFeature(props: IProps) {
    return (
        <Button
            type="button"
            variant="subtle"
            leftSection={<PiClockCounterClockwiseDuotone size="1rem" />}
        >
            Reset Usage
        </Button>
    );
}
