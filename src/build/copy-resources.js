const path = require('path');
const fs = require('fs');
const copyDir = require('copy-dir');

const COCOS_X_ROOT = process.env['COCOS_X_ROOT'];

/**
 * @param {string} src
 * @param {string} dest
 * @param {?function(string, string, string): boolean} filter
 */
function copyResource(src, dest, filter) {
  const parent = path.dirname(dest);
  if (!fs.existsSync(parent)) {
    fs.mkdirSync(parent);
  }
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest);
  }
  copyDir.sync(src, dest, filter);
}

if (!COCOS_X_ROOT || !fs.existsSync(COCOS_X_ROOT)) {
  throw new Error('環境変数 COCOS_X_ROOT が未設定');
}
copyResource(
    path.resolve(COCOS_X_ROOT, 'web'),
    path.resolve(__dirname, '../frameworks/cocos2d-html5'),
    (state, filepath, filename) => -1 == ['template', 'tools'].indexOf(filename)
);

const distDir = path.resolve(__dirname, '../dist');
copyResource(path.resolve(__dirname, '../static'), distDir);
copyResource(
    path.resolve(__dirname, '../assets/res'),
    path.resolve(distDir, 'res'),
    (state, filepath, filename) => '.git' !== filename
);
