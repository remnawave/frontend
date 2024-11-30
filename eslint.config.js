// import mantine from 'eslint-config-mantine';
// import tseslint from 'typescript-eslint';

// export default tseslint.config(
//   ...mantine,
//   { ignores: ['**/*.{mjs,cjs,js,d.ts,d.mts}', './.storybook/main.ts'] },
// );

export default {
    env: { browser: true, es2020: true },
    plugins: ['react-refresh', 'import', 'perfectionist'],
    extends: [
        'eslint:recommended',
        'airbnb-base',
        'plugin:@typescript-eslint/recommended',
        'plugin:react-hooks/recommended',
        'plugin:perfectionist/recommended-alphabetical-legacy',
        'prettier'
    ],
    ignorePatterns: [
        'dist',
        '.eslintrc.cjs',
        'plop',
        'plop/**',
        'plopfile.js',
        '.stylelintrc.js',
        'eslint.config.js'
    ],
    parser: '@typescript-eslint/parser',
    settings: {
        'import/parsers': {
            '@typescript-eslint/parser': ['.ts', '.tsx']
        },
        'import/resolver': {
            node: true,
            typescript: {
                project: '.'
            }
        }
    },
    rules: {
        indent: ['error', 4, { SwitchCase: 1 }],
        'max-classes-per-file': 'off',
        'import/no-extraneous-dependencies': ['off'],
        'import/no-unresolved': 'error',
        'import/prefer-default-export': 'off',
        'import/extensions': 'off',
        'no-bitwise': 'off',
        'no-plusplus': 'off',
        'no-restricted-syntax': ['off', 'ForInStatement'],
        'import/order': [
            'error',
            {
                'newlines-between': 'never'
            }
        ],
        'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
        'no-shadow': ['off'],
        'arrow-body-style': ['off'],
        'object-curly-spacing': ['error', 'always'],
        'array-bracket-spacing': ['error', 'never'],
        'no-underscore-dangle': [
            'off',
            {
                allow: ['_'],
                allowAfterThis: true,
                allowAfterSuper: true,
                allowAfterThisConstructor: true,
                enforceInMethodNames: false
            }
        ],
        semi: ['error', 'never'],
        'comma-dangle': ['off'],
        'brace-style': ['error', '1tbs', { allowSingleLine: true }],
        'object-curly-newline': ['error', { multiline: true, consistent: true }],
        'react-hooks/exhaustive-deps': 'off',
        'no-empty-pattern': 'warn',
        '@typescript-eslint/ban-types': [
            'error',
            {
                types: {
                    '{}': false
                }
            }
        ]
    }
}
