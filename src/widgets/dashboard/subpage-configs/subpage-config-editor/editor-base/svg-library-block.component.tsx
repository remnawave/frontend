import { TSubscriptionPageRawConfig } from '@remnawave/subscription-page-types'
import { Badge, Button, Card, Group } from '@mantine/core'
import { UseFormReturnType } from '@mantine/form'
import { IconPhoto } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { useDisclosure } from '@mantine/hooks'

import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'

import { SvgLibraryModal } from '../editor-components/svg-library-modal.component'
import styles from '../subpage-config-visual-editor.module.css'

interface IProps {
    form: UseFormReturnType<TSubscriptionPageRawConfig>
}

export function SvgLibraryBlockComponent(props: IProps) {
    const { form } = props
    const values = form.getValues()
    const [svgLibraryOpened, { close: closeSvgLibrary, open: openSvgLibrary }] =
        useDisclosure(false)

    const { t } = useTranslation()

    const iconCount = Object.keys(values.svgLibrary || {}).length

    return (
        <>
            <Card className={styles.sectionCard} p="md" radius="lg">
                <Group justify="space-between" wrap="nowrap">
                    <Group gap="sm" wrap="nowrap">
                        <BaseOverlayHeader
                            IconComponent={IconPhoto}
                            iconSize={20}
                            iconVariant="gradient-violet"
                            title={t('svg-library-modal.component.svg-library')}
                            titleOrder={5}
                        />
                        <Badge color="violet" size="sm" variant="light">
                            {iconCount} icons
                        </Badge>
                    </Group>

                    <Button
                        className={styles.saveButton}
                        leftSection={<IconPhoto size={16} />}
                        onClick={openSvgLibrary}
                    >
                        {t('subpage-config-visual-editor.widget.open-svg-library')}
                    </Button>
                </Group>
            </Card>

            <SvgLibraryModal
                onChange={(library) => form.setFieldValue('svgLibrary', library)}
                onClose={closeSvgLibrary}
                opened={svgLibraryOpened}
                svgLibrary={values.svgLibrary}
            />
        </>
    )
}
