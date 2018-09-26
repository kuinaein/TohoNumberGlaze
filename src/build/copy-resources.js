const path = require('path');
const fs = require('fs');
const copyDir = require('copy-dir');

const COCOS_X_ROOT = process.env['COCOS_X_ROOT'];

/**
 * @param {string} path
 */
function ensureDir(path) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
}

if (!COCOS_X_ROOT || !fs.existsSync(COCOS_X_ROOT)) {
  throw new Error('環境変数 COCOS_X_ROOT が未設定');
}
const frameworksDir = path.resolve(__dirname, '../frameworks');
ensureDir(frameworksDir);
copyDir.sync(
    path.resolve(COCOS_X_ROOT, 'web'),
    path.resolve(frameworksDir, 'cocos2d-html5'),
    (state, filepath, filename) => -1 == ['template', 'tools'].indexOf(filename)
);

const distDir = path.resolve(__dirname, '../dist');
ensureDir(distDir);
copyDir.sync(path.resolve(__dirname, '../static'), distDir);
