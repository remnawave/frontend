import { useEffect, useRef, useState } from 'react'

import classes from '../NodeSshTerminal.module.css'

const ALLOWED_CHARS = /[!-~]/gu

interface IProps {
    autoFocus?: boolean
    disabled?: boolean
    error?: boolean
    length: number
    onChange: (value: string) => void
    onComplete?: (value: string) => void
    success?: boolean
    value: string
}

export const PasscodeInput = (props: IProps) => {
    const { autoFocus, disabled, error, length, onChange, onComplete, success, value } = props

    const [isFocused, setIsFocused] = useState(false)

    const inputRef = useRef<HTMLInputElement | null>(null)
    const wasDisabledRef = useRef(disabled)

    const activeIndex = Math.min(value.length, length - 1)

    useEffect(() => {
        const input = inputRef.current

        if (wasDisabledRef.current && !disabled && isFocused && input) {
            if (document.activeElement !== input) input.focus()
        }

        wasDisabledRef.current = disabled
    }, [disabled, isFocused])

    const handleBlur = () => {
        if (inputRef.current?.disabled) return

        setIsFocused(false)
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const next = (event.currentTarget.value.match(ALLOWED_CHARS) ?? [])
            .join('')
            .slice(0, length)

        onChange(next)

        if (next.length === length) onComplete?.(next)
    }

    const handleSelect = (event: React.SyntheticEvent<HTMLInputElement>) => {
        const input = event.currentTarget
        const { selectionEnd, selectionStart } = input

        if (selectionStart === selectionEnd && selectionStart !== value.length) {
            input.setSelectionRange(value.length, value.length)
        }
    }

    return (
        <div
            className={classes.passcodeRoot}
            data-disabled={disabled || undefined}
            data-error={error || undefined}
            data-success={success || undefined}
        >
            <div aria-hidden className={classes.passcodeSlots}>
                {Array.from({ length }, (_, index) => {
                    const isFilled = index < value.length
                    const isActive = isFocused && !disabled && index === activeIndex

                    return (
                        <div
                            className={classes.passcodeSlot}
                            data-active={isActive || undefined}
                            data-placeholder={!isFilled || undefined}
                            key={index}
                        >
                            {isFilled ? '•' : isActive ? '' : '○'}
                            {isActive && <span className={classes.passcodeCaret} />}
                        </div>
                    )
                })}
            </div>

            <input
                autoComplete="no-password"
                autoFocus={autoFocus}
                className={classes.passcodeInput}
                data-form-type="other"
                disabled={disabled}
                inputMode="text"
                onBlur={handleBlur}
                onChange={handleChange}
                onFocus={() => setIsFocused(true)}
                onSelect={handleSelect}
                ref={inputRef}
                spellCheck={false}
                type="text"
                value={value}
            />
        </div>
    )
}
