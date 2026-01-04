import { GetOneNodeCommand, GetPubKeyCommand, UpdateNodeCommand } from '@remnawave/backend-contract'
import { UseFormReturnType } from '@mantine/form'
import { em, Group, Stack } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { motion } from 'framer-motion'
import { ReactNode } from 'react'

import { ModalAccordionWidget } from '@widgets/dashboard/nodes/modal-accordeon-widget'

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
    fetchedNode: GetOneNodeCommand.Response['response'] | undefined
    form: UseFormReturnType<T>
    node: GetOneNodeCommand.Response['response'] | null
    nodeDetailsCard?: ReactNode
    pubKey: GetPubKeyCommand.Response['response'] | undefined
    setAdvancedOpened: (value: boolean) => void
}

export const BaseNodeForm = <T extends UpdateNodeCommand.Request>(props: IProps<T>) => {
    const { form, node, fetchedNode, pubKey, advancedOpened, setAdvancedOpened, nodeDetailsCard } =
        props

    const isMobile = useMediaQuery(`(max-width: ${em(768)})`)

    return isMobile ? (
        <MotionStack animate="visible" gap="lg" initial="hidden" variants={containerVariants}>
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
    )
}
