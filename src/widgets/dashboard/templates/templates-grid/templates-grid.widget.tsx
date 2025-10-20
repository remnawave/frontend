import { PiBracketsAngle } from 'react-icons/pi'
import { SimpleGrid } from '@mantine/core'
import { modals } from '@mantine/modals'
import { useMemo } from 'react'

import { QueryKeys, useDeleteSubscriptionTemplate } from '@shared/api/hooks'
import { SingboxLogo } from '@shared/ui/logos/singbox-logo'
import { MihomoLogo } from '@shared/ui/logos/mihomo-logo'
import { StashLogo } from '@shared/ui/logos/stash-logo'
import { queryClient } from '@shared/api/query-client'
import { XrayLogo } from '@shared/ui/logos/xray-logo'

import { TemplatesCardWidget } from '../template-card/templates-card.widget'
import { IProps } from './interfaces'

export function TemplatesGridWidget(props: IProps) {
    const { templates, templateTitle, type } = props

    const { mutate: deleteTemplate } = useDeleteSubscriptionTemplate({
        mutationFns: {
            onSuccess: () => {
                queryClient.refetchQueries({
                    queryKey: QueryKeys.subscriptionTemplate.getSubscriptionTemplates.queryKey
                })
            }
        }
    })

    const handleDeleteTemplate = (templateUuid: string) => {
        modals.openConfirmModal({
            title: 'Confirm deletion',
            children: 'Are you sure you want to perform this action? This action cannot be undone.',
            labels: {
                confirm: 'Delete',
                cancel: 'Cancel'
            },
            cancelProps: { variant: 'subtle', color: 'gray' },
            confirmProps: { color: 'red' },
            centered: true,
            onConfirm: () => {
                deleteTemplate({
                    route: {
                        uuid: templateUuid
                    }
                })
            }
        })
    }

    const isHighCount = templates.length > 6

    const themeLogo = useMemo(() => {
        switch (type) {
            case 'CLASH':
            case 'MIHOMO':
                return <MihomoLogo size={28} />
            case 'SINGBOX':
                return <SingboxLogo size={28} />
            case 'STASH':
                return <StashLogo size={28} />
            case 'XRAY_JSON':
                return <XrayLogo size={28} />
            default:
                return <PiBracketsAngle size={28} />
        }
    }, [type])

    return (
        <SimpleGrid
            cols={{ base: 1, '800px': 2, '1200px': 4, '1800px': 5, '2400px': 6, '3000px': 7 }}
            type="container"
        >
            {templates.map((template, index) => (
                <TemplatesCardWidget
                    handleDeleteTemplate={handleDeleteTemplate}
                    index={index}
                    isHighCount={isHighCount}
                    key={template.uuid}
                    template={template}
                    templateTitle={templateTitle}
                    themeLogo={themeLogo}
                />
            ))}
        </SimpleGrid>
    )
}
