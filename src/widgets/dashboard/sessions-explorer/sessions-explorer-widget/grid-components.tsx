import { SimpleGrid } from '@mantine/core'
import { forwardRef } from 'react'

export const SessionsExplorerVirtualizedGridComponents = {
    List: forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>(
        ({ style, children, ...props }, ref) => (
            <SimpleGrid
                {...props}
                cols={{
                    base: 1,
                    '800px': 2,
                    '1200px': 3,
                    '1600px': 4,
                    '2000px': 5,
                    '2400px': 6,
                    '3000px': 7
                }}
                ref={ref}
                style={{
                    ...style
                }}
                type="container"
            >
                {children}
            </SimpleGrid>
        )
    ),
    Item: ({ children, ...props }: React.HTMLProps<HTMLDivElement>) => (
        <div {...props}>{children}</div>
    )
}
