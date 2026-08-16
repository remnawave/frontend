import { Stack, ThemeIconProps } from '@mantine/core'
import { modals } from '@mantine/modals'
import { t } from 'i18next'
import { IconType } from 'react-icons'
import { TbDeviceFloppy, TbRocket } from 'react-icons/tb'

import { ActionCardShared } from '@shared/ui'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'

interface IProps {
    IconComponent: IconType
    delay?: number
    iconColor?: ThemeIconProps['color']
    onApply: () => void
    onLater?: () => void
}

export const openApplyToNodesModal = (props: IProps) => {
    const { IconComponent, iconColor = 'teal', onApply, onLater, delay = 0 } = props

    const open = () =>
        modals.open({
            title: (
                <BaseOverlayHeader
                    iconColor={iconColor}
                    IconComponent={IconComponent}
                    iconVariant="soft"
                    title={t('apply-to-nodes.title')}
                />
            ),
            centered: true,
            size: 'md',
            children: (
                <Stack gap="sm">
                    <ActionCardShared
                        description={t('apply-to-nodes.apply-description')}
                        icon={<TbRocket size={22} />}
                        iconColor="teal"
                        onClick={() => {
                            onApply()
                            modals.closeAll()
                        }}
                        title={t('apply-to-nodes.apply')}
                        variant="soft"
                    />

                    <ActionCardShared
                        description={t('apply-to-nodes.later-description')}
                        icon={<TbDeviceFloppy size={22} />}
                        iconColor="gray"
                        onClick={() => {
                            onLater?.()
                            modals.closeAll()
                        }}
                        title={t('apply-to-nodes.later')}
                        variant="soft"
                    />
                </Stack>
            )
        })

    if (delay > 0) {
        setTimeout(open, delay)
        return
    }

    open()
}
