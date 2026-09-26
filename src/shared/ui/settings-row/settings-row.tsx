import { ActionIcon, Box, Input, Tooltip } from '@mantine/core'
import { createContext, ReactNode, useContext, useId } from 'react'
import { TbArrowBackUp } from 'react-icons/tb'

import classes from './SettingsRow.module.css'

interface ISettingsRowControl {
    id: string
    labelId: string
}

const SettingsRowControlContext = createContext<ISettingsRowControl | null>(null)

export function useSettingsRowControl(): ISettingsRowControl {
    const context = useContext(SettingsRowControlContext)

    if (!context) {
        throw new Error('useSettingsRowControl must be used inside SettingsRow')
    }

    return context
}

interface IProps {
    children: ReactNode
    description?: ReactNode
    headerControl?: ReactNode
    help?: ReactNode
    label?: ReactNode
    labelElement?: 'div' | 'label'
    layout?: 'inline' | 'stacked'
    onReset?: () => void
    resetLabel?: string
}

export function SettingsRow(props: IProps) {
    const {
        children,
        description,
        headerControl,
        help,
        label,
        labelElement = 'div',
        layout = 'stacked',
        onReset,
        resetLabel
    } = props

    const uid = useId()
    const controlId = `${uid}-control`
    const labelId = `${uid}-label`
    const descriptionId = description ? `${uid}-description` : undefined

    const describedBy = descriptionId

    return (
        <Box
            aria-describedby={describedBy}
            aria-labelledby={label ? labelId : undefined}
            className={classes.row}
            data-layout={layout}
            role="group"
        >
            {label && (
                <div className={classes.header}>
                    <Input.Label
                        htmlFor={labelElement === 'label' ? controlId : undefined}
                        id={labelId}
                        labelElement={labelElement}
                    >
                        {label}
                    </Input.Label>
                    {help}
                    {headerControl && <div className={classes.headerControl}>{headerControl}</div>}
                </div>
            )}

            {onReset && (
                <div className={classes.action}>
                    <Tooltip label={resetLabel} openDelay={400} withArrow>
                        <ActionIcon
                            aria-label={resetLabel}
                            className={classes.actionButton}
                            color="gray"
                            onClick={onReset}
                            size="md"
                            variant="subtle"
                        >
                            <TbArrowBackUp size={16} />
                        </ActionIcon>
                    </Tooltip>
                </div>
            )}

            <div className={classes.control}>
                <SettingsRowControlContext.Provider value={{ id: controlId, labelId }}>
                    {children}
                </SettingsRowControlContext.Provider>
            </div>

            {description && (
                <Input.Description className={classes.meta} id={descriptionId}>
                    {description}
                </Input.Description>
            )}
        </Box>
    )
}

export const settingsRowClasses = classes
