import { Group, ScrollArea, Text, UnstyledButton } from '@mantine/core'
import { AnimatePresence, motion, Variants } from 'motion/react'
import { ReactNode } from 'react'
import { TbChevronRight, TbFolder } from 'react-icons/tb'

import { ITreeNode } from './build-tree'
import { TreeBreadcrumbs } from './tree-breadcrumbs'
import classes from './TreeBrowser.module.css'
import { useTreeNavigation } from './use-tree-navigation'

const levelVariants: Variants = {
    enter: (direction: number) => ({ opacity: 0, x: direction >= 0 ? 24 : -24 }),
    center: { opacity: 1, x: 0 },
    exit: (direction: number) => ({ opacity: 0, x: direction >= 0 ? -24 : 24 })
}

const rowVariants: Variants = {
    center: { opacity: 1, x: 0 },
    enter: { opacity: 0, x: 8 }
}

export interface ITreeRowContent {
    actions?: ReactNode
    count?: ReactNode
    description?: ReactNode
    label?: ReactNode
    leading?: ReactNode
    meta?: ReactNode
}

interface IProps<T> {
    emptyLabel: ReactNode
    onSelect: (item: T, node: ITreeNode<T>) => void
    renderRow: (node: ITreeNode<T>, isFolder: boolean) => ITreeRowContent
    rootLabel: ReactNode
    tree: ITreeNode<T>[]
}

export function TreeBrowser<T>(props: IProps<T>) {
    const { emptyLabel, onSelect, renderRow, rootLabel, tree } = props

    const {
        currentPath,
        direction,
        focusedIndex,
        handleKeyDown,
        level,
        levelKey,
        navigate,
        registerRow,
        setActiveIndex
    } = useTreeNavigation(tree)

    return (
        <div className={classes.panel} data-autofocus onKeyDown={handleKeyDown} tabIndex={-1}>
            <div className={classes.panelHeader}>
                <TreeBreadcrumbs onNavigate={navigate} path={currentPath} rootLabel={rootLabel} />
            </div>

            <ScrollArea className={classes.levels} scrollbars="y" type="auto">
                <AnimatePresence custom={direction} initial={false} mode="wait">
                    <motion.div
                        animate="center"
                        custom={direction}
                        exit="exit"
                        initial="enter"
                        key={levelKey}
                        style={{ willChange: 'transform, opacity' }}
                        transition={{ duration: 0.14, ease: 'easeOut', staggerChildren: 0.02 }}
                        variants={levelVariants}
                    >
                        {level.length === 0 ? (
                            <Text c="dimmed" className={classes.empty} size="sm">
                                {emptyLabel}
                            </Text>
                        ) : (
                            level.map((node, index) => {
                                const isFolder = node.children.length > 0
                                const content = renderRow(node, isFolder)

                                return (
                                    <UnstyledButton
                                        className={classes.row}
                                        component={motion.button}
                                        data-has-actions={content.actions ? true : undefined}
                                        data-tree-row
                                        key={node.path}
                                        onClick={() => {
                                            if (isFolder) navigate([...currentPath, node.label])
                                            else if (node.item) onSelect(node.item, node)
                                        }}
                                        onFocus={() => setActiveIndex(index)}
                                        ref={registerRow(index)}
                                        style={{ willChange: 'transform, opacity' }}
                                        tabIndex={index === focusedIndex ? 0 : -1}
                                        transition={{ duration: 0.14, ease: 'easeOut' }}
                                        variants={rowVariants}
                                    >
                                        <Group gap="sm" justify="space-between" wrap="nowrap">
                                            <Group gap="sm" miw={0} wrap="nowrap">
                                                {content.leading ??
                                                    (isFolder && (
                                                        <TbFolder
                                                            className={classes.folderIcon}
                                                            size={18}
                                                        />
                                                    ))}

                                                <div className={classes.labels}>
                                                    <Text
                                                        fw={isFolder ? 600 : 500}
                                                        size="sm"
                                                        truncate
                                                    >
                                                        {content.label ?? node.label}
                                                    </Text>

                                                    {content.description && (
                                                        <div className={classes.description}>
                                                            {content.description}
                                                        </div>
                                                    )}
                                                </div>
                                            </Group>

                                            <div className={classes.rowEnd}>
                                                {content.meta}

                                                <Text
                                                    c="dimmed"
                                                    className={classes.count}
                                                    size="xs"
                                                >
                                                    {content.count ??
                                                        (isFolder ? node.total : null)}
                                                </Text>

                                                <div className={classes.actions}>
                                                    {content.actions}
                                                </div>

                                                <span className={classes.chevronSlot}>
                                                    {isFolder && (
                                                        <TbChevronRight
                                                            className={classes.chevron}
                                                            size={16}
                                                        />
                                                    )}
                                                </span>
                                            </div>
                                        </Group>
                                    </UnstyledButton>
                                )
                            })
                        )}
                    </motion.div>
                </AnimatePresence>
            </ScrollArea>
        </div>
    )
}
