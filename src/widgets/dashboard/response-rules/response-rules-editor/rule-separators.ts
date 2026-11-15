import type { editor } from 'monaco-editor'

import { findNodeAtLocation, Node } from 'jsonc-parser'

import styles from './ResponseRulesEditor.module.css'
import { findRuleNodes } from './rule-nodes'

interface IRuleSeparator {
    enabled: boolean
    index: number
    lineNumber: number
    name: string
    responseType: string
}

const UPDATE_DELAY_MS = 250
const ZONE_HEIGHT_PX = 28

const readString = (node: Node, key: string): string => {
    const value = findNodeAtLocation(node, [key])?.value

    return typeof value === 'string' ? value : ''
}

const collectSeparators = (model: editor.ITextModel): IRuleSeparator[] =>
    findRuleNodes(model.getValue()).flatMap((node, index) =>
        node.type === 'object'
            ? [
                  {
                      enabled: findNodeAtLocation(node, ['enabled'])?.value !== false,
                      index: index + 1,
                      lineNumber: model.getPositionAt(node.offset).lineNumber,
                      name: readString(node, 'name'),
                      responseType: readString(node, 'responseType')
                  }
              ]
            : []
    )

const createSpan = (className: string, text: string): HTMLSpanElement => {
    const span = document.createElement('span')
    span.className = className
    span.textContent = text

    return span
}

const buildZoneNode = (separator: IRuleSeparator): HTMLElement => {
    const zone = document.createElement('div')
    const content = document.createElement('div')

    content.className = separator.enabled
        ? styles.ruleSeparator
        : `${styles.ruleSeparator} ${styles.ruleSeparatorDisabled}`

    content.append(
        createSpan(styles.ruleSeparatorIndex, `#${separator.index}`),
        createSpan(styles.ruleSeparatorName, separator.name || '—')
    )

    if (separator.responseType) {
        content.append(createSpan(styles.ruleSeparatorType, separator.responseType))
    }

    content.append(createSpan(styles.ruleSeparatorLine, ''))

    zone.append(content)

    return zone
}

export const setupRuleSeparators = (instance: editor.IStandaloneCodeEditor): void => {
    let zoneIds: string[] = []
    let signature = ''
    let timer: ReturnType<typeof setTimeout> | undefined

    const render = () => {
        const model = instance.getModel()

        if (!model) return

        const separators = collectSeparators(model)
        const nextSignature = JSON.stringify(separators)

        if (nextSignature === signature) return

        signature = nextSignature

        instance.changeViewZones((accessor) => {
            zoneIds.forEach((id) => accessor.removeZone(id))
            zoneIds = separators.map((separator) =>
                accessor.addZone({
                    afterLineNumber: separator.lineNumber - 1,
                    heightInPx: ZONE_HEIGHT_PX,
                    domNode: buildZoneNode(separator)
                })
            )
        })
    }

    render()

    const contentListener = instance.onDidChangeModelContent(() => {
        clearTimeout(timer)
        timer = setTimeout(render, UPDATE_DELAY_MS)
    })

    instance.onDidDispose(() => {
        clearTimeout(timer)
        contentListener.dispose()
    })
}
