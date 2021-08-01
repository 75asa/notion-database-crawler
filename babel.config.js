// babel.config.js
module.exports = (api) => ({
  presets: [
    [
      '@babel/preset-env',
      '@babel/preset-react',
      {
        runtime: 'automatic',
        importSource: 'jsx-slack',
        development: api.env('development'),
      },
    ],
  ],
})

