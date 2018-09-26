const path = require('path');
const spawnSync = require('child_process').spawnSync;
const os = require('os');

const nodePath = process.argv[0];
spawnSync(nodePath, [path.resolve(__dirname, 'build.js')], {
  stdio: 'inherit',
});

const platform = 'Darwin' === os.type() ? 'ios' : 'android';
const cwd = path.resolve(__dirname, '../..');
spawnSync('cordova', ['prepare', platform, '-d'], {stdio: 'inherit', cwd});
spawnSync('cordova', ['emulate', platform, '-d'], {stdio: 'inherit', cwd});
