import { GetSubscriptionPageConfigCommand } from '@remnawave/backend-contract'
import { ActionIcon, CopyButton, Group, Tooltip } from '@mantine/core'
import { TbArrowBack, TbDownload, TbFile } from 'react-icons/tb'
import { PiCheck, PiCopy } from 'react-icons/pi'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { SubpageConfigVisualEditorWidget } from '@widgets/dashboard/subpage-configs/subpage-config-editor/subpage-config-visual-editor.widget'
import { Page, PageHeaderShared } from '@shared/ui'
import { ROUTES } from '@shared/constants'

interface Props {
    config: GetSubscriptionPageConfigCommand.Response['response']
}

export const SubpageConfigEditorPageComponent = (props: Props) => {
    const { config } = props
    const { t } = useTranslation()
    const navigate = useNavigate()

    const handleDownloadConfig = () => {
        const json = JSON.stringify(config.config, null, 2)
        const blob = new Blob([json], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `subpage-${config.uuid}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    // TODO: Help Article
    return (
        <Page title={config.name}>
            <PageHeaderShared
                actions={
                    <Group>
                        {/* <HelpActionIconShared
                            hidden={!isHelpDrawerVisible}
                            screen="EDITOR_TEMPLATES_XRAY_JSON"
                        /> */}

                        <ActionIcon
                            color="gray"
                            onClick={handleDownloadConfig}
                            size="input-md"
                            variant="light"
                        >
                            <TbDownload size={24} />
                        </ActionIcon>

                        <CopyButton timeout={2000} value={config.uuid}>
                            {({ copied, copy }) => (
                                <Tooltip label={t('common.copy-uuid')}>
                                    <ActionIcon
                                        color={copied ? 'teal' : 'gray'}
                                        onClick={copy}
                                        size="input-md"
                                        variant="light"
                                    >
                                        {copied ? <PiCheck size={24} /> : <PiCopy size={24} />}
                                    </ActionIcon>
                                </Tooltip>
                            )}
                        </CopyButton>

                        <ActionIcon
                            color="gray"
                            onClick={() => navigate(ROUTES.DASHBOARD.SUBPAGE_CONFIGS.ROOT)}
                            size="input-md"
                            variant="light"
                        >
                            <TbArrowBack size={24} />
                        </ActionIcon>
                    </Group>
                }
                icon={<TbFile size={24} />}
                title={config.name}
            />
            <SubpageConfigVisualEditorWidget config={config} />
        </Page>
    )
}
