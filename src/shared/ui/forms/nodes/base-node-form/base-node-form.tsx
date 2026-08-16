import { DeleteNodeFeature } from '@features/ui/dashboard/nodes/delete-node'
import { ResetNodeTrafficFeature } from '@features/ui/dashboard/nodes/reset-node-traffic'
import { RestartNodeButtonFeature } from '@features/ui/dashboard/nodes/restart-node-button'
import { ToggleNodeStatusButtonFeature } from '@features/ui/dashboard/nodes/toggle-node-status-button'
import { Button, CopyButton, Group, Menu, px, Stack } from '@mantine/core'
import { UseFormReturnType } from '@mantine/form'
import {
    GetNodeIntegrationsCommand,
    GetNodePluginsCommand,
    GetNodeSecretKeyCommand,
    GetNodeCommand,
    UpdateNodeCommand
} from '@remnawave/backend-contract'
import { NodeErrorMessageWidget } from '@widgets/dashboard/nodes/node-error-message'
import { motion } from 'framer-motion'
import { t } from 'i18next'
import { ReactNode } from 'react'
import { PiFloppyDiskDuotone } from 'react-icons/pi'
import { TbCopy, TbDots } from 'react-icons/tb'

import { useIsMobile } from '@shared/hooks'
import { ModalFooter } from '@shared/ui/modal-footer'

import { NodeConfigProfilesCard } from './node-config-profiles.card'
import { NodeConsumptionCard } from './node-consumption.card'
import { NodeIpsCard } from './node-ips.card'
import { NodeTrackingAndBillingCard } from './node-tracking-and-billing.card'
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

interface IProps<T extends UpdateNodeCommand.RequestBody> {
    form: UseFormReturnType<T>
    handleClose: () => void
    handleSubmit: () => void
    isDataSubmitting: boolean
    node: GetNodeCommand.Response['response']
    nodeDetailsCard?: ReactNode
    nodeIntegrations: GetNodeIntegrationsCommand.Response['response']['nodeIntegrations']
    nodePlugins: GetNodePluginsCommand.Response['response']['nodePlugins']
    nodeSystemCard?: ReactNode
    secretKey: GetNodeSecretKeyCommand.Response['response'] | undefined
}

export const BaseNodeForm = <T extends UpdateNodeCommand.RequestBody>(props: IProps<T>) => {
    const {
        form,
        node,
        nodeIntegrations,
        nodePlugins,
        secretKey,
        nodeDetailsCard,
        nodeSystemCard,
        handleClose,
        handleSubmit,
        isDataSubmitting
    } = props

    const isMobile = useIsMobile()

    return (
        <>
            {isMobile ? (
                <MotionStack
                    animate="visible"
                    gap="lg"
                    initial="hidden"
                    variants={containerVariants}
                >
                    <NodeErrorMessageWidget node={node} />

                    {nodeDetailsCard && (
                        <MotionWrapper variants={cardVariants}>{nodeDetailsCard}</MotionWrapper>
                    )}

                    {nodeSystemCard && node.system && (
                        <MotionWrapper variants={cardVariants}>{nodeSystemCard}</MotionWrapper>
                    )}

                    <NodeVitalsCard
                        cardVariants={cardVariants}
                        form={form}
                        motionWrapper={MotionWrapper}
                        nodeIntegrations={nodeIntegrations}
                        nodePlugins={nodePlugins}
                        nodeUuid={node.uuid}
                        secretKey={secretKey}
                    />

                    <NodeIpsCard
                        cardVariants={cardVariants}
                        form={form}
                        motionWrapper={MotionWrapper}
                    />

                    <NodeConfigProfilesCard
                        cardVariants={cardVariants}
                        form={form}
                        motionWrapper={MotionWrapper}
                    />

                    <NodeTrackingAndBillingCard
                        cardVariants={cardVariants}
                        form={form}
                        motionWrapper={MotionWrapper}
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
                        <NodeErrorMessageWidget node={node} />

                        {nodeDetailsCard && (
                            <MotionWrapper variants={cardVariants}>{nodeDetailsCard}</MotionWrapper>
                        )}

                        <NodeVitalsCard
                            cardVariants={cardVariants}
                            form={form}
                            motionWrapper={MotionWrapper}
                            nodeIntegrations={nodeIntegrations}
                            nodePlugins={nodePlugins}
                            nodeUuid={node.uuid}
                            secretKey={secretKey}
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
                        {nodeSystemCard && node.system && (
                            <MotionWrapper variants={cardVariants}>{nodeSystemCard}</MotionWrapper>
                        )}

                        <NodeConfigProfilesCard
                            cardVariants={cardVariants}
                            form={form}
                            motionWrapper={MotionWrapper}
                        />

                        <NodeIpsCard
                            cardVariants={cardVariants}
                            form={form}
                            motionWrapper={MotionWrapper}
                        />

                        <NodeTrackingAndBillingCard
                            cardVariants={cardVariants}
                            form={form}
                            motionWrapper={MotionWrapper}
                        />
                    </MotionStack>
                </Group>
            )}

            <ModalFooter isMobile={isMobile}>
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
                    variant="soft"
                >
                    {t('common.save')}
                </Button>
            </ModalFooter>
        </>
    )
}
