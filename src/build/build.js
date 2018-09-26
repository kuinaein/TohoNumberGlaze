const path = require('path');
const fs = require('fs');
const spawnSync = require('child_process').spawnSync;
const copyDir = require('copy-dir');

const nodePath = process.argv[0];

spawnSync(nodePath, [path.resolve(__dirname, 'clean.js')], {stdio: 'inherit'});
spawnSync(nodePath, [path.resolve(__dirname, 'copy-resources.js')], {
  stdio: 'inherit',
});
const webpackPath = path.resolve(__dirname, '../node_modules/.bin/webpack');
spawnSync(nodePath, [webpackPath, '--progress', '--hide-modules'], {
  stdio: 'inherit',
});

const wwwDir = path.resolve(__dirname, '../../www');
if (!fs.existsSync(wwwDir)) {
  fs.mkdirSync(wwwDir);
}
fs.copyFileSync(
    path.resolve(__dirname, '../index.html'),
    path.resolve(wwwDir, 'index.html')
);
copyDir.sync(
    path.resolve(__dirname, '../frameworks'),
    path.resolve(wwwDir, 'frameworks')
);

const destDistDir = path.resolve(wwwDir, 'dist');
if (!fs.existsSync(destDistDir)) {
  fs.mkdirSync(destDistDir);
}
copyDir.sync(
    path.resolve(__dirname, '../dist'),
    destDistDir,
    (state, filepath, filename) => !filename.endsWith('.map')
);
