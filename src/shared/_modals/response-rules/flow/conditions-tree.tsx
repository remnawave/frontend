import { Text } from '@mantine/core'

import { asNode, asText, IConditionNode, OPERATOR_PHRASES } from './condition-node'
import classes from './conditions.module.css'

export function ConditionSentence({ node }: { node: IConditionNode }) {
    const operator = asText(node.operator)
    const isList = Array.isArray(node.value)
    const values = isList ? (node.value as unknown[]) : node.value === undefined ? [] : [node.value]
    const phrase = OPERATOR_PHRASES[operator]?.[isList ? 1 : 0] ?? operator

    return (
        <div className={classes.sentence}>
            <span className={classes.header}>{asText(node.headerName) || '?'}</span>
            <span className={classes.operator}>{phrase}</span>
            {values.map((value, index) => (
                <span className={classes.token} key={index}>
                    {asText(value)}
                </span>
            ))}
            {typeof node.versionPattern === 'string' && (
                <>
                    <span className={classes.operator}>from</span>
                    <span className={classes.token}>{node.versionPattern}</span>
                </>
            )}
            {node.caseSensitive === true && <span className={classes.note}>case-sensitive</span>}
        </div>
    )
}

export function ConditionsGroup({
    conditions,
    operator
}: {
    conditions: unknown[]
    operator: unknown
}) {
    const joiner = operator === 'OR' ? 'or' : 'and'

    if (conditions.length === 0) {
        return (
            <Text c="dimmed" size="sm">
                No conditions – the rule always matches.
            </Text>
        )
    }

    return (
        <div className={classes.group}>
            {conditions.map((child, index) => {
                const node = asNode(child)

                return (
                    <div className={classes.row} key={index}>
                        <span
                            className={
                                index === 0
                                    ? classes.joiner
                                    : `${classes.joiner} ${joiner === 'or' ? classes.joinerOr : classes.joinerAnd}`
                            }
                        >
                            {index === 0 ? 'where' : joiner}
                        </span>
                        {Array.isArray(node.conditions) ? (
                            <div className={classes.nested}>
                                <ConditionsGroup
                                    conditions={node.conditions}
                                    operator={node.operator}
                                />
                            </div>
                        ) : (
                            <ConditionSentence node={node} />
                        )}
                    </div>
                )
            })}
        </div>
    )
}
