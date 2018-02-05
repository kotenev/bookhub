// http://eslint.org/docs/user-guide/configuring
const path = require('path');

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  globals: {
    React: true,
  },
  extends: 'airbnb',
  // check if imports actually resolve
  'settings': {
    'import/resolver': {
      'webpack': {
        'config': path.join(__dirname, 'webpack.config.js'),
      },
    },
    'import/alias': {
      '@p': path.join(__dirname, 'src', 'components'),
      '@n': path.join(__dirname, 'src', 'containers'),
    }
  },
  // add your custom rules here
  'rules': {
    // don't require .js .jsx extension when importing
    'import/extensions': ['error', 'always', {
      'js': 'never',
      'jsx': 'never'
    }],
    'arrow-parens': ['error', 'as-needed'],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}