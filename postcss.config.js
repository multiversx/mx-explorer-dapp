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
        './node_modules/react-select/**/*.js',
        './node_modules/react-simple-maps/**/*.js',
        './node_modules/recharts/**/*.js',
        './node_modules/@multiversx/sdk-dapp/**/*.js',
        './node_modules/@multiversx/sdk-dapp-sc-explorer/**/*.js'
      ],
      safelist: {
        deep: [
          /^dropdown/,
          /^tooltip/,
          /^popover/,
          /^modal/,
          /^nav/,
          /^styled-select/,
          /^tabs/,
          /^mx-sdk-sc/,
          /^styled-select/
        ],
        greedy: [/^bs-/, /^mx-sdk-sc-/]
      }
    })
  ]
};

// TODO - remove / update / safelist dynamic classes
// TODO - styled components
