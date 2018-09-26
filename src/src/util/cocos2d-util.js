/**
 * @param {*} layerProps
 * @param {?cc.Layer} baseClass
 * @param {?*} props Scene のプロパティ
 * @return {*} Scene派生クラスのコンストラクタを返す
 */
export function createSimpleScene(layerProps, baseClass, props) {
  const LayerClass = (baseClass || cc.Layer).extend(layerProps);
  /** @type {cc.Scene} */
  const sceneProps = Object.assign(
      {},
      {
        onEnter() {
          this._super();
          const layer = new LayerClass();
          this.addChild(layer);
        },
      },
      props || {}
  );
  return cc.Scene.extend(sceneProps);
}
