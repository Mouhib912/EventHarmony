module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react', 'react-hooks', 'jsx-a11y'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'jsx-a11y/anchor-is-valid': 'warn',
    'no-unused-vars': ['error', { argsIgnorePattern: 'props|ref|state' }],
    'prefer-const': ['error'],
    'no-var': ['error'],
    'eqeqeq': ['error', 'always'],
    'semi': ['error', 'always'],
    'quotes': ['error', 'single', { allowTemplateLiterals: true }],
    'indent': ['error', 2, { SwitchCase: 1 }],
    'comma-dangle': ['error', 'always-multiline'],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};