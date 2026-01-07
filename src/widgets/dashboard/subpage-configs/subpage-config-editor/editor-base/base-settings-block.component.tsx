import {
    ActionIcon,
    Card,
    Checkbox,
    Divider,
    Group,
    SimpleGrid,
    Stack,
    Text,
    TextInput,
    ThemeIcon
} from '@mantine/core'
import { TSubscriptionPageRawConfig } from '@remnawave/subscription-page-types'
import { TbHealthRecognition, TbKey, TbLink } from 'react-icons/tb'
import { HiQuestionMarkCircle } from 'react-icons/hi'
import { UseFormReturnType } from '@mantine/form'
import { useTranslation } from 'react-i18next'

import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'

import styles from '../subpage-config-visual-editor.module.css'

interface IProps {
    form: UseFormReturnType<TSubscriptionPageRawConfig>
}

export function BaseSettingsBlockComponent({ form }: IProps) {
    const { t } = useTranslation()

    return (
        <Card className={styles.sectionCard} p="lg" radius="lg">
            <Stack gap="md">
                <BaseOverlayHeader
                    IconComponent={TbHealthRecognition}
                    iconSize={20}
                    iconVariant="gradient-teal"
                    title={t('base-settings-block.component.base-settings')}
                    titleOrder={5}
                />

                <Divider className={styles.divider} />

                <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
                    <TextInput
                        key={form.key('baseSettings.metaTitle')}
                        label={t('base-settings-block.component.meta-title')}
                        required
                        {...form.getInputProps('baseSettings.metaTitle')}
                    />

                    <TextInput
                        key={form.key('baseSettings.metaDescription')}
                        label={t('base-settings-block.component.meta-description')}
                        required
                        {...form.getInputProps('baseSettings.metaDescription')}
                    />

                    <Checkbox.Card
                        key={form.key('baseSettings.showConnectionKeys')}
                        p="md"
                        radius="md"
                        {...form.getInputProps('baseSettings.showConnectionKeys', {
                            type: 'checkbox'
                        })}
                    >
                        <Group justify="space-between" wrap="nowrap">
                            <Group gap="sm" wrap="nowrap">
                                <ThemeIcon size="lg" variant="gradient-cyan">
                                    <TbKey size={20} />
                                </ThemeIcon>
                                <Stack gap={2}>
                                    <Group gap={4}>
                                        <Text fw={600} size="sm">
                                            {t(
                                                'base-settings-block.component.show-connection-keys'
                                            )}
                                        </Text>
                                        <ActionIcon
                                            color="gray"
                                            component="a"
                                            href="https://docs.rw/docs/install/subscription-page/display-raw-keys"
                                            onClick={(e) => e.stopPropagation()}
                                            rel="noopener noreferrer"
                                            size="xs"
                                            target="_blank"
                                            variant="subtle"
                                        >
                                            <HiQuestionMarkCircle size={24} />
                                        </ActionIcon>
                                    </Group>
                                    <Text c="dimmed" size="xs">
                                        {t(
                                            'base-settings-block.component.show-or-hide-raw-connection-keys'
                                        )}
                                    </Text>
                                </Stack>
                            </Group>
                            <Checkbox.Indicator color="cyan.8" size="md" />
                        </Group>
                    </Checkbox.Card>

                    <Checkbox.Card
                        key={form.key('baseSettings.hideGetLinkButton')}
                        p="md"
                        radius="md"
                        {...form.getInputProps('baseSettings.hideGetLinkButton', {
                            type: 'checkbox'
                        })}
                    >
                        <Group justify="space-between" wrap="nowrap">
                            <Group gap="sm" wrap="nowrap">
                                <ThemeIcon size="lg" variant="gradient-cyan">
                                    <TbLink size={20} />
                                </ThemeIcon>
                                <Stack gap={2}>
                                    <Group gap={4}>
                                        <Text fw={600} size="sm">
                                            {t(
                                                'base-settings-block.component.hide-get-link-button'
                                            )}
                                        </Text>
                                    </Group>
                                    <Text c="dimmed" size="xs">
                                        {t(
                                            'base-settings-block.component.hide-the-get-link-button-top-right-corner'
                                        )}
                                    </Text>
                                </Stack>
                            </Group>
                            <Checkbox.Indicator color="cyan.8" size="md" />
                        </Group>
                    </Checkbox.Card>
                </SimpleGrid>
            </Stack>
        </Card>
    )
}
