import { Breadcrumbs } from '@mantine/core';
import { GoDotFill as BreadcrumbsSeparator } from 'react-icons/go';

export default {
  Breadcrumbs: Breadcrumbs.extend({
    defaultProps: {
      separator: (
        <BreadcrumbsSeparator size="0.5rem" color="var(--mantine-color-dimmed)" opacity={0.4} />
      ),
    },
  }),
};
