function applyCache() {
  return process.env.NODE_ENV === 'development';
}

module.exports = function configBabel(api) {
  api.cache(applyCache);

  return {
    presets: [
      ['@babel/preset-env', {
        targets: {
          node: 'current',
        },
      }],
    ],
    plugins: [
      '@babel/plugin-syntax-dynamic-import',
    ],
  };
};
