import antfu from '@antfu/eslint-config'

export default antfu({
  ignorePatterns: ['!pages/public'],
  overrides: [
    {
      files: ['locales/**.json'],
      rules: {
        'jsonc/sort-keys': 'error',
      },
    },
  ],
  rules: {
    'vue/no-restricted-syntax': ['error', {
      selector: 'VElement[name=\'a\']',
      message: 'Use NuxtLink instead.',
    }],
    'n/prefer-global/process': 'off',
    // TODO: temporary disabled for eslint-config upgrade
    'node/prefer-global/process': 'off',
  },
})
