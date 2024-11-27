import { IProps } from './interfaces';

export function DeleteUserFeature(props: IProps) {
    return (
        <Button
            type="button"
            variant="subtle"
            color="red"
            leftSection={<PiTrashDuotone size="1rem" />}
        >
            Delete
        </Button>
    );
}
