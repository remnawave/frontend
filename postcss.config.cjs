module.exports = {
  plugins: {
    'postcss-preset-mantine': {
      autoRem: true,
    },
    'postcss-simple-vars': {
      variables: {
        'mantine-breakpoint-xs': '30em',
        'mantine-breakpoint-sm': '40em',
        'mantine-breakpoint-md': '48em',
        'mantine-breakpoint-lg': '64em',
        'mantine-breakpoint-xl': '80em',
        'mantine-breakpoint-2xl': '96em',
        'mantine-breakpoint-3xl': '120em',
        'mantine-breakpoint-4xl': '160em',
      },
    },
  },
};
