/** @typedef {typeof cc.Layer} LayerClass */
/** @typedef {typeof cc.Scene} SceneClass */

/**
 * @param {*} layerProps
 * @param {?LayerClass} layerClass
 * @param {?*} sceneProps
 * @return {SceneClass}
 */
export function createSimpleScene(layerProps, layerClass, sceneProps) {
  const LayerClassOb = (layerClass || cc.Layer).extend(layerProps);

  /** @type {cc.Scene} */
  const defaultSceneProps = {
    onEnter() {
      this._super();
      const layer = new LayerClassOb();
      this.addChild(layer);
    },
  };
  const composedSceneProps = Object.assign(defaultSceneProps, sceneProps || {});
  return cc.Scene.extend(composedSceneProps);
}
