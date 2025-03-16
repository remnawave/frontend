import { useTranslation } from 'react-i18next'
import { PiInfoDuotone } from 'react-icons/pi'
import { Accordion } from '@mantine/core'

import { InboundsActionButtonsFeature } from '@features/ui/dashboard/inbounds/inbounds-action-buttons'
import { DataTableShared } from '@shared/ui/table'

export function InboundsPageHeaderWidget() {
    const { t } = useTranslation()

    return (
        <DataTableShared.Container mb="xl">
            <DataTableShared.Title
                actions={<InboundsActionButtonsFeature />}
                description={t('inbounds-page-header.widget.list-of-all-inbounds')}
                title={t('inbounds-page-header.widget.inbounds')}
            />
            <DataTableShared.Content>
                <Accordion radius="xs" variant="filled">
                    <Accordion.Item value="importing-json-subscription">
                        <Accordion.Control
                            icon={<PiInfoDuotone color="var(--mantine-color-red-6)" size={20} />}
                        >
                            {t('inbounds-page-header.widget.impotant-note')}
                        </Accordion.Control>
                        <Accordion.Panel>
                            {t('inbounds-page-header.widget.important-note-description-line-1')}{' '}
                            <br />
                            {t('inbounds-page-header.widget.important-note-description-line-2')}
                            <br></br>
                            {t('inbounds-page-header.widget.important-note-description-line-3')}
                        </Accordion.Panel>
                    </Accordion.Item>
                </Accordion>
            </DataTableShared.Content>
        </DataTableShared.Container>
    )
}
