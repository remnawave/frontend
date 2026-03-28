import { CreateHostCommand, UpdateHostCommand } from '@remnawave/backend-contract'
import { Anchor, Button, Drawer, JsonInput, Stack, Text } from '@mantine/core'
import { Trans, useTranslation } from 'react-i18next'
import { UseFormReturnType } from '@mantine/form'
import { TbMask } from 'react-icons/tb'

import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'

const FINAL_MASK_PLACEHOLDER = {
    tcp: [
        {
            type: '',
            settings: {}
        }
    ],
    udp: [
        {
            type: '',
            settings: {}
        }
    ],
    quicParams: {}
}
interface IProps<T extends CreateHostCommand.Request | UpdateHostCommand.Request> {
    close: () => void
    form: UseFormReturnType<T>
    opened: boolean
}

export const FinalMaskDrawer = <T extends CreateHostCommand.Request | UpdateHostCommand.Request>({
    close,
    opened,
    form
}: IProps<T>) => {
    const { t } = useTranslation()
    return (
        <Drawer
            onClose={close}
            opened={opened}
            padding="lg"
            position="right"
            size="lg"
            title={
                <BaseOverlayHeader
                    iconColor="teal"
                    IconComponent={TbMask}
                    iconVariant="soft"
                    title="Final Mask"
                />
            }
        >
            <Stack gap="md">
                <Text c="dimmed" size="sm">
                    <Trans
                        components={{
                            anchor: (
                                <Anchor
                                    href="https://xtls.github.io/ru/config/transport.html#finalmaskobject"
                                    rel="noopener noreferrer"
                                    target="_blank"
                                />
                            )
                        }}
                        i18nKey="base-host-form.final-mask-description"
                    />
                </Text>
                <Button onClick={close} size="md">
                    {t('common.close')}
                </Button>
                <JsonInput
                    autosize
                    formatOnBlur
                    key={form.key('finalMask')}
                    minRows={15}
                    placeholder={JSON.stringify(FINAL_MASK_PLACEHOLDER, null, 2)}
                    validationError={t('base-host-form.invalid-json')}
                    {...form.getInputProps('finalMask')}
                />
            </Stack>
        </Drawer>
    )
}
