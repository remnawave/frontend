import { useTranslation } from 'react-i18next'
import { Button, Group } from '@mantine/core'
import { useState } from 'react'

import { DownloadableSubscriptionTemplate } from '@shared/constants/templates/template-list'

import { TemplateSelectorModalProps } from './interfaces'
import { TemplateSelector } from './template-selector'

export const TemplateDownloadModal = (props: TemplateSelectorModalProps) => {
    const { templateType, onCancel, onLoadTemplate, templates } = props
    const { t } = useTranslation()

    const [selectedTemplate, setSelectedTemplate] = useState<
        DownloadableSubscriptionTemplate | undefined
    >(undefined)
    const [isDownloading, setIsDownloading] = useState(false)

    const handleLoadTemplate = async (template: DownloadableSubscriptionTemplate) => {
        setIsDownloading(true)
        try {
            await onLoadTemplate(template)
        } finally {
            setIsDownloading(false)
        }
    }

    return (
        <>
            <TemplateSelector
                onSelect={setSelectedTemplate}
                selectedTemplate={selectedTemplate}
                templates={templates}
                templateType={templateType}
            />
            <Group justify="flex-end" mt="md">
                <Button onClick={onCancel} variant="subtle">
                    {t('template-selector.modal.cancel')}
                </Button>
                <Button
                    color="blue"
                    disabled={!selectedTemplate}
                    loading={isDownloading}
                    onClick={() => selectedTemplate && handleLoadTemplate(selectedTemplate)}
                >
                    {t('template-selector.modal.load-template')}
                </Button>
            </Group>
        </>
    )
}
