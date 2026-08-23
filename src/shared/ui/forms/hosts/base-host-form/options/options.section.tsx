import { Divider, Group, Stack } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { PiListChecks } from 'react-icons/pi'

import { useDrawerStickyOffset } from '@shared/hooks'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { SectionCard } from '@shared/ui/section-card'

import { AddOptionButton } from './add-option-button'
import {
    HOST_OPTION_FIELDS,
    HOST_OPTION_GROUPS,
    HOST_OPTION_NAMES_BY_GROUP
} from './host-option-fields'
import { useHostOptions } from './host-options.context'
import { OptionField, OptionGroup } from './option-field'
import { OptionsEmptyState } from './options-empty-state'
import classes from './Options.module.css'

export function HostOptionsSection() {
    const { inactiveFields } = useHostOptions()
    const { t } = useTranslation()

    const headerRef = useDrawerStickyOffset()

    const isEmpty = inactiveFields.length === HOST_OPTION_FIELDS.length

    return (
        <SectionCard.Root allDividers={false} style={{ overflow: 'visible' }}>
            <SectionCard.Section className={classes.stickyHeader} ref={headerRef}>
                <Stack gap="md">
                    <Group gap="sm" justify="space-between">
                        <BaseOverlayHeader
                            iconColor="teal"
                            IconComponent={PiListChecks}
                            iconVariant="soft"
                            title={t('base-host-form.options')}
                            titleOrder={5}
                        />

                        <AddOptionButton />
                    </Group>

                    <Divider style={{ opacity: 0.3 }} />
                </Stack>
            </SectionCard.Section>

            <SectionCard.Section>
                {isEmpty ? (
                    <OptionsEmptyState />
                ) : (
                    <Stack gap="md">
                        {HOST_OPTION_GROUPS.map((group) => {
                            const names = HOST_OPTION_NAMES_BY_GROUP.get(group) ?? []

                            return (
                                <OptionGroup key={group} names={names}>
                                    <Divider
                                        label={t(`base-host-form.${group}` as never)}
                                        labelPosition="left"
                                        mb={6}
                                    />

                                    {names.map((name) => (
                                        <OptionField key={name} name={name} />
                                    ))}
                                </OptionGroup>
                            )
                        })}
                    </Stack>
                )}
            </SectionCard.Section>
        </SectionCard.Root>
    )
}
