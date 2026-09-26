import { Button } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { TbArrowsExchange, TbPencil } from 'react-icons/tb'

import { showModal } from '@shared/_modals/show-modal'
import { useSettingsRowControl } from '@shared/ui/settings-row'

import { useHostFormData } from '../host-form-data.context'
import { useHostOptions } from '../host-options.context'

export function MapperOption() {
    const { form, resolveSelectedRawInbound } = useHostFormData()
    const { isValueSet } = useHostOptions()
    const { t } = useTranslation()
    const rowControl = useSettingsRowControl()

    return (
        <Button
            color="gray"
            leftSection={<TbArrowsExchange size={16} />}
            onClick={() => {
                showModal('hosts_hostMapperModal', {
                    form,
                    rawInbound: resolveSelectedRawInbound()
                })
            }}
            rightSection={<TbPencil size={14} />}
            size="compact-sm"
            variant="soft"
            aria-labelledby={`${rowControl.labelId} ${rowControl.id}`}
            id={rowControl.id}
        >
            {isValueSet('mapper') ? t('common.message.configured') : t('common.message.not-set')}
        </Button>
    )
}
