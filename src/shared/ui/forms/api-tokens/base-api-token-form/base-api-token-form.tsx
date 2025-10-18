import { CreateApiTokenCommand } from '@remnawave/backend-contract'
import { Button, Group, Stack, TextInput } from '@mantine/core'
import { PiFloppyDiskDuotone } from 'react-icons/pi'
import { useTranslation } from 'react-i18next'

import { IProps } from './interfaces'

export const BaseApiTokenForm = <T extends CreateApiTokenCommand.Request>(props: IProps<T>) => {
    const { form, handleSubmit, isCreateApiTokenPending } = props

    const { t } = useTranslation()

    return (
        <form onSubmit={handleSubmit}>
            <Stack gap="md">
                <TextInput
                    key={form.key('tokenName')}
                    label={t('base-api-token-form.token-name')}
                    {...form.getInputProps('tokenName')}
                    required
                />
            </Stack>

            <Group gap="xs" justify="end" pt={15} w="100%">
                <Button
                    color="teal"
                    leftSection={<PiFloppyDiskDuotone size="16px" />}
                    loading={isCreateApiTokenPending}
                    type="submit"
                >
                    {t('base-api-token-form.create')}
                </Button>
            </Group>
        </form>
    )
}
