import type { editor } from 'monaco-editor'

import { TSubscriptionTemplateType } from '@remnawave/backend-contract'
import { notifications } from '@mantine/notifications'
import { useTranslation } from 'react-i18next'
import { modals } from '@mantine/modals'
import { RefObject } from 'react'

import { IDownloadableSubscriptionTemplate } from '@shared/constants/templates'

import { TemplateDownloadModal } from './template-selector.modal'

export const useDownloadTemplate = (
    templateType: 'SRR' | TSubscriptionTemplateType,
    editorRef: RefObject<editor.IStandaloneCodeEditor | null>,
    editorType: 'SRR' | 'SUBSCRIPTION' | 'XRAY_CORE'
) => {
    const { t } = useTranslation()

    const loadTemplate = async (template: IDownloadableSubscriptionTemplate) => {
        try {
            const response = await fetch(template.url)

            if (!response.ok) {
                throw new Error(t('use-download-template.failed-to-load-template'))
            }

            const content = await response.text()

            if (editorRef.current) {
                editorRef.current.setValue(content)
                editorRef.current.getAction('editor.action.formatDocument')?.run()
            }

            notifications.show({
                title: t('use-download-template.template-loaded'),
                message: t('use-download-template.template-name-has-been-loaded-into-the-editor', {
                    name: template.name
                }),
                color: 'teal'
            })
        } catch {
            notifications.show({
                title: t('use-download-template.load-failed'),
                message: t('use-download-template.failed-to-load-template-please-try-again'),
                color: 'red'
            })
        }
    }

    const openDownloadModal = () => {
        const modalId = modals.open({
            title: t('use-download-template.select-template-to-load'),
            centered: true,
            size: 'lg',
            children: (
                <TemplateDownloadModal
                    editorType={editorType}
                    onCancel={() => modals.close(modalId)}
                    onLoadTemplate={async (template) => {
                        await loadTemplate(template)
                        modals.close(modalId)
                    }}
                    templateType={templateType}
                />
            )
        })
    }

    return {
        openDownloadModal
    }
}
