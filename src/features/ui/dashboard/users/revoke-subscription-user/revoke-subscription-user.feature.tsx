import { Button } from '@mantine/core';
import { IProps } from './interfaces';

export function RevokeSubscriptionUserFeature(props: IProps) {
    return (
        <Button type="button" variant="subtle" color="red">
            Revoke Subscription
        </Button>
    );
}
