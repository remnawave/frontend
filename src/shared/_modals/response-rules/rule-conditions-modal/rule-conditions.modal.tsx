import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { Divider, Modal, SegmentedControl, Stack, Text } from '@mantine/core'
import { useState } from 'react'
import { TbSitemap } from 'react-icons/tb'

import { useNiceMantineModal } from '@shared/_modals/use-nice-modal'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'

import { ConditionsGroup } from '../flow/conditions-tree'
import classes from '../flow/conditions.module.css'
import { RuleFlow } from '../flow/rule-flow'

type TView = 'flow' | 'list'

interface IRule {
    conditions?: unknown
    enabled?: unknown
    name?: unknown
    operator?: unknown
    responseType?: unknown
}

interface IProps {
    index: number
    rule: unknown
}

export const RuleConditionsModal = NiceModal.create((props: IProps) => {
    const { index } = props
    const rule = (props.rule && typeof props.rule === 'object' ? props.rule : {}) as IRule

    const modal = useModal()
    const { modalProps } = useNiceMantineModal({ modal })

    const [view, setView] = useState<TView>('flow')

    const conditions = Array.isArray(rule.conditions) ? rule.conditions : []
    const responseType = typeof rule.responseType === 'string' ? rule.responseType : ''
    const isDisabled = rule.enabled === false

    return (
        <Modal
            {...modalProps}
            size="xl"
            title={
                <BaseOverlayHeader
                    iconColor="cyan"
                    IconComponent={TbSitemap}
                    iconVariant="soft"
                    title="Rule conditions"
                />
            }
        >
            <Stack gap="sm">
                <div className={classes.summary}>
                    <Text c="cyan.4" ff="monospace" fw={700} size="sm">
                        #{index}
                    </Text>
                    <Text
                        c={isDisabled ? 'dimmed' : undefined}
                        fw={600}
                        td={isDisabled ? 'line-through' : undefined}
                        truncate
                    >
                        {typeof rule.name === 'string' && rule.name ? rule.name : '—'}
                    </Text>
                    {responseType && (
                        <Text c="dimmed" ff="monospace" size="xs">
                            → {responseType}
                        </Text>
                    )}
                    <SegmentedControl
                        data={[
                            { label: 'Flow', value: 'flow' },
                            { label: 'List', value: 'list' }
                        ]}
                        ml="auto"
                        onChange={(value) => setView(value as TView)}
                        size="xs"
                        value={view}
                    />
                </div>

                <Divider />

                {view === 'flow' ? (
                    <RuleFlow
                        conditions={conditions}
                        operator={rule.operator}
                        responseType={responseType}
                    />
                ) : (
                    <ConditionsGroup conditions={conditions} operator={rule.operator} />
                )}
            </Stack>
        </Modal>
    )
})
