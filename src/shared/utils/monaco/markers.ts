import type { editor } from 'monaco-editor'

const ERROR_SEVERITY = 8

export const formatFirstErrorMarker = (markers: editor.IMarker[]): null | string => {
    const marker = markers.find(({ severity }) => severity === ERROR_SEVERITY)

    return marker ? `${marker.startLineNumber}:${marker.startColumn} ${marker.message}` : null
}
