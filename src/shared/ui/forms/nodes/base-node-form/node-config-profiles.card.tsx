import { ForwardRefComponent, HTMLMotionProps, motion, Variants } from 'motion/react'
import { CreateNodeCommand, UpdateNodeCommand } from '@remnawave/backend-contract'
import { SiSecurityscorecard } from 'react-icons/si'
import { UseFormReturnType } from '@mantine/form'
import { Skeleton, Stack } from '@mantine/core'
import { useTranslation } from 'react-i18next'

import { ShowConfigProfilesWithInboundsFeature } from '@features/ui/dashboard/nodes/show-config-profiles-with-inbounds'
import { BaseOverlayHeader } from '@shared/ui/overlays/base-overlay-header'
import { useGetConfigProfiles } from '@shared/api/hooks'
import { SectionCard } from '@shared/ui/section-card'

interface IProps<T extends CreateNodeCommand.Request | UpdateNodeCommand.Request> {
    cardVariants: Variants
    form: UseFormReturnType<T>
    motionWrapper: ForwardRefComponent<HTMLDivElement, HTMLMotionProps<'div'>>
}

export const NodeConfigProfilesCard = <
    T extends CreateNodeCommand.Request | UpdateNodeCommand.Request
>(
    props: IProps<T>
) => {
    const { t } = useTranslation()
    const { cardVariants, form, motionWrapper } = props

    const MotionWrapper = motionWrapper

    const { data: configProfiles, isLoading: isConfigProfilesLoading } = useGetConfigProfiles()

    const saveInbounds = (inbounds: string[], configProfileUuid: string) => {
        form.setValues({
            configProfile: {
                activeInbounds: inbounds,
                activeConfigProfileUuid: configProfileUuid
            }
        } as Partial<T>)
        form.setTouched({
            activeConfigProfileUuid: true,
            activeInbounds: true
        })
        form.setDirty({
            activeConfigProfileUuid: true,
            activeInbounds: true
        })
    }

    return (
        <MotionWrapper variants={cardVariants}>
            <SectionCard.Root>
                <SectionCard.Section>
                    <BaseOverlayHeader
                        IconComponent={SiSecurityscorecard}
                        iconVariant="gradient-teal"
                        title={t('base-node-form.core-configuration')}
                        titleOrder={5}
                    />
                </SectionCard.Section>
                <SectionCard.Section>
                    {isConfigProfilesLoading && (
                        <Stack gap="md">
                            <Skeleton height={24} width="40%" />
                            <Skeleton height={16} width="60%" />
                            <Skeleton height={76} radius="md" />
                            <Skeleton height={25} radius="sm" width="100%" />
                        </Stack>
                    )}

                    {!isConfigProfilesLoading && configProfiles && (
                        <motion.div
                            animate={{ opacity: 1 }}
                            initial={{ opacity: 0 }}
                            transition={{
                                duration: 0.4,
                                ease: 'easeInOut'
                            }}
                        >
                            <ShowConfigProfilesWithInboundsFeature
                                activeConfigProfileInbounds={
                                    form.getValues().configProfile?.activeInbounds ?? []
                                }
                                activeConfigProfileUuid={
                                    form.getValues().configProfile?.activeConfigProfileUuid
                                }
                                configProfiles={configProfiles.configProfiles}
                                errors={form.errors.configProfile}
                                onSaveInbounds={saveInbounds}
                            />
                        </motion.div>
                    )}
                </SectionCard.Section>
            </SectionCard.Root>
        </MotionWrapper>
    )
}
