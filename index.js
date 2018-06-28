'use strict';

const plugin = require('../..');
const selfPlugin = Object.assign({}, plugin);

const pkgName = require('../../package.json').name;
let pluginName;
if (pkgName[0] === "@") {
  const parts = pkgName.split('/');
  const matches = pkgName.match(/^(@[^/]+)\/eslint-plugin(?:-(.*))?$/);
  pluginName = matches.slice(1, 3).filter(Boolean).join('/');
} else {
  pluginName = pkgName.replace(/^eslint-plugin-/, '');
}

if (plugin.configs) {
  selfPlugin.configs = Object.assign({}, plugin.configs);

  Object.keys(plugin.configs).forEach(configName => {
    const config = plugin.configs[configName];
    selfPlugin.configs[configName] = Object.assign({}, config);
    if (config.extends) {
      selfPlugin.configs[configName].extends = [].concat(config.extends)
        .map(extendsName => extendsName.replace(`plugin:${pluginName}/`, 'plugin:self/'));
    }
    if (config.rules) {
      selfPlugin.configs[configName].rules = Object.assign({}, config.rules);
      Object.keys(config.rules).forEach(ruleName => {
        if (ruleName.startsWith(`${pluginName}/`)) {
          selfPlugin.configs[configName].rules[`self${ruleName.slice(ruleName.lastIndexOf('/'))}`] = config.rules[ruleName];
          delete selfPlugin.configs[configName].rules[ruleName];
        }
      });
    }
  });
}

module.exports = selfPlugin;
