import { Stack, Text } from '@mantine/core'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ReactNode, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { SettingsRow, settingsRowClasses } from '@shared/ui/settings-row'

import { DimmedText, DocsHelp, HelpPopover } from './fields/help'
import { HOST_OPTION_FIELD_BY_NAME } from './host-option-fields'
import { useHostOptions } from './host-options.context'

const ROW_GAP_TOP = 10
const ROW_SLACK_BOTTOM = 2
const ROW_BLEED = 4
const TRANSITION = { duration: 0.18, ease: 'easeOut' } as const

export function OptionField(props: { name: string }) {
    const { name } = props
    const { isActive, isBulkEdit, isFilled, justAdded, remove } = useHostOptions()

    const field = HOST_OPTION_FIELD_BY_NAME.get(name)
    const ref = useRef<HTMLDivElement>(null)
    const reduceMotion = useReducedMotion()
    const isSettling = justAdded === name

    const isVisible = !!field && isActive(name)

    return (
        <AnimatePresence initial={false}>
            {isVisible && field && (
                <motion.div
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    initial={{ height: 0, opacity: 0 }}
                    key={name}
                    onAnimationComplete={() => {
                        if (isSettling) {
                            ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                        }
                    }}
                    style={{ overflow: 'hidden' }}
                    transition={reduceMotion ? { duration: 0 } : TRANSITION}
                >
                    <div
                        className={isSettling ? settingsRowClasses.settling : undefined}
                        ref={ref}
                        style={{
                            marginInline: -ROW_BLEED,
                            paddingBottom: ROW_SLACK_BOTTOM,
                            paddingInline: ROW_BLEED,
                            paddingTop: ROW_GAP_TOP
                        }}
                    >
                        <OptionRow
                            field={field}
                            isBulkEdit={isBulkEdit}
                            isFilled={isFilled(name)}
                            onRemove={() => remove(name)}
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

interface IRowProps {
    field: NonNullable<ReturnType<typeof HOST_OPTION_FIELD_BY_NAME.get>>
    isBulkEdit: boolean
    isFilled: boolean
    onRemove: () => void
}

function OptionRow(props: IRowProps) {
    const { field, isBulkEdit, isFilled, onRemove } = props
    const { t } = useTranslation()
    const { Component, HeaderControl, helpDocsUrl, helpKey, plainLabel, Help, kind, labelKey } =
        field

    const willClear = isBulkEdit && !isFilled

    const description = willClear ? (
        <Text c="orange.4" inherit span>
            {t('base-host-form.bulk-option-will-be-cleared')}
        </Text>
    ) : undefined

    let help: ReactNode

    if (Help) {
        help = <Help />
    } else if (helpKey) {
        help = (
            <HelpPopover docsUrl={helpDocsUrl}>
                <DimmedText>{t(helpKey)}</DimmedText>
            </HelpPopover>
        )
    } else if (helpDocsUrl) {
        help = <DocsHelp url={helpDocsUrl} />
    }

    return (
        <SettingsRow
            description={description}
            headerControl={HeaderControl ? <HeaderControl /> : undefined}
            help={help}
            label={t(labelKey)}
            labelElement={plainLabel ? 'div' : 'label'}
            layout={kind}
            onReset={onRemove}
            resetLabel={
                isBulkEdit
                    ? t('base-host-form.leave-field-untouched')
                    : t('common.action.remove')
            }
        >
            <Component />
        </SettingsRow>
    )
}

export function OptionGroup(props: { children: ReactNode; names: string[] }) {
    const { children, names } = props
    const { isActive } = useHostOptions()
    const reduceMotion = useReducedMotion()

    const isVisible = names.some((name) => isActive(name))

    return (
        <AnimatePresence initial={false}>
            {isVisible && (
                <motion.div
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    initial={{ height: 0, opacity: 0 }}
                    style={{ overflow: 'hidden' }}
                    transition={reduceMotion ? { duration: 0 } : TRANSITION}
                >
                    <Stack gap={0}>{children}</Stack>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
