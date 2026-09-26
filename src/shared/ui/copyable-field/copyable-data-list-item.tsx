import { CopyButton, DataList, Tooltip, UnstyledButton } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { PiCheck, PiCopy } from 'react-icons/pi'

import classes from './copyable-data-list-item.module.css'

interface Props {
    emptyValue?: string
    label: React.ReactNode
    monospace?: boolean
    value: null | number | string | undefined
}

export const CopyableDataListItem = ({
    label,
    value,
    monospace = false,
    emptyValue = '—'
}: Props) => {
    const { t } = useTranslation()

    const isEmpty = value == null || value === ''
    const text = isEmpty ? '' : value.toString()

    return (
        <DataList.Item>
            <DataList.ItemLabel>{label}</DataList.ItemLabel>
            <DataList.ItemValue className={classes.itemValue}>
                {isEmpty ? (
                    <span className={classes.empty}>{emptyValue}</span>
                ) : (
                    <CopyButton timeout={2000} value={text}>
                        {({ copied, copy }) => (
                            <Tooltip
                                label={copied ? t('common.message.copied') : t('common.action.copy')}
                                withArrow
                            >
                                <UnstyledButton
                                    className={classes.value}
                                    data-copied={copied || undefined}
                                    data-monospace={monospace || undefined}
                                    onClick={copy}
                                >
                                    <span className={classes.text}>{text}</span>
                                    <span className={classes.icon}>
                                        {copied ? <PiCheck size="14px" /> : <PiCopy size="14px" />}
                                    </span>
                                </UnstyledButton>
                            </Tooltip>
                        )}
                    </CopyButton>
                )}
            </DataList.ItemValue>
        </DataList.Item>
    )
}
