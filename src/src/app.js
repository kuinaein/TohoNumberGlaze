import {createSimpleScene} from '@/util/cocos2d-util';

/** @param {*} err */
function knDefaultErrorHandler(err) {
  if (err.message) {
    alert(err.message);
  } else {
    alert(err);
  }
}
window.addEventListener('error', knDefaultErrorHandler);
window.addEventListener('unhandledrejection', knDefaultErrorHandler);

window.tng = window.tng || {};

window.tng.MainScene = createSimpleScene({});
