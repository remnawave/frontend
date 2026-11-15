import { findNodeAtLocation, Node, parseTree } from 'jsonc-parser'

export const findRulesArray = (text: string): Node | undefined => {
    const root = parseTree(text)
    const rules = root && findNodeAtLocation(root, ['rules'])

    return rules && rules.type === 'array' ? rules : undefined
}

export const findRuleNodes = (text: string): Node[] => findRulesArray(text)?.children ?? []
