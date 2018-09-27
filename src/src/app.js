import {NumberPlaceScene} from '@/scene/NumberPlaceScene';

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
window.tng.MainScene = NumberPlaceScene;
