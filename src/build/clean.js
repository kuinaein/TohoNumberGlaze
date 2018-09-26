const path = require('path');
const rimraf = require('rimraf');

rimraf.sync(path.resolve(__dirname, '../dist'));
rimraf.sync(path.resolve(__dirname, '../frameworks'));
rimraf.sync(path.resolve(__dirname, '../platforms'));
rimraf.sync(path.resolve(__dirname, '../plugins'));
