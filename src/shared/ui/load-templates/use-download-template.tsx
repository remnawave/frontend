import type { editor } from 'monaco-editor'

import { TSubscriptionTemplateType } from '@remnawave/backend-contract'
import { notifications } from '@mantine/notifications'
import { useTranslation } from 'react-i18next'
import { TbDownload } from 'react-icons/tb'
import { modals } from '@mantine/modals'
import { RefObject } from 'react'

import { IDownloadableSubscriptionTemplate } from '@shared/constants/templates'

import { BaseOverlayHeader } from '../overlays/base-overlay-header'
import { TemplateDownloadModal } from './template-selector.modal'

interface IProps {
    editorRef?: RefObject<editor.IStandaloneCodeEditor | null>
    editorType: 'NODE_PLUGIN' | 'SRR' | 'SUBPAGE_CONFIG' | 'SUBSCRIPTION' | 'XRAY_CORE'
    onLoadTemplate?: (content: string) => Promise<void>
    templateType: 'NODE_PLUGIN' | 'SRR' | 'SUBPAGE_CONFIG' | TSubscriptionTemplateType
}

export const useDownloadTemplate = (props: IProps) => {
    const { editorRef, editorType, onLoadTemplate, templateType } = props
    const { t } = useTranslation()

    const loadTemplate = async (template: IDownloadableSubscriptionTemplate) => {
        try {
            const response = await fetch(template.url)

            if (!response.ok) {
                throw new Error(t('use-download-template.failed-to-load-template'))
            }

            const content = await response.text()

            if (editorRef && editorRef.current) {
                editorRef.current.setValue(content)
                editorRef.current.getAction('editor.action.formatDocument')?.run()
            } else if (onLoadTemplate) {
                await onLoadTemplate(content)
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
            title: (
                <BaseOverlayHeader
                    IconComponent={TbDownload}
                    iconVariant="gradient-cyan"
                    title={t('use-download-template.select-template-to-load')}
                />
            ),
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
