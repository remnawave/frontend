import { Button, Group, Stack, Textarea, TextInput } from '@mantine/core'
import { CreateApiTokenCommand } from '@remnawave/backend-contract'
import { PiFloppyDiskDuotone } from 'react-icons/pi'

import { IProps } from './interfaces'

export const BaseApiTokenForm = <T extends CreateApiTokenCommand.Request>(props: IProps<T>) => {
    const { form, handleSubmit, isCreateApiTokenPending } = props

    return (
        <form onSubmit={handleSubmit}>
            <Stack gap="md">
                <TextInput
                    key={form.key('tokenName')}
                    label="Token name"
                    {...form.getInputProps('tokenName')}
                    required
                />

                <Textarea
                    key={form.key('tokenDescription')}
                    label="Token description"
                    {...form.getInputProps('tokenDescription')}
                    required
                />
            </Stack>

            <Group gap="xs" justify="end" pt={15} w="100%">
                <Button
                    color="blue"
                    leftSection={<PiFloppyDiskDuotone size="1rem" />}
                    loading={isCreateApiTokenPending}
                    size="md"
                    type="submit"
                    variant="outline"
                >
                    Create
                </Button>
            </Group>
        </form>
    )
}
