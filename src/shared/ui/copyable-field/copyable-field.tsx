import { ActionIcon, CopyButton, Input } from '@mantine/core'
import { PiCheck, PiCopy } from 'react-icons/pi'

import classes from './copyable-field.module.css'

export const CopyableFieldShared = ({
    label,
    value,
    leftSection,
    size
}: {
    label?: React.ReactNode | string
    leftSection?: React.ReactNode
    size?: 'lg' | 'md' | 'sm' | 'xl' | 'xs'
    value: number | string
}) => {
    return (
        <CopyButton timeout={2000} value={value.toString()}>
            {({ copied, copy }) => (
                <Input.Wrapper label={label}>
                    <div className={classes.inputWrapper}>
                        <Input
                            classNames={{
                                input: classes.input,
                                section: classes.section
                            }}
                            leftSection={leftSection}
                            onClick={copy}
                            readOnly
                            rightSection={
                                <ActionIcon
                                    className={classes.copyButton}
                                    color={copied ? 'teal' : 'gray'}
                                    onClick={copy}
                                    variant="subtle"
                                >
                                    {copied ? <PiCheck size="16px" /> : <PiCopy size="16px" />}
                                </ActionIcon>
                            }
                            size={size}
                            value={value.toString()}
                        />
                    </div>
                </Input.Wrapper>
            )}
        </CopyButton>
    )
}
