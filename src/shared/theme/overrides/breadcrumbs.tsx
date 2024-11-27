import { GoDotFill as BreadcrumbsSeparator } from 'react-icons/go';
import { Breadcrumbs } from '@mantine/core';

export default {
    Breadcrumbs: Breadcrumbs.extend({
        defaultProps: {
            separator: (
                <BreadcrumbsSeparator
                    size="0.5rem"
                    color="var(--mantine-color-dimmed)"
                    opacity={0.4}
                />
            ),
        },
    }),
};
