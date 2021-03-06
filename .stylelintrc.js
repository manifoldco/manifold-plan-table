module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-rational-order',
    'stylelint-config-prettier',
  ],
  rules: {
    'at-rule-no-unknown': [true, { ignoreAtRules: ['use', 'extend', 'include'] }], // allow Sass syntax
    'color-hex-length': null, // 6 digits is fine / coming from figma
    'custom-property-empty-line-before': null, // Space makes nested css more readable
    'declaration-colon-newline-after': null, // let Prettier decide (when to put values on a new line new line)
    'property-no-vendor-prefix': null, // some properties need vendor prefixes
    'selector-type-no-unknown': [
      true,
      {
        ignore: ['custom-elements'], // allow custom element selectors
      },
    ],
    'value-list-comma-newline-after': null, // let Prettier decide (when to put comma separated values on new lines)
  },
  syntax: 'scss',
};
