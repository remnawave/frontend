import {
    GetNodePluginsCommand,
    GetOneNodeCommand,
    GetPubKeyCommand,
    UpdateNodeCommand
} from '@remnawave/backend-contract'
import { Button, CopyButton, em, Group, Menu, px, Stack } from '@mantine/core'
import { PiFloppyDiskDuotone } from 'react-icons/pi'
import { UseFormReturnType } from '@mantine/form'
import { TbCopy, TbDots } from 'react-icons/tb'
import { useMediaQuery } from '@mantine/hooks'
import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { t } from 'i18next'

import { ToggleNodeStatusButtonFeature } from '@features/ui/dashboard/nodes/toggle-node-status-button'
import { GetNodeLinkedHostsFeature } from '@features/ui/dashboard/nodes/get-node-linked-hosts'
import { GetNodeUsersUsageFeature } from '@features/ui/dashboard/nodes/get-node-users-usage'
import { RestartNodeButtonFeature } from '@features/ui/dashboard/nodes/restart-node-button'
import { ResetNodeTrafficFeature } from '@features/ui/dashboard/nodes/reset-node-traffic'
import { ModalAccordionWidget } from '@widgets/dashboard/nodes/modal-accordeon-widget'
import { DeleteNodeFeature } from '@features/ui/dashboard/nodes/delete-node'
import { ModalFooter } from '@shared/ui/modal-footer'

import { NodeTrackingAndBillingCard } from './node-tracking-and-billing.card'
import { NodeConfigProfilesCard } from './node-config-profiles.card'
import { NodeConsumptionCard } from './node-consumption.card'
import { NodeVitalsCard } from './node-vitals.card'

const MotionWrapper = motion.div
const MotionStack = motion.create(Stack)

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.1
        }
    }
}

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3 }
    }
}

interface IProps<T extends UpdateNodeCommand.Request> {
    advancedOpened: boolean
    form: UseFormReturnType<T>
    handleClose: () => void
    handleSubmit: () => void
    isDataSubmitting: boolean
    node: GetOneNodeCommand.Response['response']
    nodeDetailsCard?: ReactNode
    nodePlugins: GetNodePluginsCommand.Response['response']['nodePlugins']
    pubKey: GetPubKeyCommand.Response['response'] | undefined
    setAdvancedOpened: (value: boolean) => void
}

export const BaseNodeForm = <T extends UpdateNodeCommand.Request>(props: IProps<T>) => {
    const {
        form,
        node,
        nodePlugins,
        pubKey,
        advancedOpened,
        setAdvancedOpened,
        nodeDetailsCard,
        handleClose,
        handleSubmit,
        isDataSubmitting
    } = props

    const isMobile = useMediaQuery(`(max-width: ${em(768)})`)

    return (
        <>
            {isMobile ? (
                <MotionStack
                    animate="visible"
                    gap="lg"
                    initial="hidden"
                    variants={containerVariants}
                >
                    <ModalAccordionWidget node={node} />

                    {nodeDetailsCard && (
                        <MotionWrapper variants={cardVariants}>{nodeDetailsCard}</MotionWrapper>
                    )}

                    <NodeVitalsCard
                        cardVariants={cardVariants}
                        form={form}
                        motionWrapper={MotionWrapper}
                        nodePlugins={nodePlugins}
                        pubKey={pubKey}
                    />

                    <NodeConfigProfilesCard
                        cardVariants={cardVariants}
                        form={form}
                        motionWrapper={MotionWrapper}
                    />

                    <NodeTrackingAndBillingCard
                        advancedOpened={advancedOpened}
                        cardVariants={cardVariants}
                        form={form}
                        motionWrapper={MotionWrapper}
                        setAdvancedOpened={setAdvancedOpened}
                    />

                    <NodeConsumptionCard
                        cardVariants={cardVariants}
                        form={form}
                        motionWrapper={MotionWrapper}
                    />
                </MotionStack>
            ) : (
                <Group align="flex-start" gap="md" grow={false} wrap="wrap">
                    {/* Left Side */}
                    <MotionStack
                        animate="visible"
                        gap="md"
                        initial="hidden"
                        style={{ flex: '1 1 400px' }}
                        variants={containerVariants}
                    >
                        <ModalAccordionWidget node={node} />

                        {nodeDetailsCard && (
                            <MotionWrapper variants={cardVariants}>{nodeDetailsCard}</MotionWrapper>
                        )}

                        <NodeVitalsCard
                            cardVariants={cardVariants}
                            form={form}
                            motionWrapper={MotionWrapper}
                            nodePlugins={nodePlugins}
                            pubKey={pubKey}
                        />

                        <NodeConsumptionCard
                            cardVariants={cardVariants}
                            form={form}
                            motionWrapper={MotionWrapper}
                        />
                    </MotionStack>

                    {/* Right Side */}
                    <MotionStack
                        animate="visible"
                        gap="md"
                        initial="hidden"
                        style={{ flex: '1 1 400px' }}
                        variants={containerVariants}
                    >
                        <NodeConfigProfilesCard
                            cardVariants={cardVariants}
                            form={form}
                            motionWrapper={MotionWrapper}
                        />

                        <NodeTrackingAndBillingCard
                            advancedOpened={advancedOpened}
                            cardVariants={cardVariants}
                            form={form}
                            motionWrapper={MotionWrapper}
                            setAdvancedOpened={setAdvancedOpened}
                        />
                    </MotionStack>
                </Group>
            )}

            <ModalFooter>
                {node && (
                    <Menu keepMounted={true} position="top-end" shadow="md">
                        <Menu.Target>
                            <Button
                                color="gray"
                                leftSection={<TbDots size={px('1.2rem')} />}
                                size="md"
                            >
                                {t('base-node-form.more-actions')}
                            </Button>
                        </Menu.Target>

                        <Menu.Dropdown>
                            <DeleteNodeFeature handleClose={handleClose} node={node} />
                            <Menu.Divider />

                            <Menu.Label>{t('base-node-form.management')}</Menu.Label>
                            <CopyButton value={node.uuid}>
                                {({ copy }) => (
                                    <Menu.Item leftSection={<TbCopy size="16px" />} onClick={copy}>
                                        {t('common.copy-uuid')}
                                    </Menu.Item>
                                )}
                            </CopyButton>
                            <ResetNodeTrafficFeature handleClose={handleClose} node={node} />

                            <RestartNodeButtonFeature handleClose={handleClose} node={node} />
                            <ToggleNodeStatusButtonFeature handleClose={handleClose} node={node} />
                            <Menu.Divider />
                            <Menu.Label>{t('base-node-form.quick-actions')}</Menu.Label>
                            <GetNodeUsersUsageFeature nodeUuid={node.uuid} />
                            <GetNodeLinkedHostsFeature nodeUuid={node.uuid} />
                        </Menu.Dropdown>
                    </Menu>
                )}
                <Button
                    color="teal"
                    disabled={!form.isDirty() || !form.isTouched()}
                    leftSection={<PiFloppyDiskDuotone size="16px" />}
                    loading={isDataSubmitting}
                    onClick={handleSubmit}
                    size="md"
                    variant="light"
                >
                    {t('common.save')}
                </Button>
            </ModalFooter>
        </>
    )
}
