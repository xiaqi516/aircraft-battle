module.exports = {
    env: {
        node: true,
    },
    parserOptions: {
        parser: '@typescript-eslint/parser',
        ecmaVersion: 6,
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
    },
    plugins: ['@typescript-eslint', 'import'],
    extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',
    ],
    ignorePatterns: ['.eslintrc.js'],
    rules: {
        "linebreak-style": ["error", "windows"],
        "@typescript-eslint/no-unused-vars": ["warn"],
        '@typescript-eslint/indent': ['warn', 4],
        '@typescript-eslint/lines-between-class-members': 0,
        'implicit-arrow-linebreak': 0,
        'arrow-parens': ['error', 'always'],
        '@typescript-eslint/no-explicit-any': [0],
        '@typescript-eslint/explicit-function-return-type': ['warn', { allowExpressions: true }],
        'no-restricted-syntax': [0, { selector: 'ForOfStatement' }],
        'no-plusplus': [0],
        'lines-between-class-members': [0],
        'quotes': ['error', 'single'],
        'max-len': ['error', { code: 120, ignoreStrings: true }],
        'func-names': ['warn', 'never'],
        'operator-linebreak': ['error', 'after'],
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/ban-types': [
            'error',
            {
                types: {
                    '{}': false,
                    object: false,
                    Function: false,
                },
            },
        ],
        'import/order': [
            'error',
            {
                'groups': ['builtin', 'external', 'internal'],
            }
        ]
    },
    settings: {
        'import/resolver': {
            node: {
                paths: ['src', `${__dirname}/src`],
            },
        },
    },
};
