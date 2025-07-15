import { Badge, CopyButton, Group, Popover, Text } from '@mantine/core'
import { TEMPLATE_KEYS } from '@remnawave/backend-contract'
import { PiCheck, PiCopy, PiInfo } from 'react-icons/pi'
import { useTranslation } from 'react-i18next'

import { IProps } from './interfaces/props.interface'

export const TemplateInfoPopoverShared = (props: IProps) => {
    const { showHostDescription = true } = props
    const { t } = useTranslation()

    return (
        <Popover offset={10} position="left" shadow="md" width={200} withArrow>
            <Popover.Target>
                <span
                    style={{
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    <PiInfo size="20px" />
                </span>
            </Popover.Target>
            <Popover.Dropdown>
                <Group gap="xs" pb="xs">
                    {showHostDescription && (
                        <Text size="sm">{t('remark-info.widget.remark-description')}</Text>
                    )}
                    <Text size="sm">{t('remark-info.widget.supports-templates')}</Text>

                    <Group gap="xs" key="template-keys">
                        {TEMPLATE_KEYS.map((key) => (
                            <CopyButton key={key} value={`{{${key}}}`}>
                                {({ copied, copy }) => (
                                    <Badge
                                        color={copied ? 'teal' : 'blue'}
                                        key={key}
                                        leftSection={
                                            copied ? (
                                                <PiCheck size="16px" />
                                            ) : (
                                                <PiCopy size="16px" />
                                            )
                                        }
                                        onClick={copy}
                                        size="md"
                                    >
                                        {`{{${key}}}`}
                                    </Badge>
                                )}
                            </CopyButton>
                        ))}
                    </Group>
                </Group>
            </Popover.Dropdown>
        </Popover>
    )
}
