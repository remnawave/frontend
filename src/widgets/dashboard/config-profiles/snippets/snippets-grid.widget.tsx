import { ActionIcon, CopyButton, Tooltip } from '@mantine/core'
import { GetSnippetsCommand } from '@remnawave/backend-contract'
import cx from 'clsx'
import { t } from 'i18next'
import { useMemo } from 'react'
import { PiCheck, PiCopy } from 'react-icons/pi'
import { TbBraces, TbCode, TbFolder, TbPencil, TbTrash } from 'react-icons/tb'

import { EmptyPageLayout } from '@shared/ui/layouts/empty-page'
import { buildTree, ITreeNode, ITreeRowContent, TreeBrowser } from '@shared/ui/tree-browser'

import classes from './Snippets.module.css'
import { TSnippet } from './types'
import { useSnippetActions } from './use-snippet-actions'

const countItems = (snippet: unknown) => (Array.isArray(snippet) ? snippet.length : 0)

const getName = (snippet: TSnippet) => snippet.name

interface IProps {
    snippets: GetSnippetsCommand.Response['response'] | undefined
}

export const SnippetsGridWidget = (props: IProps) => {
    const { snippets } = props

    const tree = useMemo(() => buildTree(snippets?.snippets ?? [], getName), [snippets])

    const { deletingName, handleDelete, handleEdit } = useSnippetActions()

    if (!snippets || snippets.snippets.length === 0) {
        return <EmptyPageLayout icon={<TbCode size={32} />} />
    }

    const stop = (handler: () => void) => (event: React.MouseEvent) => {
        event.stopPropagation()
        handler()
    }

    const renderRow = (node: ITreeNode<TSnippet>, isFolder: boolean) => {
        const snippet = node.item

        const content: ITreeRowContent = {}

        if (snippet) {
            content.count = isFolder ? undefined : countItems(snippet.snippet)

            content.leading = (
                <>
                    {isFolder && <TbFolder className={classes.folderGlyph} size={18} />}

                    <CopyButton timeout={1500} value={snippet.name}>
                        {({ copied, copy }) => (
                            <Tooltip label={snippet.name}>
                                <ActionIcon
                                    className={classes.leadAction}
                                    color={copied ? 'teal' : 'gray'}
                                    component="div"
                                    onClick={stop(copy)}
                                    size="sm"
                                    variant="subtle"
                                >
                                    {copied ? (
                                        <PiCheck size="16px" />
                                    ) : (
                                        <>
                                            <TbBraces
                                                className={cx(
                                                    classes.snippetIcon,
                                                    classes.glyphType
                                                )}
                                                size={18}
                                            />
                                            <PiCopy className={classes.glyphCopy} size="16px" />
                                        </>
                                    )}
                                </ActionIcon>
                            </Tooltip>
                        )}
                    </CopyButton>
                </>
            )

            content.actions = (
                <>
                    {isFolder && (
                        <ActionIcon
                            color="gray"
                            component="div"
                            onClick={stop(() => handleEdit(snippet))}
                            size="sm"
                            variant="subtle"
                        >
                            <TbPencil size={16} />
                        </ActionIcon>
                    )}

                    <ActionIcon
                        color="red"
                        component="div"
                        loading={deletingName === snippet.name}
                        onClick={stop(() => handleDelete(snippet.name))}
                        size="sm"
                        variant="subtle"
                    >
                        <TbTrash size={16} />
                    </ActionIcon>
                </>
            )
        }

        return content
    }

    return (
        <TreeBrowser
            emptyLabel={t('common.message.nothing-found')}
            onSelect={handleEdit}
            renderRow={renderRow}
            rootLabel={t('snippets.drawer.widget.snippets')}
            tree={tree}
        />
    )
}
