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

/**
 * 対象ノードの親として背景枠を設定し、当該親を返す
 *
 * @param {cc.Node} targetNode
 * @param {cc.Color} color
 * @return {cc.LayerColor}
 */
export function createBgLayer(targetNode, color) {
  const box = targetNode.getContentSize();
  const bg = new cc.LayerColor(color, box.width * 1.2, box.height);

  const bgBox = bg.getContentSize();
  targetNode.setPosition(bgBox.width / 2, bgBox.height / 2);
  bg.addChild(targetNode);

  return bg;
}
