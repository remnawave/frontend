import { TbAlertTriangle } from 'react-icons/tb'
import { Stack, Text } from '@mantine/core'
import { modals } from '@mantine/modals'

import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'

export const showValidationErrorsModal = (errors: { message: string; path: string }[]) => {
    modals.open({
        title: (
            <BaseOverlayHeader
                IconComponent={TbAlertTriangle}
                iconSize={20}
                iconVariant="gradient-red"
                title="Validation Error"
                titleOrder={5}
            />
        ),
        children: (
            <Stack gap="sm" p="sm">
                <Stack gap={2} mt="xs">
                    {errors.map((err, idx) => (
                        <Text c="red" key={idx} size="sm">
                            • {err.path ? `${err.path}: ` : ''}
                            {err.message}
                        </Text>
                    ))}
                </Stack>
            </Stack>
        ),
        centered: true,
        size: 'lg'
    })
}
