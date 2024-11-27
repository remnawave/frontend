import { ActionIcon, Button } from '@mantine/core';

export default {
  ActionIcon: ActionIcon.extend({
    defaultProps: {
      radius: 'md',
      variant: 'subtle',
    },
  }),
  Button: Button.extend({
    defaultProps: {
      radius: 'sm',
    },
  }),
};
