import { InputBase, PasswordInput } from '@mantine/core';

export default {
  InputBase: InputBase.extend({
    defaultProps: {
      radius: 'md',
    },
  }),
  PasswordInput: PasswordInput.extend({
    defaultProps: {
      radius: 'md',
    },
  }),
};
