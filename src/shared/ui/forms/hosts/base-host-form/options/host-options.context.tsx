import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState
} from 'react'

import { THostForm } from '../host-form.types'
import {
    HOST_OPTION_FIELD_BY_NAME,
    HOST_OPTION_KEY_BY_NAME,
    HOST_OPTION_FIELDS,
    IHostOptionField,
    isOptionSet
} from './host-option-fields'

const SETTLE_MS = 1600

function getPath(path: string, values: Record<string, unknown>): unknown {
    return path
        .split('.')
        .reduce<unknown>(
            (value, segment) =>
                value && typeof value === 'object'
                    ? (value as Record<string, unknown>)[segment]
                    : undefined,
            values
        )
}

function topLevelKey(path: string): string {
    return path.split('.')[0]
}

interface IHostOptionsContext {
    activate: (name: string) => void
    inactiveFields: IHostOptionField[]
    isActive: (name: string) => boolean
    isBulkEdit: boolean
    isFilled: (name: string) => boolean
    isValueSet: (key: string) => boolean
    justAdded: null | string
    remove: (name: string) => void
}

const HostOptionsContext = createContext<IHostOptionsContext | null>(null)

interface Props {
    children: ReactNode
    form: THostForm
    isBulkEdit?: boolean
}

export function HostOptionsProvider(props: Props) {
    const { children, form, isBulkEdit = false } = props

    const [added, setAdded] = useState<Set<string>>(new Set())
    const [justAdded, setJustAdded] = useState<null | string>(null)
    const [setFlags, setSetFlags] = useState<Record<string, boolean>>({})
    const [touchedKeys, setTouchedKeys] = useState<Record<string, boolean>>({})

    const watchers = useMemo(
        () =>
            HOST_OPTION_FIELDS.flatMap((field) =>
                field.fields.map((formKey) => ({
                    key: formKey.key,
                    onChange: ({ touched, value }: { touched: boolean; value: unknown }) => {
                        const nowSet = isOptionSet(value, formKey)

                        setSetFlags((current) =>
                            current[formKey.key] === nowSet
                                ? current
                                : { ...current, [formKey.key]: nowSet }
                        )

                        if (touched) {
                            setTouchedKeys((current) =>
                                current[formKey.key] ? current : { ...current, [formKey.key]: true }
                            )
                        }
                    }
                }))
            ),
        []
    )

    for (const watcher of watchers) {
        form.watch(watcher.key, watcher.onChange)
    }

    const hasValue = useCallback(
        (field: IHostOptionField) =>
            field.fields.some((formKey) =>
                isOptionSet(getPath(formKey.key, form.getValues()), formKey)
            ),
        [form]
    )

    const isActive = useCallback(
        (name: string) => {
            const field = HOST_OPTION_FIELD_BY_NAME.get(name)

            if (!field) return true

            if (added.has(name) || hasValue(field)) return true

            return field.fields.some((formKey) => touchedKeys[formKey.key])
        },
        [added, hasValue, touchedKeys]
    )

    const isFilled = useCallback(
        (name: string) => {
            const field = HOST_OPTION_FIELD_BY_NAME.get(name)

            return field ? hasValue(field) : false
        },
        [hasValue, setFlags]
    )

    const isValueSet = useCallback(
        (key: string) =>
            setFlags[key] ??
            isOptionSet(getPath(key, form.getValues()), HOST_OPTION_KEY_BY_NAME.get(key) ?? {}),
        [form, setFlags]
    )

    const activate = useCallback(
        (name: string) => {
            const field = HOST_OPTION_FIELD_BY_NAME.get(name)

            if (isBulkEdit && field) {
                for (const formKey of field.fields) {
                    form.setFieldValue(formKey.key, formKey.emptyValue)
                }

                form.setDirty((current: Record<string, boolean>) => ({
                    ...current,
                    ...Object.fromEntries(
                        field.fields.map((formKey) => [topLevelKey(formKey.key), true])
                    )
                }))
            }

            setAdded((current) => new Set(current).add(name))
            setJustAdded(name)
        },
        [form, isBulkEdit]
    )

    useEffect(() => {
        if (!justAdded) return undefined

        const timeout = setTimeout(() => setJustAdded(null), SETTLE_MS)

        return () => clearTimeout(timeout)
    }, [justAdded])

    const remove = useCallback(
        (name: string) => {
            const field = HOST_OPTION_FIELD_BY_NAME.get(name)

            if (field) {
                for (const formKey of field.fields) {
                    form.setFieldValue(formKey.key, formKey.emptyValue)
                }

                if (isBulkEdit) {
                    const owned = new Set(
                        field.fields.flatMap((formKey) => [formKey.key, topLevelKey(formKey.key)])
                    )

                    form.setDirty((current: Record<string, boolean>) => ({
                        ...Object.fromEntries(
                            Object.entries(current).filter(
                                ([key]) => !owned.has(key) && !owned.has(topLevelKey(key))
                            )
                        ),
                        ...Object.fromEntries(
                            field.fields.map((formKey) => [topLevelKey(formKey.key), false])
                        )
                    }))
                }

                setTouchedKeys((current) => {
                    const next = { ...current }

                    for (const formKey of field.fields) {
                        delete next[formKey.key]
                    }

                    return next
                })
            }

            setJustAdded((current) => (current === name ? null : current))
            setAdded((current) => {
                const next = new Set(current)
                next.delete(name)

                return next
            })
        },
        [form, isBulkEdit]
    )

    const inactiveFields = useMemo(
        () => HOST_OPTION_FIELDS.filter((field) => !isActive(field.name)),
        [isActive]
    )

    const value = useMemo(
        () => ({
            activate,
            inactiveFields,
            isActive,
            isBulkEdit,
            isFilled,
            isValueSet,
            justAdded,
            remove
        }),
        [activate, inactiveFields, isActive, isBulkEdit, isFilled, isValueSet, justAdded, remove]
    )

    return <HostOptionsContext.Provider value={value}>{children}</HostOptionsContext.Provider>
}

export function useHostOptions(): IHostOptionsContext {
    const context = useContext(HostOptionsContext)

    if (!context) {
        throw new Error('useHostOptions must be used inside HostOptionsProvider')
    }

    return context
}
