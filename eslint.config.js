import antfu from '@antfu/eslint-config'

export default antfu(
  {
    overrides: {
      vue: {
        'vue/no-v-text-v-html-on-component': 'off',
        'vue/component-name-in-template-casing': 'off',
      },
    },
    vue: true,
    react: false,
    formatters: {
      markdown: true,
      css: true,
      slidev: {
        files: [
          'pages/**/*.md',
          'parts/**/*.md',
          '**/slides.md',
        ],
      },
    },
  },
)
