import { Button, Center, Group, LoadingOverlay, Stack, Text } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { useFetch } from '@mantine/hooks'
import { useState } from 'react'

import {
    IDownloadableSubscriptionTemplate,
    IDownloadableSubscriptionTemplateList,
    SRR_TEMPLATES_LIST_LINK,
    SUBSCRIPTION_TEMPLATE_LIST_LINK,
    XRAY_CORE_TEMPLATE_LIST_LINK
} from '@shared/constants/templates'

import { TemplateSelectorModalProps } from './interfaces'
import { TemplateSelector } from './template-selector'

export const TemplateDownloadModal = (props: TemplateSelectorModalProps) => {
    const { editorType, templateType, onCancel, onLoadTemplate } = props
    const { t } = useTranslation()

    let templatesUrl = ''
    if (editorType === 'SRR') {
        templatesUrl = SRR_TEMPLATES_LIST_LINK
    } else if (editorType === 'SUBSCRIPTION') {
        templatesUrl = SUBSCRIPTION_TEMPLATE_LIST_LINK
    } else if (editorType === 'XRAY_CORE') {
        templatesUrl = XRAY_CORE_TEMPLATE_LIST_LINK
    }

    const {
        data: templatesList,
        loading: isTemplatesLoading,
        error: templatesError
    } = useFetch<IDownloadableSubscriptionTemplateList>(templatesUrl)

    const [selectedTemplate, setSelectedTemplate] = useState<
        IDownloadableSubscriptionTemplate | undefined
    >(undefined)
    const [isDownloading, setIsDownloading] = useState(false)

    const handleLoadTemplate = async (template: IDownloadableSubscriptionTemplate) => {
        setIsDownloading(true)
        try {
            await onLoadTemplate(template)
        } finally {
            setIsDownloading(false)
        }
    }

    if (isTemplatesLoading || !templatesList) {
        return (
            <Center>
                <LoadingOverlay visible={true} />
            </Center>
        )
    }

    if (templatesError) {
        return (
            <Center>
                <Stack>
                    <Text>Error loading templates from Github. Try again later.</Text>
                    <Group justify="center" mt="md">
                        <Button onClick={onCancel} variant="subtle">
                            {t('common.cancel')}
                        </Button>
                    </Group>
                </Stack>
            </Center>
        )
    }

    return (
        <>
            <TemplateSelector
                editorType={editorType}
                onSelect={setSelectedTemplate}
                selectedTemplate={selectedTemplate}
                templates={templatesList.templates}
                templateType={templateType}
            />
            <Group justify="flex-end" mt="md">
                <Button onClick={onCancel} variant="subtle">
                    {t('common.cancel')}
                </Button>
                <Button
                    disabled={!selectedTemplate}
                    loading={isDownloading}
                    onClick={() => selectedTemplate && handleLoadTemplate(selectedTemplate)}
                    variant="default"
                >
                    {t('template-selector.modal.load-template')}
                </Button>
            </Group>
        </>
    )
}
