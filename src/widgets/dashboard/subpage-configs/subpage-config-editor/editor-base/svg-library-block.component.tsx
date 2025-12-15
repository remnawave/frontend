import { TSubscriptionPageRawConfig } from '@remnawave/subscription-page-types'
import { Badge, Button, Card, Divider, Group, Stack } from '@mantine/core'
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

    return (
        <>
            <Card className={styles.sectionCard} p="lg" radius="lg">
                <Stack gap="md">
                    <Group justify="space-between">
                        <BaseOverlayHeader
                            IconComponent={IconPhoto}
                            iconSize={20}
                            iconVariant="gradient-violet"
                            subtitle={t(
                                'subpage-config-visual-editor.widget.manage-your-svg-icons'
                            )}
                            title={t('svg-library-modal.component.svg-library')}
                            titleOrder={5}
                        />
                        <Badge color="violet" size="sm" variant="light">
                            {Object.keys(values.svgLibrary || {}).length} icons
                        </Badge>
                    </Group>

                    <Divider className={styles.divider} />

                    <Button
                        className={styles.addButton}
                        fullWidth
                        leftSection={<IconPhoto size={16} />}
                        onClick={openSvgLibrary}
                        variant="default"
                    >
                        {t('subpage-config-visual-editor.widget.open-svg-library')}
                    </Button>
                </Stack>
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
