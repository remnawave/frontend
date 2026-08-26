import { Button } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { TbPencil } from 'react-icons/tb'

import { useSettingsRowControl } from '@shared/ui/settings-row'

import { openHostJsonFieldModal, THostJsonField } from '../../json-fields'
import { useHostFormData } from '../host-form-data.context'
import { useHostOptions } from '../host-options.context'

function JsonFieldOption(props: { field: THostJsonField }) {
    const { field } = props
    const { form, hostJsonFields, isXhttpExtraButtonDisabled, language } = useHostFormData()
    const { isValueSet } = useHostOptions()
    const { t } = useTranslation()
    const rowControl = useSettingsRowControl()

    const config = hostJsonFields.find((jsonField) => jsonField.field === field)

    if (!config) return null

    return (
        <Button
            color="gray"
            disabled={field === 'xhttpExtraParams' && isXhttpExtraButtonDisabled()}
            leftSection={<config.IconComponent size={16} />}
            onClick={() => openHostJsonFieldModal(config, form, language)}
            rightSection={<TbPencil size={14} />}
            size="compact-sm"
            variant="soft"
            aria-labelledby={`${rowControl.labelId} ${rowControl.id}`}
            id={rowControl.id}
        >
            {isValueSet(field) ? t('common.message.configured') : t('common.message.not-set')}
        </Button>
    )
}

export const FinalMaskOption = () => <JsonFieldOption field="finalMask" />
export const MuxParamsOption = () => <JsonFieldOption field="muxParams" />
export const SockoptParamsOption = () => <JsonFieldOption field="sockoptParams" />
export const XhttpExtraParamsOption = () => <JsonFieldOption field="xhttpExtraParams" />
