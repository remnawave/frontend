import { TSubscriptionPageTemplateKey } from '@remnawave/subscription-page-types'
import { TEMPLATE_KEYS, TemplateKeys } from '@remnawave/backend-contract'
import { ActionIcon, SimpleGrid, Stack, Text } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from '@mantine/hooks'
import { TbInfoSquare } from 'react-icons/tb'
import { modals } from '@mantine/modals'

import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { CopyableCodeBlock } from '@shared/ui/copyable-code-block'

interface IProps {
    templateKeys?: readonly TemplateKeys[] | readonly TSubscriptionPageTemplateKey[]
}

export const TemplateInfoPopoverShared = (props: IProps) => {
    const { templateKeys = TEMPLATE_KEYS } = props

    const isMobile = useMediaQuery('(max-width: 768px)')

    const { t } = useTranslation()

    const handleClick = () => {
        modals.open({
            children: (
                <Stack>
                    <Text size="sm">
                        {t(
                            'template-info-popover.shared.you-can-use-template-variables-in-this-field'
                        )}
                        <br />
                        {t('template-info-popover.shared.available-variables-are-listed-below')}
                    </Text>

                    <SimpleGrid cols={{ base: 1, xs: 2 }} key="template-keys" spacing="xs">
                        {templateKeys.map((key) => (
                            <CopyableCodeBlock key={key} size="small" value={`{{${key}}}`} />
                        ))}
                    </SimpleGrid>
                </Stack>
            ),
            size: 'auto',
            fullScreen: isMobile,
            title: (
                <BaseOverlayHeader
                    IconComponent={TbInfoSquare}
                    iconVariant="gradient-lime"
                    title={t('template-info-popover.shared.template-variables')}
                />
            )
        })
    }

    return (
        <ActionIcon color="lime" onClick={handleClick} variant="transparent">
            <TbInfoSquare size="20px" />
        </ActionIcon>
    )
}
