import { CreateNodeCommand, UpdateNodeCommand } from '@remnawave/backend-contract'
import { Button, CopyButton, em, Group, Menu, px, Stack } from '@mantine/core'
import { PiFloppyDiskDuotone } from 'react-icons/pi'
import { TbCopy, TbDots } from 'react-icons/tb'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from '@mantine/hooks'
import { motion } from 'framer-motion'

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
import { NodeStatsCard } from './node-stats.card'
import { IProps } from './interfaces'

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

export const BaseNodeForm = <T extends CreateNodeCommand.Request | UpdateNodeCommand.Request>(
    props: IProps<T>
) => {
    const {
        form,
        handleClose,
        node,
        fetchedNode,
        pubKey,
        advancedOpened,
        isUpdateNodePending,
        handleSubmit,
        setAdvancedOpened,
        nodeDetailsCard
    } = props

    const { t } = useTranslation()
    const isMobile = useMediaQuery(`(max-width: ${em(768)})`)

    return (
        <form onSubmit={handleSubmit}>
            {isMobile ? (
                <MotionStack
                    animate="visible"
                    gap="lg"
                    initial="hidden"
                    variants={containerVariants}
                >
                    <ModalAccordionWidget fetchedNode={fetchedNode} node={node} />

                    {nodeDetailsCard && (
                        <MotionWrapper variants={cardVariants}>{nodeDetailsCard}</MotionWrapper>
                    )}

                    {node && (
                        <NodeStatsCard
                            cardVariants={cardVariants}
                            form={form}
                            motionWrapper={MotionWrapper}
                            node={node}
                        />
                    )}

                    <NodeVitalsCard
                        cardVariants={cardVariants}
                        form={form}
                        motionWrapper={MotionWrapper}
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
                <Group align="flex-start" gap="xl" grow={false} wrap="wrap">
                    {/* Left Side */}
                    <MotionStack
                        animate="visible"
                        gap="lg"
                        initial="hidden"
                        style={{ flex: '1 1 400px' }}
                        variants={containerVariants}
                    >
                        <ModalAccordionWidget fetchedNode={fetchedNode} node={node} />

                        {nodeDetailsCard && (
                            <MotionWrapper variants={cardVariants}>{nodeDetailsCard}</MotionWrapper>
                        )}

                        <NodeVitalsCard
                            cardVariants={cardVariants}
                            form={form}
                            motionWrapper={MotionWrapper}
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
                        gap="lg"
                        initial="hidden"
                        style={{ flex: '1 1 400px' }}
                        variants={containerVariants}
                    >
                        <NodeConfigProfilesCard
                            cardVariants={cardVariants}
                            form={form}
                            motionWrapper={MotionWrapper}
                        />

                        {(fetchedNode || node) && (
                            <NodeStatsCard
                                cardVariants={cardVariants}
                                form={form}
                                motionWrapper={MotionWrapper}
                                node={fetchedNode || node!}
                            />
                        )}

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
                                size="sm"
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
                    loading={isUpdateNodePending}
                    size="sm"
                    type="submit"
                    variant="light"
                >
                    {t('common.save')}
                </Button>
            </ModalFooter>
        </form>
    )
}
