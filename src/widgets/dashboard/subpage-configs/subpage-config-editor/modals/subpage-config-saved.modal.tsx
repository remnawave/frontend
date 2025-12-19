import { Code, Stack, Text } from '@mantine/core'
import { modals } from '@mantine/modals'
import { TbCheck } from 'react-icons/tb'
import { TFunction } from 'i18next'

import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'

export const showSubpageConfigSavedModal = (t: TFunction) =>
    modals.open({
        title: (
            <BaseOverlayHeader
                IconComponent={TbCheck}
                iconSize={20}
                iconVariant="gradient-teal"
                title={t('subpage-config-visual-editor.widget.configuration-saved-successfully')}
                titleOrder={5}
            />
        ),
        children: (
            <Stack gap="xs">
                <Stack gap={4}>
                    <Text fw={700}>
                        {t('subpage-config-visual-editor.subpage-config-saved-line-1')}
                    </Text>
                    <Text>{t('subpage-config-visual-editor.subpage-config-saved-line-2')}</Text>
                    <Code block mt={4}>
                        docker restart remnawave-subscription-page
                    </Code>
                </Stack>
            </Stack>
        )
    })
