const purgecss = require('@fullhuman/postcss-purgecss');

module.exports = {
  plugins: [
    purgecss({
      content: [
        'index.html',
        './src/**/*.ts',
        './src/**/*.tsx',
        './node_modules/react-bootstrap/**/*.js',
        './node_modules/react-datepicker/**/*.js',
        './node_modules/react-select/**/*.js'
      ],
      variables: true,
      safelist: {
        standard: ['html', 'body', 'tooltip', 'popover', 'modal'],
        deep: [
          /^dropdown/,
          /^tooltip/,
          /^popover/,
          /^modal/,
          /^styled-select/,
          /^tabs/
        ]
      }
    })
  ]
};
