'use strict';

const plugin = require('../..');
const pluginName = require('../../package.json').name.replace(/^eslint-plugin-|\/eslint-plugin$/, '');
const selfPlugin = Object.assign({}, plugin);

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

console.log(selfPlugin)

module.exports = selfPlugin;
