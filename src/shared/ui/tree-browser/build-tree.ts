export interface ITreeNode<T> {
    children: ITreeNode<T>[]
    item: null | T
    label: string
    path: string
    total: number
}

interface IDraft<T> {
    children: Map<string, IDraft<T>>
    item: null | T
    label: string
    path: string
}

const SEPARATOR = '/'

const COLLATOR = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })

function draft<T>(label: string, path: string): IDraft<T> {
    return { children: new Map(), item: null, label, path }
}

export function buildTree<T>(items: T[], getName: (item: T) => string): ITreeNode<T>[] {
    const root = draft<T>('', '')

    for (const item of items) {
        const name = getName(item)
        const parts = name.split(SEPARATOR).filter(Boolean)
        const segments = parts.length > 0 ? parts : [name]

        let node = root

        for (const segment of segments) {
            const path = node.path ? `${node.path}${SEPARATOR}${segment}` : segment
            let next = node.children.get(segment)

            if (!next) {
                next = draft<T>(segment, path)
                node.children.set(segment, next)
            }

            node = next
        }

        node.item = item
    }

    return [...root.children.values()].map((child) => finalize(child)).sort(compareNodes)
}

function finalize<T>(node: IDraft<T>): ITreeNode<T> {
    let current = node

    while (!current.item && current.children.size === 1) {
        const [only] = current.children.values()

        current = {
            children: only.children,
            item: only.item,
            label: current.label ? `${current.label}${SEPARATOR}${only.label}` : only.label,
            path: only.path
        }
    }

    const children = [...current.children.values()]
        .map((child) => finalize(child))
        .sort(compareNodes)

    return {
        children,
        item: current.item,
        label: current.label,
        path: current.path,
        total: children.reduce((sum, child) => sum + child.total, 0) + (current.item ? 1 : 0)
    }
}

function compareNodes<T>(a: ITreeNode<T>, b: ITreeNode<T>): number {
    const aIsFolder = a.children.length > 0
    const bIsFolder = b.children.length > 0

    if (aIsFolder !== bIsFolder) return aIsFolder ? -1 : 1

    return COLLATOR.compare(a.label, b.label)
}

export function resolvePath<T>(nodes: ITreeNode<T>[], path: string[]): ITreeNode<T>[] | null {
    let level = nodes

    for (const segment of path) {
        const next = level.find((node) => node.label === segment)
        if (!next) return null

        level = next.children
    }

    return level
}
