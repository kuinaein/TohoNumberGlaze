import {TitleScene} from '@/scene/TitleScene';

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
window.tng.FirstScene = TitleScene;
