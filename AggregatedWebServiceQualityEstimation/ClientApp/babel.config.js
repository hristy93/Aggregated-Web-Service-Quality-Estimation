module.exports = function (api) {
  api.cache(true);

  const presets = [ "@babel/preset-env","@babel/preset-react" ];
  const plugins = [ "@babel/plugin-proposal-class-properties", "istanbul"];

  return {
    presets,
    plugins
  };
}